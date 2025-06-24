import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to protect HTTP routes
export const protectRoute = async (req, res, next) => {
  try {
    const token = req.headers.token || req.cookies.token;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: "Not authorized, no token" 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found" 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("Authentication error:", error.message);
    return res.status(401).json({ 
      success: false, 
      message: "Not authorized, token failed" 
    });
  }
};

// Controller to check if user is authenticated
export const checkAuth = (req, res) => {
  res.json({
    success: true, 
    user: {
      _id: req.user._id,
      username: req.user.username,
      email: req.user.email,
      // Add other safe user fields here
    }
  });
};

// Socket.IO authentication helper (can be used in both HTTP and WS contexts)
export const authenticateUser = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    return { success: true, user };
  } catch (error) {
    return { success: false, error: error.message };
  }
};