const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Friend', friendSchema);