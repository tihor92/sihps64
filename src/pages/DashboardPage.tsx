import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Inbox, 
  Clock, 
  Activity, 
  CheckCircle, 
  ArrowRightLeft, 
  AlertTriangle, 
  Flame, 
  Building2, 
  Layers, 
  Calendar,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { KpiCard } from '../components/KpiCard';
import { StatusChip } from '../components/StatusChip';
import { SlaBadge } from '../components/SlaBadge';

export const DashboardPage: React.FC = () => {
  const { cases, institutions, overlapGroups, alerts } = useApp();
  const navigate = useNavigate();

  // Metrics calculations
  const totalReceived = cases.length;
  const pendingCount = cases.filter(c => c.status === 'PENDING').length;
  const underProcessCount = cases.filter(c => c.status === 'UNDER_PROCESS').length;
  const disposedCount = cases.filter(c => c.status === 'DISPOSED').length;
  const transferredCount = cases.filter(c => c.status === 'TRANSFERRED').length;
  const escalatedCount = cases.filter(c => c.status === 'ESCALATED').length;
  const overdueCount = cases.filter(c => c.isOverdue || (c.status !== 'DISPOSED' && new Date(c.expectedDisposalOn) < new Date('2026-10-30'))).length;

  // Chart 1: Bureau Workload
  const bureauData = [
    { name: 'Regulation Bureau (RB)', cases: cases.filter(c => c.currentBureau === 'RB').length, color: '#3B82F6' },
    { name: 'PGRC', cases: cases.filter(c => c.currentBureau === 'PGRC').length, color: '#10B981' },
    { name: 'Approval Bureau', cases: cases.filter(c => c.currentBureau === 'APPROVAL').length, color: '#F59E0B' },
    { name: 'RIFD', cases: cases.filter(c => c.currentBureau === 'RIFD').length, color: '#8B5CF6' }
  ];

  // Chart 2: Status distribution
  const statusData = [
    { name: 'Pending', value: pendingCount, color: '#F59E0B' },
    { name: 'Under Process', value: underProcessCount, color: '#3B82F6' },
    { name: 'Disposed', value: disposedCount, color: '#10B981' },
    { name: 'Transferred', value: transferredCount, color: '#8B5CF6' },
    { name: 'Escalated', value: escalatedCount, color: '#EF4444' }
  ];

  // Chart 3: Monthly trend
  const trendData = [
    { month: 'Jun', received: 18, disposed: 14 },
    { month: 'Jul', received: 24, disposed: 20 },
    { month: 'Aug', received: 32, disposed: 28 },
    { month: 'Sep', received: 45, disposed: 38 },
    { month: 'Oct', received: 29, disposed: 22 }
  ];

  // Chart 4: Ageing buckets
  const ageingData = [
    { bucket: '0-7 Days', count: 3 },
    { bucket: '8-15 Days', count: 4 },
    { bucket: '16-30 Days', count: 3 },
    { bucket: '30+ Days (Critical)', count: 2 }
  ];

  // Top Institutions by complaints
  const topInstitutions = [...institutions]
    .sort((a, b) => b.totalCases - a.totalCases)
    .slice(0, 4);

  // Active Overlap Groups
  const activeOverlaps = overlapGroups.filter(o => o.state === 'SUGGESTED');

  // Cases nearing deadline / overdue
  const criticalCases = cases
    .filter(c => c.status !== 'DISPOSED')
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Top Banner / System Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Institutional Grievance & Compliance Overview</h2>
          <p className="text-sm text-slate-500 mt-1">
            Real-time inter-bureau tracking across All India Technical Institutions
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-xs bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium">
            Reporting Year: 2026-27
          </span>
          <button
            onClick={() => navigate('/cases')}
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-md font-medium transition shadow-xs flex items-center"
          >
            <span>Explore All Cases</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        <KpiCard
          title="Total Cases"
          value={totalReceived}
          icon={Inbox}
          color="slate"
          onClick={() => navigate('/cases')}
        />
        <KpiCard
          title="Pending"
          value={pendingCount}
          subtitle="Initial Scrutiny"
          icon={Clock}
          color="amber"
          onClick={() => navigate('/cases?status=PENDING')}
        />
        <KpiCard
          title="Under Process"
          value={underProcessCount}
          subtitle="Investigation"
          icon={Activity}
          color="blue"
          onClick={() => navigate('/cases?status=UNDER_PROCESS')}
        />
        <KpiCard
          title="Disposed"
          value={disposedCount}
          subtitle="Closed / Resolved"
          icon={CheckCircle}
          color="emerald"
          onClick={() => navigate('/cases?status=DISPOSED')}
        />
        <KpiCard
          title="Transferred"
          value={transferredCount}
          subtitle="Cross-Bureau"
          icon={ArrowRightLeft}
          color="purple"
          onClick={() => navigate('/cases?status=TRANSFERRED')}
        />
        <KpiCard
          title="Escalated"
          value={escalatedCount}
          subtitle="Senior Mgmt"
          icon={Flame}
          color="rose"
          onClick={() => navigate('/cases?status=ESCALATED')}
        />
        <KpiCard
          title="Overdue (SLA)"
          value={overdueCount}
          subtitle="Beyond Deadline"
          icon={AlertTriangle}
          color="rose"
          onClick={() => navigate('/cases?overdue=true')}
        />
      </div>

      {/* Overlap Alert Callout Banner if any suggested overlaps */}
      {activeOverlaps.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-transparent border-l-4 border-amber-500 p-4 rounded-r-xl bg-white shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                {activeOverlaps.length} Potential Cross-Bureau Overlaps Require Coordination
              </h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Institutions simultaneously undergoing investigation by both Regulation Bureau (RB) and Grievance Cell (PGRC).
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate('/overlaps')}
            className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition shadow-xs flex items-center shrink-0"
          >
            <span>Review Overlap Center</span>
            <ArrowUpRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      )}

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Bureau Workload */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Bureau/Cell Workload Distribution</h3>
              <p className="text-xs text-slate-500">Live tally of active cases undergoing proceedings</p>
            </div>
            <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
              Total Active: {pendingCount + underProcessCount + escalatedCount}
            </span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={bureauData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', color: '#F8FAFC', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="cases" fill="#3B82F6" radius={[6, 6, 0, 0]}>
                  {bureauData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Status Donut */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Case Resolution Breakdown</h3>
            <p className="text-xs text-slate-500">Overall ratio across all registered cases</p>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', color: '#F8FAFC', borderRadius: '8px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-100 text-xs">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-slate-600 truncate">{item.name}:</span>
                <span className="font-bold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts: Monthly Trend & Ageing */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Registration vs Disposal Trend</h3>
              <p className="text-xs text-slate-500">Intake velocity vs closure rate (last 5 months)</p>
            </div>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', color: '#F8FAFC', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="received" stroke="#3B82F6" strokeWidth={2.5} name="Grievances Received" />
                <Line type="monotone" dataKey="disposed" stroke="#10B981" strokeWidth={2.5} name="Disposed / Closed" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ageing Buckets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Pending Cases Ageing Distribution</h3>
              <p className="text-xs text-slate-500">Days elapsed since case registration</p>
            </div>
            <Clock className="w-4 h-4 text-slate-400" />
          </div>
          <div className="h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ageingData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', color: '#F8FAFC', borderRadius: '8px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#D97706" radius={[6, 6, 0, 0]} name="Pending Cases" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Widgets Grid: Top Institutions & Urgent Cases */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Widget 1: Top Institutions by Grievances */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Top Institutions with Multiple Grievances</h3>
              <p className="text-xs text-slate-500">Institutions requiring integrated council oversight</p>
            </div>
            <button
              onClick={() => navigate('/institutions')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              View All
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {topInstitutions.map((inst) => (
              <div 
                key={inst.id} 
                onClick={() => navigate(`/institutions/${inst.aictePermanentId}`)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-700">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{inst.name}</h4>
                    <p className="text-[11px] text-slate-500">
                      AICTE ID: {inst.aictePermanentId} • {inst.city}, {inst.state}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-800">
                    {inst.openCases} Open / {inst.totalCases} Total
                  </div>
                  <div className="flex items-center justify-end gap-1 mt-1">
                    {inst.activeBureaus.map(b => (
                      <span key={b} className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Widget 2: Priority Attention & Overdue Cases */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Cases Nearing Deadline / Action Due</h3>
              <p className="text-xs text-slate-500">Cases requiring officer response or hearing</p>
            </div>
            <button
              onClick={() => navigate('/cases')}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
            >
              View Cases
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {criticalCases.map((c) => (
              <div 
                key={c.id} 
                onClick={() => navigate(`/cases/${c.id}`)}
                className="py-3 flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg cursor-pointer transition"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-mono font-bold text-blue-700">{c.caseNumber}</span>
                    <StatusChip status={c.status} size="sm" />
                  </div>
                  <p className="text-xs font-medium text-slate-800 line-clamp-1 max-w-sm">
                    {c.institutionName} - {c.subject}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Assigned: {c.assignedOfficer} ({c.currentBureau})
                  </p>
                </div>
                <div className="text-right shrink-0 ml-4">
                  <SlaBadge 
                    expectedDisposalOn={c.expectedDisposalOn} 
                    isOverdue={c.isOverdue} 
                    status={c.status} 
                  />
                  <div className="text-[10px] text-slate-500 mt-1">
                    Due: {c.expectedDisposalOn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

