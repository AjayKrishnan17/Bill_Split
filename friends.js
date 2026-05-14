const express = require('express');
const router = express.Router();
const Friend = require('../models/Friend');

// GET all friends
router.get('/', async (req, res) => {
  try {
    const friends = await Friend.find().sort({ createdAt: -1 });
    res.json({ success: true, data: friends });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create friend
router.post('/', async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }
    const existing = await Friend.findOne({ name: name.trim() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Friend already exists' });
    }
    const friend = await Friend.create({ name: name.trim() });
    res.status(201).json({ success: true, data: friend });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE friend
router.delete('/:id', async (req, res) => {
  try {
    const friend = await Friend.findByIdAndDelete(req.params.id);
    if (!friend) {
      return res.status(404).json({ success: false, message: 'Friend not found' });
    }
    res.json({ success: true, message: 'Friend deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;