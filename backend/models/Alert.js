const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  violation: { type: String, required: true },
  actionTaken: { type: String, default: 'Access Removed' },
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Alert', alertSchema);
