const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Employee = require('./models/Employee');
const Alert = require('./models/Alert');
const Event = require('./models/Event');

dotenv.config();

const employees = [
  {
    employeeId: 'EMP-001',
    endpointId: 'emp-1',
    name: 'Sarah Chen',
    department: 'Finance',
    accessStatus: 'Access Removed',
    violationType: 'Harmful Pen Drive'
  },
  {
    employeeId: 'EMP-002',
    endpointId: 'emp-2',
    name: 'Marcus Reid',
    department: 'Engineering',
    accessStatus: 'Access Removed',
    violationType: 'Suspicious Website'
  },
  {
    employeeId: 'EMP-003',
    endpointId: 'emp-3',
    name: 'Priya Lal',
    department: 'Marketing',
    accessStatus: 'Active',
    violationType: 'None'
  },
  {
    employeeId: 'EMP-004',
    endpointId: 'emp-4',
    name: 'James Wilson',
    department: 'Operations',
    accessStatus: 'Active',
    violationType: 'None'
  },
  {
    employeeId: 'EMP-005',
    endpointId: 'emp-5',
    name: 'Aiden Cross',
    department: 'HR',
    accessStatus: 'Active',
    violationType: 'None'
  },
  {
    employeeId: 'EMP-006',
    endpointId: 'emp-6',
    name: 'Nina Patel',
    department: 'Legal',
    accessStatus: 'Access Removed',
    violationType: 'Suspicious Website'
  }
];

const alerts = [
  // --- Past alerts (2024-04-24) ---
  {
    employeeId: 'emp-1',
    employeeName: 'Sarah Chen',
    timestamp: new Date('2024-04-24T11:45:22Z'),
    violation: 'Harmful Pen Drive Inserted',
    actionTaken: 'Access Removed'
  },
  {
    employeeId: 'emp-2',
    employeeName: 'Marcus Reid',
    timestamp: new Date('2024-04-24T14:30:05Z'),
    violation: 'Suspicious Website Accessed',
    actionTaken: 'Access Removed'
  },
  {
    employeeId: 'emp-4',
    employeeName: 'James Wilson',
    timestamp: new Date('2024-04-24T16:10:44Z'),
    violation: 'Unauthorized VPN Connection Detected',
    actionTaken: 'Access Removed'
  },
  {
    employeeId: 'emp-3',
    employeeName: 'Priya Lal',
    timestamp: new Date('2024-04-24T17:55:03Z'),
    violation: 'Mass File Download (1000+ files)',
    actionTaken: 'Access Removed'
  },

  // --- Past alerts (2024-04-25) ---
  {
    employeeId: 'emp-6',
    employeeName: 'Nina Patel',
    timestamp: new Date('2024-04-25T09:15:00Z'),
    violation: 'Accessed Blacklisted Domain',
    actionTaken: 'Access Removed'
  },
  {
    employeeId: 'emp-1',
    employeeName: 'Sarah Chen',
    timestamp: new Date('2024-04-25T08:12:10Z'),
    violation: 'Unauthorized USB Device',
    actionTaken: 'Access Removed'
  },
  {
    employeeId: 'emp-5',
    employeeName: 'Aiden Cross',
    timestamp: new Date('2024-04-25T10:33:19Z'),
    violation: 'Suspicious Script Execution Detected',
    actionTaken: 'Access Removed'
  },
  {
    employeeId: 'emp-2',
    employeeName: 'Marcus Reid',
    timestamp: new Date('2024-04-25T13:07:52Z'),
    violation: 'Data Exfiltration via External Drive',
    actionTaken: 'Access Removed'
  },

  // --- Today's alerts (show up in violationsToday counter) ---
  {
    employeeId: 'emp-1',
    employeeName: 'Sarah Chen',
    timestamp: new Date(),
    violation: 'Repeated USB Insertion Attempt',
    actionTaken: 'Access Removed'
  },
  {
    employeeId: 'emp-6',
    employeeName: 'Nina Patel',
    timestamp: new Date(),
    violation: 'Phishing Link Clicked',
    actionTaken: 'Access Removed'
  },
  {
    employeeId: 'emp-3',
    employeeName: 'Priya Lal',
    timestamp: new Date(),
    violation: 'Unauthorized Remote Desktop Access',
    actionTaken: 'Access Removed'
  },
  {
    employeeId: 'emp-4',
    employeeName: 'James Wilson',
    timestamp: new Date(),
    violation: 'Malware Signature Detected on Endpoint',
    actionTaken: 'Access Removed'
  }
];

const events = [
  // Sarah Chen (emp-1)
  { employeeId: 'emp-1', time: '09:02', description: 'Opened Salesforce', status: 'Normal' },
  { employeeId: 'emp-1', time: '10:30', description: 'Printed quarterly report', status: 'Normal' },
  { employeeId: 'emp-1', time: '11:45', description: 'Unauthorized USB Device Inserted', status: 'Critical', reason: 'Harmful Pen Drive detected containing crypto-miner payload.' },
  { employeeId: 'emp-1', time: '11:46', description: 'Access Removed By System', status: 'Critical', reason: 'Automatic security protocol triggered.' },

  // Marcus Reid (emp-2)
  { employeeId: 'emp-2', time: '08:55', description: 'Morning Login', status: 'Normal' },
  { employeeId: 'emp-2', time: '10:00', description: 'Modified production config', status: 'Normal' },
  { employeeId: 'emp-2', time: '14:30', description: 'Attempted access to darkweb-portal.sh', status: 'Critical', reason: 'Suspicious website associated with data exfiltration brokers.' },
  { employeeId: 'emp-2', time: '14:31', description: 'Access Removed By System', status: 'Critical' },

  // Priya Lal (emp-3)
  { employeeId: 'emp-3', time: '09:12', description: 'System health check', status: 'Normal' },
  { employeeId: 'emp-3', time: '11:00', description: 'Campaign asset upload', status: 'Normal' },
  { employeeId: 'emp-3', time: '13:05', description: 'Accessed Marketing Assets', status: 'Normal' },

  // James Wilson (emp-4)
  { employeeId: 'emp-4', time: '08:45', description: 'Morning Login', status: 'Normal' },
  { employeeId: 'emp-4', time: '12:00', description: 'Reviewed operations dashboard', status: 'Normal' },

  // Aiden Cross (emp-5)
  { employeeId: 'emp-5', time: '09:00', description: 'Logged into HR portal', status: 'Normal' },
  { employeeId: 'emp-5', time: '10:45', description: 'Exported payroll data', status: 'Normal' },

  // Nina Patel (emp-6)
  { employeeId: 'emp-6', time: '08:30', description: 'Morning Login', status: 'Normal' },
  { employeeId: 'emp-6', time: '09:15', description: 'Accessed blacklisted legal resource domain', status: 'Critical', reason: 'Domain flagged by threat intelligence as a phishing vector.' },
  { employeeId: 'emp-6', time: '09:16', description: 'Access Removed By System', status: 'Critical', reason: 'Automatic security protocol triggered.' }
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Clear existing data
    await Employee.deleteMany();
    await Alert.deleteMany();
    await Event.deleteMany();

    // Insert fresh dummy data
    await Employee.insertMany(employees);
    await Alert.insertMany(alerts);
    await Event.insertMany(events);

    console.log('✅ Dummy data imported successfully!');
    console.log(`   → ${employees.length} employees`);
    console.log(`   → ${alerts.length} alerts`);
    console.log(`   → ${events.length} events`);
    process.exit();
  } catch (error) {
    console.error(`❌ Seed error: ${error.message}`);
    process.exit(1);
  }
};

importData();
