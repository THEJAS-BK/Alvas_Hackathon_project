export interface CISRule {
  id: string;
  rule: string;
  category: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Pass' | 'Fail';
  description: string;
}

export interface SecurityEvent {
  id: string;
  timestamp: string;
  action: string;
  type: 'Behavioral' | 'CIS_Violation';
  user: string;
  riskWeight: number;
  description: string;
}

export interface ScenarioStep {
  id: number;
  title: string;
  time: string;
  events: SecurityEvent[];
  impactOnScore: number;
  cisViolations: string[];
  narrative: string;
  phase: 'Normal' | 'Preparation' | 'Execution' | 'Exfiltration';
}

export interface Employee {
  id: string;
  endpointId?: string;
  name: string;
  department: string;
  accessStatus: 'Active' | 'Access Removed';
  violationType?: 'None' | 'Suspicious Website' | 'Harmful Pen Drive';
  recentEvents: TimelineEvent[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  description: string;
  status: 'Normal' | 'Critical';
  reason?: string;
}

export interface SecurityAlert {
  id: string;
  employeeId: string;
  employeeName: string;
  timestamp: string;
  violation: string;
  actionTaken: string;
}
