const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');

// GET all bills
router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find().sort({ createdAt: -1 });
    res.json({ success: true, data: bills });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET single bill
router.get('/:id', async (req, res) => {
  try {
    const bill = await Bill.findById(req.params.id);
    if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });
    res.json({ success: true, data: bill });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST create bill (calculate + save)
router.post('/', async (req, res) => {
  try {
    const { title, friends, payer, items } = req.body;

    if (!friends || friends.length < 2)
      return res.status(400).json({ success: false, message: 'At least 2 friends required' });
    if (!payer)
      return res.status(400).json({ success: false, message: 'Payer is required' });
    if (!items || items.length === 0)
      return res.status(400).json({ success: false, message: 'At least 1 item required' });
    if (items.some(it => !it.name || !it.amount || !it.assignees || it.assignees.length === 0))
      return res.status(400).json({ success: false, message: 'Each item must have a name, amount, and at least one assignee' });

    // Calculate totals per person
    const totals = {};
    friends.forEach(f => { totals[f] = 0; });
    items.forEach(item => {
      const share = item.amount / item.assignees.length;
      item.assignees.forEach(f => { totals[f] = (totals[f] || 0) + share; });
    });

    // Build settlements (everyone owes payer)
    const settlements = friends
      .filter(f => f !== payer && totals[f] > 0)
      .map(f => ({ from: f, to: payer, amount: parseFloat(totals[f].toFixed(2)) }));

    const totalAmount = parseFloat(
      Object.values(totals).reduce((a, b) => a + b, 0).toFixed(2)
    );

    const bill = await Bill.create({
      title: title || 'Bill',
      friends,
      payer,
      items,
      settlements,
      totalAmount,
    });

    res.status(201).json({ success: true, data: bill });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE bill
router.delete('/:id', async (req, res) => {
  try {
    const bill = await Bill.findByIdAndDelete(req.params.id);
    if (!bill) return res.status(404).json({ success: false, message: 'Bill not found' });
    res.json({ success: true, message: 'Bill deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;