import express from 'express';
import pool from '../db/pool.js';

const router = express.Router();

router.post('/data', async (req, res) => {
  const { name, email, age, city } = req.body;

  // Validate the required fields
  if (!name || !email || !age || !city) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Insert the data into the database
    const result = await pool.query(
      'INSERT INTO data (name, email, age, city) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, age, city]
    );

    // Respond with the inserted row
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error inserting data:', error.stack);
    res.status(500).json({ error: 'Failed to insert data' });
  }
});

export default router;
