const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const allowedOrigins = [
  "http://localhost:3000",
  "https://myreeldream-app.vercel.app",
];
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
    credentials: true,
  },
});
const userSocketMap = new Map();
io.on("connection", (socket) => {
  console.log("A user connected: " + socket.id);
  // Register user with their socket ID
  socket.on("register", (userId) => {
    if (userId) {
      userSocketMap.set(userId, socket.id);
      console.log(`User registered: ${userId} -> ${socket.id}`);
      console.log("Current userSocketMap", [...userSocketMap.entries()]);
    } else {
      console.log("Invalid userId provided for registration.");
    }
  });
  // Handle chat messages
  socket.on("chat message", (msg) => {
    if (msg) {
      io.emit("chat message", msg); // Broadcast to all
      console.log("Message sent:", msg);
    }
  });
  // Handle notifications
  socket.on("send notification", (notificationData) => {
    console.log("Notification received:", notificationData);
    if (!notificationData.receiver_id) {
      console.error("Invalid receiver_id in notificationData");
      return;
    }
    const targetSocketId = userSocketMap.get(notificationData.receiver_id);
    console.log("targetSocketId", targetSocketId);
    if (targetSocketId) {
      io.emit("receive notification", notificationData);
      console.log(`Notification sent to ${notificationData.receiver_id}`);
    } else {
      console.log(`User ${notificationData.receiver_id} is not connected.`);
    }
  });
  // Handle disconnect
socket.on("disconnect", () => {
  console.log("Before disconnect cleanup:", [...userSocketMap.entries()]);
  userSocketMap.forEach((value, key) => {
    if (value === socket.id) {
      userSocketMap.delete(key);
      console.log(`Removed user ${key} associated with socket ${value}`);
    }
  });
  console.log("After disconnect cleanup:", [...userSocketMap.entries()]);
  console.log("A user disconnected: " + socket.id);
});
});
app.get("/", (req, res) => {
  res.send("<h1>Socket.IO Server</h1>");
});
const PORT = 8000;
server.listen(PORT, () => {
  console.log(`Socket server running on http://localhost:${PORT}`);
});