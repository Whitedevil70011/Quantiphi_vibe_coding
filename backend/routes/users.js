const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// GET all users
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT id AS "_id", name, avatar, color FROM users ORDER BY created_at ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create user
router.post('/', async (req, res) => {
  try {
    const { name, avatar, color } = req.body;
    const result = await pool.query(
      `INSERT INTO users (name, avatar, color)
       VALUES ($1, $2, $3)
       RETURNING id AS "_id", name, avatar, color`,
      [name, avatar || '', color || '#6c63ff']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE user
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
