const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  time: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['Normal', 'Critical'], default: 'Normal' },
  reason: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
