// routes/dataRoutes.js
import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

// Sample endpoint
router.get('/', (req, res) => {
  res.send('Welcome to the Node.js and Express server with PostgreSQL!');
});

// Endpoint to get all rows from a sample table
router.get('/data', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM data');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching data:', error.stack);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

export default router;
