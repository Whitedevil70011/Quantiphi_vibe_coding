const express = require('express');
const router = express.Router();
const { pool } = require('../db');

// Helper to format rows with assignedUser object
const formatTask = (row) => ({
  _id: row._id,
  title: row.title,
  description: row.description,
  priority: row.priority,
  dueDate: row.dueDate,
  status: row.status,
  assignedUser: row.user_id ? {
    _id: row.user_id,
    name: row.user_name,
    color: row.user_color
  } : null
});

// GET all tasks (with optional priority filter)
router.get('/', async (req, res) => {
  try {
    const { priority } = req.query;
    let query = `
      SELECT 
        t.id AS "_id", 
        t.title, 
        t.description, 
        t.priority, 
        t.due_date AS "dueDate", 
        t.status,
        u.id AS user_id,
        u.name AS user_name,
        u.color AS user_color
      FROM tasks t
      LEFT JOIN users u ON t.assigned_user_id = u.id
    `;
    const params = [];
    if (priority) {
      query += ' WHERE t.priority = $1';
      params.push(priority);
    }
    query += ' ORDER BY t.created_at DESC';

    const result = await pool.query(query, params);
    res.json(result.rows.map(formatTask));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task
router.post('/', async (req, res) => {
  try {
    const { title, description, priority, dueDate, status, assignedUser } = req.body;
    const result = await pool.query(
      `INSERT INTO tasks (title, description, priority, due_date, status, assigned_user_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id`,
      [
        title,
        description || '',
        priority || 'Medium',
        dueDate || null,
        status || 'todo',
        assignedUser || null
      ]
    );

    // Fetch the populated created task
    const createdId = result.rows[0].id;
    const taskResult = await pool.query(
      `SELECT 
        t.id AS "_id", 
        t.title, 
        t.description, 
        t.priority, 
        t.due_date AS "dueDate", 
        t.status,
        u.id AS user_id,
        u.name AS user_name,
        u.color AS user_color
      FROM tasks t
      LEFT JOIN users u ON t.assigned_user_id = u.id
      WHERE t.id = $1`,
      [createdId]
    );

    res.status(201).json(formatTask(taskResult.rows[0]));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update task (status or any field)
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const fields = [];
    const values = [];
    let idx = 1;

    if (req.body.title !== undefined) {
      fields.push(`title = $${idx++}`);
      values.push(req.body.title);
    }
    if (req.body.description !== undefined) {
      fields.push(`description = $${idx++}`);
      values.push(req.body.description);
    }
    if (req.body.priority !== undefined) {
      fields.push(`priority = $${idx++}`);
      values.push(req.body.priority);
    }
    if (req.body.dueDate !== undefined) {
      fields.push(`due_date = $${idx++}`);
      values.push(req.body.dueDate || null);
    }
    if (req.body.status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(req.body.status);
    }
    if (req.body.assignedUser !== undefined) {
      fields.push(`assigned_user_id = $${idx++}`);
      values.push(req.body.assignedUser || null);
    }

    if (fields.length > 0) {
      values.push(id);
      await pool.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = $${idx}`, values);
    }

    const taskResult = await pool.query(
      `SELECT 
        t.id AS "_id", 
        t.title, 
        t.description, 
        t.priority, 
        t.due_date AS "dueDate", 
        t.status,
        u.id AS user_id,
        u.name AS user_name,
        u.color AS user_color
      FROM tasks t
      LEFT JOIN users u ON t.assigned_user_id = u.id
      WHERE t.id = $1`,
      [id]
    );

    if (taskResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(formatTask(taskResult.rows[0]));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
