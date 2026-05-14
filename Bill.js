const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  amount: { type: Number, required: true },
  assignees: [{ type: String }],
});

const settlementSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
});

const billSchema = new mongoose.Schema({
  title: { type: String, default: 'Bill', trim: true },
  friends: [{ type: String }],
  payer: { type: String, required: true },
  items: [itemSchema],
  settlements: [settlementSchema],
  totalAmount: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Bill', billSchema);