const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: ['http://localhost:3000', 'https://myreeldream-app.vercel.app'],
    // Allow requests from your Next.js frontend
    methods: ['GET', 'POST'], // Allow specific methods
    allowedHeaders: ['Content-Type'], // Specify allowed headers if needed
    credentials: true, // Allow credentials (cookies, authorization headers)
  },
});

// Serve a basic test page
app.get('/', (req, res) => {
  res.send('<h1>Socket.IO Server</h1>');
});

// Handle socket connections
io.on('connection', (socket) => {
  console.log('A user connected: ' + socket.id);

  // Listen for chat messages and broadcast them to all connected clients
  socket.on('chat message', (msg) => {
    console.log('Message received:', JSON.stringify(msg)); // Log the entire msg object as JSON
console.log(msg,"msgggg");

    // Check if msg has a messageContent property and broadcast it
    if (msg) {
      io.emit('chat message', msg);
      console.log('Message sent:', msg);
       // Broadcast message content to all clients
    } else {
      console.log("Received message does not have 'messageContent' property.");
    }
  });

  // Handle disconnect event
  socket.on('disconnect', () => {
    console.log('A user disconnected: ' + socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Socket server running on http://localhost:${PORT}`);
});
