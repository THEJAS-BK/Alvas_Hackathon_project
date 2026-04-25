const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  employeeId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  department: { type: String, required: true },
  accessStatus: { type: String, enum: ['Active', 'Access Removed'], default: 'Active' },
  violationType: { type: String, enum: ['None', 'Suspicious Website', 'Harmful Pen Drive'], default: 'None' },
  endpointId: { type: String, unique: true, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
