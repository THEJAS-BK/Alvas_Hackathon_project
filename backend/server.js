const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Employee = require('./models/Employee');
const Alert = require('./models/Alert');
// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/employees', require('./routes/employeeRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));

const Logs = [
  {
    employeeId: "emp-1",
    employeeName: "Sarah Chen",
    violation: "Unauthorized USB Device",
    actionTaken: "Access Removed",
    timestamp: new Date("2024-04-25T08:12:10Z")
  },
  {
    employeeId: "emp-1",
    employeeName: "Sarah Chen",
    violation: "Accessed Restricted Folder",
    actionTaken: "Warning Issued",
    timestamp: new Date("2024-04-25T09:45:32Z")
  },
  {
    employeeId: "emp-1",
    employeeName: "Sarah Chen",
    violation: "Multiple Failed Login Attempts",
    actionTaken: "Account Temporarily Locked",
    timestamp: new Date("2024-04-25T11:03:21Z")
  },
  {
    employeeId: "emp-1",
    employeeName: "Sarah Chen",
    violation: "Unusual Data Download (500+ files)",
    actionTaken: "Access Reviewed",
    timestamp: new Date("2024-04-25T12:27:55Z")
  },
  {
    employeeId: "emp-1",
    employeeName: "Sarah Chen",
    violation: "Login from New IP Address",
    actionTaken: "2FA Triggered",
    timestamp: new Date("2024-04-25T14:10:44Z")
  },
  {
    employeeId: "emp-1",
    employeeName: "Sarah Chen",
    violation: "Attempted Admin Panel Access",
    actionTaken: "Access Denied",
    timestamp: new Date("2024-04-25T15:36:18Z")
  },
  {
    employeeId: "emp-1",
    employeeName: "Sarah Chen",
    violation: "Suspicious Script Execution",
    actionTaken: "Process Terminated",
    timestamp: new Date("2024-04-25T16:52:07Z")
  },
  {
    employeeId: "emp-1",
    employeeName: "Sarah Chen",
    violation: "Data Upload to External Drive",
    actionTaken: "Blocked",
    timestamp: new Date("2024-04-25T18:05:29Z")
  }
]
let count = 0;

app.get("/api/dataLog", async (req, res) => {

});
function mapViolation(v) {
  if (v.includes("USB") || v.includes("Drive")) return "Harmful Pen Drive";
  if (v.includes("Website")) return "Suspicious Website";
  return "None";
}

// Basic health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is running' });
});

// Custom Error Handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
