const express = require('express');
const router = express.Router();
const Task = require('../models/Task');

// GET all tasks (with optional priority filter)
router.get('/', async (req, res) => {
  try {
    const filter = {};
    if (req.query.priority) filter.priority = req.query.priority;
    const tasks = await Task.find(filter).populate('assignedUser', 'name color');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create task
router.post('/', async (req, res) => {
  try {
    const task = new Task(req.body);
    await task.save();
    const populated = await task.populate('assignedUser', 'name color');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update task (status change / full update)
router.patch('/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedUser', 'name color');
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE task
router.delete('/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
