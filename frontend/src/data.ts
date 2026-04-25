import { Employee, SecurityAlert } from './types';

export const EMPLOYEES: Employee[] = [
  {
    id: 'emp-1',
    name: 'Sarah Chen',
    department: 'Finance',
    accessStatus: 'Access Removed',
    violationType: 'Harmful Pen Drive',
    recentEvents: [
      { id: 'ev-1', time: '09:02', description: 'Opened Salesforce', status: 'Normal' },
      { id: 'ev-2', time: '11:45', description: 'Unauthorized USB Device Inserted', status: 'Critical', reason: 'Harmful Pen Drive detected containing crypto-miner payload.' },
      { id: 'ev-3', time: '11:46', description: 'Access Removed By System', status: 'Critical', reason: 'Automatic security protocol triggered.' }
    ]
  },
  {
    id: 'emp-2',
    name: 'Marcus Reid',
    department: 'Engineering',
    accessStatus: 'Access Removed',
    violationType: 'Suspicious Website',
    recentEvents: [
      { id: 'ev-4', time: '10:00', description: 'Modified production config', status: 'Normal' },
      { id: 'ev-5', time: '14:30', description: 'Attempted access to darkweb-portal.sh', status: 'Critical', reason: 'Suspicious website associated with data exfiltration brokers.' },
      { id: 'ev-6', time: '14:31', description: 'Access Removed By System', status: 'Critical' }
    ]
  },
  {
    id: 'emp-3',
    name: 'Priya Lal',
    department: 'Marketing',
    accessStatus: 'Active',
    recentEvents: [
      { id: 'ev-7', time: '09:12', description: 'System health check', status: 'Normal' },
      { id: 'ev-8', time: '13:05', description: 'Accessed Marketing Assets', status: 'Normal' }
    ]
  },
  {
    id: 'emp-4',
    name: 'James Wilson',
    department: 'Operations',
    accessStatus: 'Active',
    recentEvents: [
      { id: 'ev-9', time: '08:45', description: 'Morning Login', status: 'Normal' }
    ]
  }
];

export const SECURITY_ALERTS: SecurityAlert[] = [
  {
    id: 'alt-1',
    employeeId: 'emp-1',
    employeeName: 'Sarah Chen',
    timestamp: '2024-04-24 11:45:22',
    violation: 'Harmful Pen Drive Inserted',
    actionTaken: 'Access Removed'
  },
  {
    id: 'alt-2',
    employeeId: 'emp-2',
    employeeName: 'Marcus Reid',
    timestamp: '2024-04-24 14:30:05',
    violation: 'Suspicious Website Accessed',
    actionTaken: 'Access Removed'
  }
];
