const Alert = require('../models/Alert');
const Employee = require('../models/Employee');
const Event = require('../models/Event');

// @desc    Get all security alerts
// @route   GET /api/alerts
const getAlerts = async (req, res, next) => {
  try {
    const alerts = await Alert.find({}).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new alert
// @route   POST /api/alerts
const createAlert = async (req, res, next) => {
  try {
    const { employeeId, violation } = req.body;
    
    const employee = await Employee.findOne({ endpointId: employeeId });
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    const alert = await Alert.create({
      employeeId,
      employeeName: employee.name,
      violation,
      actionTaken: 'Access Removed'
    });

    // Automatically update employee status
    employee.accessStatus = 'Access Removed';
    employee.violationType = violation.includes('USB') ? 'Harmful Pen Drive' : 'Suspicious Website';
    await employee.save();

    // Log the event
    await Event.create({
      employeeId,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      description: violation,
      status: 'Critical',
      reason: 'Automatic security protocol triggered.'
    });

    res.status(201).json(alert);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlerts,
  createAlert
};
