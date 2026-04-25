const Employee = require('../models/Employee');
const Event = require('../models/Event');
const Alert = require('../models/Alert');

// @desc    Get all employees
// @route   GET /api/employees
const getEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (error) {
    next(error);
  }
};

// @desc    Get employee by ID with events
// @route   GET /api/employees/:id
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ endpointId: req.params.id });
    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }
    const events = await Event.find({ employeeId: req.params.id }).sort({ createdAt: -1 });
    res.json({ ...employee.toObject(), recentEvents: events });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee access status
// @route   PATCH /api/employees/:id/access
const updateAccessStatus = async (req, res, next) => {
  try {
    const { accessStatus } = req.body;
    const updateData = { accessStatus };

    if (accessStatus === 'Active') {
      updateData.violationType = 'None';
    }

    const employee = await Employee.findOneAndUpdate(
      { endpointId: req.params.id },
      updateData,
      { new: true }
    );

    if (!employee) {
      res.status(404);
      throw new Error('Employee not found');
    }
    res.json(employee);
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/stats
const getDashboardStats = async (req, res, next) => {
  try {
    const total = await Employee.countDocuments({});
    const active = await Employee.countDocuments({ accessStatus: 'Active' });
    const removed = await Employee.countDocuments({ accessStatus: 'Access Removed' });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const violationsToday = await Alert.countDocuments({ timestamp: { $gte: today } });

    res.json({ total, active, removed, violationsToday });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEmployees,
  getEmployeeById,
  updateAccessStatus,
  getDashboardStats
};
