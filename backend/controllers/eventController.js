const Event = require('../models/Event');
const Alert = require('../models/Alert');
const Employee = require('../models/Employee');

// @desc    Create a new event from browser extension
// @route   POST /api/events
const createEvent = async (req, res, next) => {
  try {
    const { employeeId, description, status: incomingStatus, reason } = req.body;

    if (!employeeId) {
      res.status(400);
      throw new Error('Employee ID is required');
    }

    // Find employee to get their name and check status
    const employee = await Employee.findOne({ $or: [{ employeeId }, { endpointId: employeeId }] });
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }

    // Create the event
    const event = await Event.create({
      employeeId: employee.endpointId || employee.employeeId,
      time: new Date().toLocaleTimeString(),
      description,
      status: incomingStatus || 'Normal',
      reason: reason || ''
    });

    // Check for suspicious keywords in description
    const suspiciousKeywords = ['hacking', 'malware', 'exploit', 'restricted', 'attack', 'illegal'];
    const isSuspicious = suspiciousKeywords.some(keyword => 
      description.toLowerCase().includes(keyword)
    );

    if (isSuspicious || incomingStatus === 'Critical') {
      // Create an alert
      await Alert.create({
        employeeId: employee.endpointId || employee.employeeId,
        employeeName: employee.name,
        violation: isSuspicious ? `Suspicious Activity: ${description}` : (reason || 'Security Violation'),
        actionTaken: 'Access Removed'
      });

      // Revoke employee access
      employee.accessStatus = 'Access Removed';
      employee.violationType = isSuspicious ? 'Suspicious Website' : 'None';
      await employee.save();
    }

    res.status(201).json(event);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createEvent
};
