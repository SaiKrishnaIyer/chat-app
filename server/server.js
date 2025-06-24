import express from 'express';
import "dotenv/config";
import cors from 'cors';
import http from 'http';
import { connectDB } from './lib/db.js';
import userRouter from './routes/userRoutes.js';
import messageRouter from './routes/messageRoutes.js';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from './models/User.js';

const app = express();
const server = http.createServer(app);

// Socket.IO Server Configuration
export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"]
  },
  connectionStateRecovery: {
    maxDisconnectionDuration: 2 * 60 * 1000,
  }
});

// Store online users
export const userSocketMap = {};

// Socket.IO Authentication Middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth?.token || socket.handshake.headers?.token;
    
    if (!token) {
      console.log('Connection attempt without token');
      socket.authRequired = true;
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      console.log('User not found in database');
      return next(new Error('User not found'));
    }

    socket.user = user;
    console.log(`User authenticated: ${user._id}`);
    return next();
  } catch (error) {
    console.log('Authentication error:', error.message);
    return next(new Error('Authentication failed'));
  }
});

// Socket.IO Connection Handler
io.on("connection", (socket) => {
  if (socket.user) {
    handleAuthenticatedSocket(socket);
  } else {
    handleUnauthenticatedSocket(socket);
  }

  socket.on("disconnect", () => handleDisconnection(socket));
});

// Helper Functions
function handleAuthenticatedSocket(socket) {
  const userId = socket.user._id.toString();
  userSocketMap[userId] = socket.id;
  
  console.log(`User connected: ${userId}`);
  io.emit("onlineUsers", Object.keys(userSocketMap));

  socket.on("authenticate", (_, callback) => {
    callback({ success: true, message: "Already authenticated" });
  });

  // Add your other event handlers here
}

function handleUnauthenticatedSocket(socket) {
  console.log(`Unauthenticated client connected: ${socket.id}`);

  socket.on("authenticate", async (token, callback) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      
      if (!user) {
        return callback({ success: false, error: "User not found" });
      }

      socket.user = user;
      handleAuthenticatedSocket(socket);
      callback({ success: true, user: user._id });
    } catch (error) {
      callback({ success: false, error: error.message });
    }
  });

  // Set timeout for unauthenticated connections
  const authTimeout = setTimeout(() => {
    if (!socket.user) {
      console.log(`Disconnecting unauthenticated client: ${socket.id}`);
      socket.disconnect();
    }
  }, 30000); // 30 seconds timeout

  socket.on("disconnect", () => clearTimeout(authTimeout));
}

function handleDisconnection(socket) {
  if (socket.user) {
    const userId = socket.user._id.toString();
    delete userSocketMap[userId];
    console.log(`User disconnected: ${userId}`);
    io.emit("onlineUsers", Object.keys(userSocketMap));
  } else {
    console.log(`Anonymous client disconnected: ${socket.id}`);
  }
}

// Express Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "*",
  credentials: true
}));
app.use(express.json({ limit: "4mb" }));

// Routes
app.use("/api/status", (req, res) => res.json({ status: "OK" }));
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);

// Connect to MongoDB and start server
(async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`WebSocket endpoint: ws://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error);
    process.exit(1);
  }
})();