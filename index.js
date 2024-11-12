// index.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import dataRoutes from './routes/dataRoutes.js';
import dataPost from './routes/dataPost.js';

dotenv.config();

// Initialize Express
const app = express();
app.use(cors());
app.use(express.json()); // for parsing application/json

// Use the data routes
app.use('/', dataRoutes);
app.use('/', dataPost);

// Start the server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
