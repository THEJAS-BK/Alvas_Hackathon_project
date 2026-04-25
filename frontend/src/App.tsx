/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Activity,
  User,
  Lock,
  AlertTriangle,
  Clock,
  Terminal,
  Database,
  RefreshCcw,
  LayoutDashboard,
  Users,
  Bell,
  Settings,
  ChevronRight,
  Usb,
  Globe,
  MonitorOff,
  Search,
  SlidersHorizontal,
  LogOut,
  AppWindow
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Employee, TimelineEvent, SecurityAlert } from './types';
import jsPDF from 'jspdf';

const API_BASE_URL = 'http://localhost:5000/api';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const SidebarItem = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-semibold",
      active
        ? "bg-primary text-white shadow-xl shadow-primary/20"
        : "text-muted-foreground hover:text-white hover:bg-white/5"
    )}
  >
    <Icon className="w-5 h-5 shrink-0" />
    <span className="truncate">{label}</span>
  </button>
);

const AccessStatusBadge = ({ status }: { status: 'Active' | 'Access Removed' }) => {
  return (
    <div className={cn(
      "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border flex items-center gap-1.5",
      status === 'Active'
        ? "bg-green-500/10 text-green-500 border-green-500/20"
        : "bg-red-500/10 text-red-500 border-red-500/20"
    )}>
      <div className={cn("w-1.5 h-1.5 rounded-full", status === 'Active' ? "bg-green-500" : "bg-red-500 animate-pulse")} />
      {status}
    </div>
  );
};

// --- Partials ---

const DashboardView = ({ stats, alerts, onEmployeeClick }: { stats: any, alerts: SecurityAlert[], onEmployeeClick: (id: string) => void }) => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bento-card bg-red-500/5 border-red-500/20 glow-red">
        <MonitorOff className="w-8 h-8 text-red-500 mb-2" />
        <p className="text-3xl font-black text-red-500">{stats.removed}</p>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Access Removed</p>
      </div>
      <div className="bento-card">
        <Users className="w-8 h-8 text-primary mb-2" />
        <p className="text-3xl font-black">{stats.total}</p>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Staff</p>
      </div>
      <div className="bento-card">
        <ShieldCheck className="w-8 h-8 text-green-500 mb-2" />
        <p className="text-3xl font-black text-green-500">{stats.active}</p>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Secured Devices</p>
      </div>
      <div className="bento-card">
        <Activity className="w-8 h-8 text-amber-500 mb-2" />
        <p className="text-3xl font-black">{stats.violationsToday}</p>
        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Violations Today</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 bento-card p-0 overflow-hidden">
        <div className="p-6 border-b border-card-border flex items-center justify-between">
          <h3 className="font-black text-sm uppercase tracking-widest flex items-center gap-2">
            <Bell className="w-4 h-4 text-red-500" />
            Critical Violation Log
          </h3>
          <span className="text-[10px] mono text-muted-foreground">REAL-TIME MONITOR</span>
        </div>
        <div className="divide-y divide-card-border">
          {alerts.map(alert => (
            <div key={alert.id} className="p-6 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                  {alert.violation.includes('USB') ? <Usb className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                </div>
                <div>
                  <p className="text-sm font-bold text-white mb-0.5">{alert.employeeName}</p>
                  <p className="text-xs text-red-500 font-bold">{alert.violation}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-black text-white bg-red-500 px-2 py-1 rounded">ACCESS REMOVED</p>
                <p className="text-[10px] mono text-muted-foreground mt-1">{alert.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-4 bento-card bg-primary/5 border-primary/20">
        <div className="flex flex-col items-center justify-center h-full text-center p-4">
          <Shield className="w-16 h-16 text-primary/50 mb-4" />
          <h4 className="text-lg font-black mb-2 italic">Proactive Shield V3</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Vigil is currently monitoring endpoint telemetry for suspicious web hooks and illegal hardware IDs. Any unauthorized intrusion will result in immediate session blacklisting.
          </p>
          <div className="mt-6 pt-6 border-t border-primary/20 w-full flex justify-around">
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground">WEB FILTER</p>
              <p className="text-xs font-bold text-green-500">ENABLED</p>
            </div>
            <div className="text-center">
              <p className="text-[10px] font-bold text-muted-foreground">USB GUARD</p>
              <p className="text-xs font-bold text-green-500">ENABLED</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const EmployeesView = ({ employees, onSelect }: { employees: Employee[], onSelect: (e: Employee) => void }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-2xl font-black tracking-tighter">Personnel Directory</h2>
      <div className="flex gap-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search staff..." className="bg-muted border border-card-border rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-primary/50 transition-all w-64" />
        </div>
        <button className="p-2 bg-muted border border-card-border rounded-xl hover:bg-white/5 transition-all">
          <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {employees.map(emp => (
        <div key={emp.id} className="bento-card group hover:border-primary/30 transition-all cursor-pointer" onClick={() => onSelect(emp)}>
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-muted border border-card-border flex items-center justify-center text-lg font-black group-hover:bg-primary group-hover:text-white transition-all">
                {emp.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <p className="font-bold text-white">{emp.name}</p>
                <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest">{emp.department}</p>
              </div>
            </div>
            <AccessStatusBadge status={emp.accessStatus} />
          </div>

          <div className="space-y-3 mt-auto">
            <div className="h-px bg-card-border w-full" />
            <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              <span>Compliance History</span>
              <span className={cn(emp.accessStatus === 'Active' ? "text-green-500" : "text-red-500")}>
                {emp.accessStatus === 'Active' ? "NO VIOLATIONS" : "ACCESS REVOKED"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const EmployeeDetailView = ({ employee, onBack, onRestore, onExportPDF }: { employee: Employee, onBack: () => void, onRestore: (id: string) => void, onExportPDF: (employee: Employee) => void }) => (
  <div className="space-y-6 max-w-5xl mx-auto">
    <div className="flex items-center gap-4">
      <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full text-muted-foreground transition-all">
        <RefreshCcw className="w-5 h-5 -scale-x-100" />
      </button>
      <div>
        <h2 className="text-3xl font-black tracking-tighter">{employee.name}</h2>
        <p className="text-sm text-muted-foreground font-medium">{employee.department} Division • Endpoint ID: {employee.endpointId?.toUpperCase() || employee.id.toUpperCase()}</p>
      </div>
      <div className="ml-auto">
        <AccessStatusBadge status={employee.accessStatus} />
      </div>
    </div>

    {employee.accessStatus === 'Access Removed' && (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-8 rounded-2xl bg-red-600 shadow-2xl shadow-red-600/20 text-white flex items-center gap-6"
      >
        <Lock className="w-16 h-16 shrink-0" />
        <div>
          <h3 className="text-4xl font-black tracking-tighter mb-1">ACCESS REMOVED</h3>
          <p className="text-lg font-bold opacity-90 italic">Primary violation: {employee.violationType}</p>
          <p className="text-sm mt-3 opacity-70 leading-relaxed font-medium">Session was automatically terminated at the edge gateway due to detection of high-risk operational anomalies. Hardware isolation is active.</p>
        </div>
      </motion.div>
    )}

    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div className="lg:col-span-8 bento-card">
        <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-6">Recent Endpoint Events</h3>
        <div className="relative space-y-0 pl-1">
          <div className="absolute left-6 top-2 bottom-2 w-px bg-card-border" />
          {employee.recentEvents?.map((ev) => (
            <div key={ev.id} className="relative pl-12 py-6 border-b border-card-border/50 last:border-0">
              <div className={cn(
                "absolute left-4 top-8 w-4 h-4 rounded-full border-4 border-card ring-2 transform -translate-x-1/2",
                ev.status === 'Normal' ? "bg-green-500 ring-green-500/20" : "bg-red-500 ring-red-500/20 animate-pulse"
              )} />
              <div>
                <span className="text-[10px] font-mono text-muted-foreground uppercase">{ev.time}</span>
                <p className={cn("text-lg font-bold mt-1", ev.status === 'Critical' ? "text-red-500" : "text-white")}>
                  {ev.description}
                </p>
                {ev.reason && <p className="text-xs text-muted-foreground mt-2 italic">Reason: {ev.reason}</p>}
                {ev.status === 'Critical' && ev.description.includes('Access Removed') && (
                  <div className="mt-4 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-lg w-fit text-red-500 text-[10px] font-black uppercase">
                    Security Intercept
                  </div>
                )}
              </div>
            </div>
          ))}
          {(!employee.recentEvents || employee.recentEvents.length === 0) && (
            <div className="py-10 text-center text-muted-foreground italic text-xs">No recent events logged.</div>
          )}
        </div>
      </div>

      <div className="lg:col-span-4 space-y-6">
        <div className="bento-card">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Device Credentials</h3>
          <div className="space-y-4">
            <div className="flex justify-between text-xs py-2 border-b border-card-border">
              <span className="text-muted-foreground">HOSTNAME</span>
              <span className="font-mono font-bold">WS-ALPHA-22</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-card-border">
              <span className="text-muted-foreground">IP ADDR</span>
              <span className="font-mono font-bold">192.168.1.10{(employee.endpointId || employee.id).slice(-1)}</span>
            </div>
            <div className="flex justify-between text-xs py-2 border-b border-card-border">
              <span className="text-muted-foreground">OS VER</span>
              <span className="font-mono font-bold">Win 11 ENT</span>
            </div>
          </div>
        </div>

        <div className="bento-card bg-muted/30">
          <h3 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">Admin Actions</h3>
          <div className="space-y-3">
            <button
              onClick={() => onRestore(employee.endpointId || employee.id)}
              disabled={employee.accessStatus === 'Active'}
              className="w-full py-3 bg-primary/20 text-primary border border-primary/30 rounded-xl text-xs font-bold hover:bg-primary hover:text-white transition-all disabled:opacity-30"
            >
              RESTORE ACCESS
            </button>
            <button
              onClick={() => onExportPDF(employee)}
              className="w-full py-3 bg-muted border border-card-border rounded-xl text-xs font-bold hover:bg-white/5 transition-all"
            >
              EXPORT AUDIT TO PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AlertsView = ({ alerts }: { alerts: SecurityAlert[] }) => (
  <div className="space-y-6 max-w-4xl mx-auto">
    <div className="mb-8">
      <h2 className="text-3xl font-black tracking-tighter">Central Alerts Hub</h2>
      <p className="text-sm text-muted-foreground font-medium">Monitoring all endpoint violations system-wide.</p>
    </div>

    <div className="space-y-4">
      {alerts.map(alert => (
        <div key={alert.id} className="bento-card flex-row gap-6 p-6 border-red-500/30 items-center">
          <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-red-600/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="text-lg font-black text-white">{alert.violation}</h4>
                <p className="text-sm font-bold text-red-500 italic">Subject: {alert.employeeName}</p>
              </div>
              <div className="text-[10px] font-mono text-muted-foreground uppercase">{alert.timestamp}</div>
            </div>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t border-card-border">
              <div className="flex items-center gap-2 text-[10px] font-black text-white bg-red-600 px-3 py-1 rounded tracking-widest">
                <MonitorOff className="w-3 h-3" /> ACCESS REMOVED
              </div>
              <span className="text-[10px] font-bold text-muted-foreground">AUTONOMOUS ACTION TAKEN</span>
            </div>
          </div>
        </div>
      ))}

      {alerts.length === 0 && (
        <div className="bento-card py-20 items-center justify-center text-center opacity-50">
          <ShieldCheck className="w-16 h-16 text-green-500 mb-4" />
          <p className="font-bold">No active alerts detected</p>
          <p className="text-xs text-muted-foreground">All endpoints are currently compliant.</p>
        </div>
      )}
    </div>
  </div>
);

// --- Main App ---

export default function App() {
  const [activeSection, setActiveSection] = useState<'Dashboard' | 'Employees' | 'Alerts'>('Dashboard');
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [alerts, setAlerts] = useState<SecurityAlert[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    removed: 0,
    violationsToday: 0
  });
  const [loading, setLoading] = useState(true);



  const fetchData = useCallback(async () => {
    try {
      const [statsRes, employeesRes, alertsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/employees/stats`),
        fetch(`${API_BASE_URL}/employees`),
        fetch(`${API_BASE_URL}/alerts`)
      ]);

      const statsData = await statsRes.json();
      const employeesData = await employeesRes.json();
      const alertsData = await alertsRes.json();

      setStats(statsData);
      setEmployees(employeesData);
      setAlerts(alertsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEmployeeSelection = async (emp: Employee) => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees/${emp.endpointId || emp.id}`);
      const data = await res.json();
      setSelectedEmp(data);
      setActiveSection('Employees');
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const handleExportAuditPDF = (employee: Employee) => {
    const doc = new jsPDF();
    const endpointId = (employee.endpointId || employee.id).toUpperCase();
    const generatedAt = new Date().toLocaleString();

    // ── Header bar ──────────────────────────────────────────────
    doc.setFillColor(30, 41, 82);
    doc.rect(0, 0, 210, 28, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text('VIGIL  —  SECURITY AUDIT REPORT', 14, 18);

    // ── Sub-header ──────────────────────────────────────────────
    doc.setFillColor(20, 30, 60);
    doc.rect(0, 28, 210, 10, 'F');
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(160, 170, 200);
    doc.text(`SOC OS ALPHA  •  GENERATED: ${generatedAt}  •  CONFIDENTIAL`, 14, 35);

    let y = 48;

    // ── Employee info block ──────────────────────────────────────
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 82);
    doc.text('SUBJECT INFORMATION', 14, y);
    y += 2;
    doc.setDrawColor(30, 41, 82);
    doc.setLineWidth(0.5);
    doc.line(14, y, 196, y);
    y += 7;

    const infoRows = [
      ['Name', employee.name],
      ['Department', employee.department],
      ['Endpoint ID', endpointId],
      ['Access Status', employee.accessStatus],
      ['Violation Type', employee.violationType || 'None'],
      ['Hostname', 'WS-ALPHA-22'],
      ['IP Address', `192.168.1.10${(employee.endpointId || employee.id).slice(-1)}`],
      ['OS Version', 'Windows 11 Enterprise'],
    ];

    doc.setFontSize(9);
    infoRows.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(80, 90, 120);
      doc.text(label.toUpperCase(), 14, y);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(20, 20, 40);

      // Colour-code access status
      if (label === 'Access Status') {
        doc.setTextColor(employee.accessStatus === 'Active' ? 22 : 200, employee.accessStatus === 'Active' ? 163 : 30, employee.accessStatus === 'Active' ? 74 : 30);
      }
      doc.text(String(value), 70, y);
      doc.setTextColor(20, 20, 40);
      y += 7;
    });

    y += 4;

    // ── Events timeline ──────────────────────────────────────────
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 82);
    doc.text('ENDPOINT EVENT TIMELINE', 14, y);
    y += 2;
    doc.line(14, y, 196, y);
    y += 7;

    const events = employee.recentEvents || [];
    if (events.length === 0) {
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.setTextColor(140, 140, 160);
      doc.text('No events recorded.', 14, y);
      y += 10;
    } else {
      events.forEach((ev) => {
        if (y > 265) { doc.addPage(); y = 20; }
        const isCritical = ev.status === 'Critical';

        // Status pill background
        doc.setFillColor(isCritical ? 255 : 220, isCritical ? 230 : 245, isCritical ? 230 : 220);
        doc.roundedRect(14, y - 4, 182, isCritical && ev.reason ? 18 : 12, 2, 2, 'F');

        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(isCritical ? 180 : 30, isCritical ? 30 : 130, isCritical ? 30 : 60);
        doc.text(`[${ev.status.toUpperCase()}]  ${ev.time}`, 17, y + 1);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(20, 20, 40);
        doc.text(ev.description, 60, y + 1);

        if (isCritical && ev.reason) {
          doc.setFontSize(7);
          doc.setTextColor(120, 50, 50);
          doc.text(`↳ ${ev.reason}`, 60, y + 8);
          y += 22;
        } else {
          y += 15;
        }
      });
    }

    // ── Footer ───────────────────────────────────────────────────
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFillColor(240, 242, 248);
      doc.rect(0, 285, 210, 12, 'F');
      doc.setFontSize(7);
      doc.setTextColor(140, 150, 170);
      doc.setFont('helvetica', 'normal');
      doc.text('VIGIL SOC OS  •  CONFIDENTIAL — FOR INTERNAL USE ONLY', 14, 292);
      doc.text(`Page ${i} of ${pageCount}`, 186, 292, { align: 'right' });
    }

    doc.save(`VIGIL_Audit_${employee.name.replace(/ /g, '_')}_${endpointId}.pdf`);
  };

  const handleRestoreAccess = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/employees/${id}/access`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessStatus: 'Active' })
      });
      if (res.ok) {
        await fetchData(); // Refresh data
        // Update selected employee if open
        if (selectedEmp && (selectedEmp.endpointId === id || selectedEmp.id === id)) {
          const updatedEmp = await fetch(`${API_BASE_URL}/employees/${id}`).then(r => r.json());
          setSelectedEmp(updatedEmp);
        }
      }
    } catch (error) {
      console.error('Error restoring access:', error);
    }
  };

  const sendDataLogs = async () => {
    console.log("Sending data logs to server");
    const res = await fetch(`${API_BASE_URL}/dataLog`, {
      method: "GET"
    })
    if (res.ok) {
      console.log("Data logs sent successfully");
    }
  }

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans antialiased">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0F1629] border-r border-[#1a233a] flex flex-col shrink-0 overflow-y-auto hidden lg:flex">
        <div className="p-8 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-xl shadow-primary/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black italic tracking-tighter leading-none text-white">VIGIL</h1>
              <p className="text-[9px] font-bold text-primary tracking-[0.2em] mt-1 ml-0.5">SOC OS ALPHA</p>
            </div>
          </div>
        </div>

        <div className="flex-1 px-5 space-y-2">
          <SidebarItem
            icon={LayoutDashboard}
            label="Dashboard"
            active={activeSection === 'Dashboard' && !selectedEmp}
            onClick={() => { setActiveSection('Dashboard'); setSelectedEmp(null); }}
          />
          <SidebarItem
            icon={Users}
            label="Personnel"
            active={activeSection === 'Employees'}
            onClick={() => { setActiveSection('Employees'); setSelectedEmp(null); }}
          />
          <SidebarItem
            icon={Bell}
            label="Security Alerts"
            active={activeSection === 'Alerts'}
            onClick={() => { setActiveSection('Alerts'); setSelectedEmp(null); }}
          />
        </div>

        <div className="p-8">
          <div className="bento-card p-5 bg-white/5 border-white/10 hover:border-white/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase text-muted-foreground">Session Active</span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] mono text-muted-foreground">ID: ADM-X99</p>
              <p className="text-[10px] mono text-muted-foreground">DUR: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
            <button className="w-full mt-5 py-2 rounded-lg bg-white/5 hover:bg-red-500/20 hover:text-red-500 transition-all text-[10px] font-bold flex items-center justify-center gap-2">
              <LogOut className="w-3 h-3" /> END SESSION
            </button>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header Bar */}
        <header className="h-20 border-b border-card-border bg-card/10 backdrop-blur-md sticky top-0 z-50 px-10 flex items-center justify-between">
          <div className="flex items-center gap-4 lg:hidden">
            <Shield className="w-8 h-8 text-primary" />
            <h1 className="font-black italic text-xl tracking-tighter">VIGIL</h1>
          </div>

          <div className="hidden sm:flex items-center gap-12">
            <div className="flex flex-col">
              <span className="text-[9px] font-black uppercase text-muted-foreground tracking-widest">Global Status</span>
              <span className="text-sm font-black text-green-500 flex items-center gap-1.5 underline decoration-2 underline-offset-4">
                <ShieldCheck className="w-4 h-4" /> ALL SYSTEMS OPERATIONAL
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 p-1.5 bg-muted rounded-2xl border border-card-border">
              <button className="p-2 bg-card rounded-xl shadow-lg text-primary"><MonitorOff className="w-4 h-4" /></button>
              <button className="p-2 opacity-50"><AppWindow className="w-4 h-4" /></button>
            </div>
            <div className="h-10 w-px bg-card-border hidden sm:block" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/20 border border-primary/30 flex items-center justify-center font-black text-primary italic">X9</div>
              <div className="hidden md:block">
                <p className="text-xs font-black leading-none">ADMIN_ROOT</p>
                <p className="text-[9px] text-muted-foreground font-bold mt-1 uppercase">X-Level Clearance</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <RefreshCcw className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection + (selectedEmp?.endpointId || selectedEmp?.id || '')}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                >
                  {activeSection === 'Dashboard' && (
                    <DashboardView
                      stats={stats}
                      alerts={alerts}
                      onEmployeeClick={(id) => {
                        const emp = employees.find(e => (e.endpointId === id || e.id === id));
                        if (emp) handleEmployeeSelection(emp);
                      }}
                    />
                  )}
                  {activeSection === 'Employees' && !selectedEmp && (
                    <EmployeesView employees={employees} onSelect={handleEmployeeSelection} />
                  )}
                  {activeSection === 'Employees' && selectedEmp && (
                    <EmployeeDetailView
                      employee={selectedEmp}
                      onBack={() => setSelectedEmp(null)}
                      onRestore={handleRestoreAccess}
                      onExportPDF={handleExportAuditPDF}
                    />
                  )}
                  {activeSection === 'Alerts' && <AlertsView alerts={alerts} />}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
