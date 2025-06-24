```markdown
# ⚡ Quick Chat

**Quick Chat** is a real-time full-stack chat application built with **React**, **Node.js**, **Express**, **MongoDB**,
and **Socket.IO**. It supports instant messaging, typing indicators, online presence, and authentication.

---

## 🚀 Features

- ✅ Real-time 1:1 chat using Socket.IO
- 🟢 Online/offline user status
- ✍️ Typing indicator
- 🔐 JWT-based authentication
- 👤 User profile management
- 🧠 Unseen message counts
- 🗂 Scalable architecture with modular components

---

## 🛠 Tech Stack

### Frontend:
- React with Hooks & Context API
- TailwindCSS for UI
- React Router for navigation
- Socket.IO client

### Backend:
- Node.js + Express.js
- MongoDB with Mongoose
- Socket.IO for real-time communication
- JWT Authentication
- dotenv for environment config

---

## 📁 Project Structure

```

/client          => React Frontend
/server          => Express Backend
└── routes     => API routes for users and messages
└── models     => Mongoose models
└── lib        => DB connection and helpers

````

---

## 🔧 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/quick-chat.git
cd quick-chat
````

---

### 2. Backend Setup

```bash
cd server
npm install
```

#### Create a `.env` file in `/server` with the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:3000
```

#### Start the backend:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../client
npm install
```

#### Start the frontend:

```bash
npm start
```

---

## 🔄 Real-Time Flow (Socket.IO)

1. Frontend connects to WebSocket with token in `auth` payload.
2. Backend authenticates via middleware or post-connect `authenticate` event.
3. Online users are broadcasted to all clients.
4. Messages and typing events are emitted and received instantly.

---

## 📸 Screenshots
![Screenshot 2025-06-09 211500](https://github.com/user-attachments/assets/8700d07f-eb0b-467b-8a29-9a037bd1375c)
![Screenshot 2025-06-08 193701](https://github.com/user-attachments/assets/7fd28210-b0a5-4a2e-ad48-6a70f356a775)
![Screenshot 2025-06-08 193746](https://github.com/user-attachments/assets/8eae7361-2399-4470-88dd-288f89fdf2a3)
![Screenshot 2025-06-08 193549](https://github.com/user-attachments/assets/efaca5c2-f3f2-472e-a8ab-e1592f2bd616)
![Screenshot 2025-06-08 193635](https://github.com/user-attachments/assets/5201a202-a5d1-4f2c-bd0e-862eb87200af)

---

## 📦 API Endpoints (REST)

### Auth Routes

* `POST /api/auth/register` – Create new user
* `POST /api/auth/login` – Authenticate and return token

### Message Routes

* `GET /api/messages/:userId` – Get messages with a user
* `POST /api/messages/send` – Send a message

---

## 🧪 Future Improvements

* Group chat support
* Media & file sharing
* Dark mode toggle
* Message encryption
* Push notifications

---

## 👨‍💻 Contributing

Feel free to open issues or pull requests if you find a bug or want to improve something!

---

---

```

---

### ✅ To Use:
1. Save the file as `README.md` in your project root.
2. Replace:
   - `https://github.com/your-username/quick-chat.git`
   - `your_mongodb_connection_string`
   - `your_jwt_secret`
   - Any screenshot URLs with your own data.

```
