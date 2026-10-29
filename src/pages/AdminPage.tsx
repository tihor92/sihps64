import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building, 
  Clock, 
  Sliders, 
  History, 
  Plus, 
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { mockBureaus, mockSlaRules } from '../data/mockData';

export const AdminPage: React.FC = () => {
  const { currentUser, users, auditLogs } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'bureaus' | 'sla' | 'audit'>('users');
  const [overlapThreshold, setOverlapThreshold] = useState<number>(80);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // If not admin, show permission notice but allow preview for demonstration
  const isAdmin = currentUser.role === 'ADMIN';

  const handleSaveThreshold = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">System Administration & Council Configuration</h2>
            <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              Admin Zone
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Configure Council Bureaus, officer role assignments, SLA disposal thresholds, and inspect audit logs
          </p>
        </div>
      </div>

      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-300 text-amber-800 text-xs px-4 py-2.5 rounded-lg flex items-center">
          <Lock className="w-4 h-4 mr-2 text-amber-600 shrink-0" />
          <span>
            <b>Preview Mode:</b> You are logged in as {currentUser.name} ({currentUser.role}). Use the persona switcher in the top navigation bar to switch to <b>Admin System</b> for full write access.
          </span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3.5 py-1.5 rounded-lg transition flex items-center ${
            activeTab === 'users' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Users className="w-3.5 h-3.5 mr-1.5" />
          Officer Directory & Roles ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('bureaus')}
          className={`px-3.5 py-1.5 rounded-lg transition flex items-center ${
            activeTab === 'bureaus' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Building className="w-3.5 h-3.5 mr-1.5" />
          Bureaus & Cells ({mockBureaus.length})
        </button>
        <button
          onClick={() => setActiveTab('sla')}
          className={`px-3.5 py-1.5 rounded-lg transition flex items-center ${
            activeTab === 'sla' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5 mr-1.5" />
          SLA Timelines & Overlap Thresholds
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3.5 py-1.5 rounded-lg transition flex items-center ${
            activeTab === 'audit' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <History className="w-3.5 h-3.5 mr-1.5" />
          Append-Only Audit Trail ({auditLogs.length})
        </button>
      </div>

      {/* TAB 1: USERS */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Authorized Council Officers & Access Levels</h3>
            <button
              onClick={() => alert('Add officer functionality enabled in production directory.')}
              className="px-3 py-1.5 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition flex items-center"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              Provision Officer
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Officer Name</th>
                  <th className="py-3 px-4">Official Email</th>
                  <th className="py-3 px-4">Designation</th>
                  <th className="py-3 px-4">Assigned Bureau</th>
                  <th className="py-3 px-4">RBAC Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{u.email}</td>
                    <td className="py-3 px-4 text-slate-700">{u.designation}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                        {u.bureauCode}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-800 border border-slate-200">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BUREAUS */}
      {activeTab === 'bureaus' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockBureaus.map(b => (
            <div key={b.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded text-xs font-bold bg-blue-900 text-white">
                  {b.code}
                </span>
                <span className="text-xs font-bold text-blue-600">
                  {b.activeCasesCount} Active Inquiries
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-2">{b.name}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: SLA & OVERLAP RULES */}
      {activeTab === 'sla' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overlap Matching Configuration */}
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900">AI Overlap Matching Engine Parameters</h3>
            </div>
            <p className="text-xs text-slate-500">
              Adjust algorithm sensitivity for surfacing cross-bureau overlapping complaints against institutions.
            </p>

            <form onSubmit={handleSaveThreshold} className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Minimum Correlation Confidence Threshold:</span>
                  <span className="text-blue-700 font-bold">{overlapThreshold}%</span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="95"
                  step="5"
                  value={overlapThreshold}
                  onChange={(e) => setOverlapThreshold(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>60% (More sensitive, flags borderline cases)</span>
                  <span>95% (Strict, exact IDs only)</span>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="font-semibold text-slate-800">Scoring Weight Distribution:</div>
                <div className="flex justify-between">
                  <span>Exact AICTE Permanent ID match:</span>
                  <span className="font-bold">50 Points</span>
                </div>
                <div className="flex justify-between">
                  <span>Multiple active bureaus handling:</span>
                  <span className="font-bold">20 Points</span>
                </div>
                <div className="flex justify-between">
                  <span>Subject / Category TF-IDF similarity:</span>
                  <span className="font-bold">Up to 20 Points</span>
                </div>
                <div className="flex justify-between">
                  <span>Received within 30-day window:</span>
                  <span className="font-bold">10 Points</span>
                </div>
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition"
              >
                Save Engine Parameters
              </button>
              {savedSuccess && (
                <span className="ml-3 text-xs text-emerald-600 font-semibold inline-flex items-center">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                  Parameters updated!
                </span>
              )}
            </form>
          </div>

          {/* SLA Rules Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-sm font-bold text-slate-900">Mandated Category SLA Rules</h3>
              <p className="text-xs text-slate-500">Maximum disposal days before automatic escalation to Senior Management</p>
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Complaint Category</th>
                  <th className="py-3 px-4">Bureau</th>
                  <th className="py-3 px-4 text-center">SLA Days</th>
                  <th className="py-3 px-4 text-center">Early Warning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockSlaRules.map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-900">{s.category}</td>
                    <td className="py-3 px-4 font-bold text-blue-700">{s.bureau}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{s.slaDays} days</td>
                    <td className="py-3 px-4 text-center text-amber-700 font-semibold">{s.warnBeforeDays} days prior</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-sm font-bold text-slate-900">Council Security & Audit Ledger</h3>
            <p className="text-xs text-slate-500">Immutable, tamper-evident log of all council decisions and transfers</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-50 text-slate-600 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">Officer</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Target Entity</th>
                  <th className="py-3 px-4">Details</th>
                  <th className="py-3 px-4">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {auditLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-3 px-4 font-bold text-slate-900 font-sans">{log.userName}</td>
                    <td className="py-3 px-4 text-blue-700 font-bold">{log.action}</td>
                    <td className="py-3 px-4 text-purple-700 font-semibold">{log.entityId}</td>
                    <td className="py-3 px-4 text-slate-600 font-sans max-w-sm truncate" title={log.details}>
                      {log.details}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{log.ip}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

