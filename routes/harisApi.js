// routes/employeeRoutes.js
import express from 'express';
import pool from '../db/pool.js'; // Replace with your actual database connection setup

const router = express.Router();

// Create a new employee
router.post('/employees', async (req, res) => {
  const { first_name, last_name, email, password, date } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO employees (first_name, last_name, email, password, date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [first_name, last_name, email, password, date]
    );

    res.status(201).json({ message: 'Employee added successfully', employee: result.rows[0] });
  } catch (error) {
    console.error('Error adding employee:', error.stack);
    res.status(500).json({ error: 'Failed to add employee' });
  }
});

// Get all employees
router.get('/employees', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM employees');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching employees:', error.stack);
    res.status(500).json({ error: 'Failed to fetch employees' });
  }
});

// Get a single employee by ID
router.get('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('SELECT * FROM employees WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching employee:', error.stack);
    res.status(500).json({ error: 'Failed to fetch employee' });
  }
});

// Update an employee by ID
router.put('/employees/:id', async (req, res) => {
  const { id } = req.params;
  const { first_name, last_name, email, password, date } = req.body;

  try {
    const result = await pool.query(
      'UPDATE employees SET first_name = $1, last_name = $2, email = $3, password = $4, date = $5 WHERE id = $6 RETURNING *',
      [first_name, last_name, email, password, date, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully', employee: result.rows[0] });
  } catch (error) {
    console.error('Error updating employee:', error.stack);
    res.status(500).json({ error: 'Failed to update employee' });
  }
});

// Delete an employee by ID
router.delete('/employees/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM employees WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee deleted successfully', employee: result.rows[0] });
  } catch (error) {
    console.error('Error deleting employee:', error.stack);
    res.status(500).json({ error: 'Failed to delete employee' });
  }
});

export default router;
