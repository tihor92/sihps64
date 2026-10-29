import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Layers, 
  Clock, 
  Flame, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AlertsPage: React.FC = () => {
  const { alerts, markAlertAsRead, markAllAlertsAsRead } = useApp();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'ALL' | 'OVERLAP' | 'SLA' | 'ESCALATION' | 'PENDING'>('ALL');

  const filteredAlerts = alerts.filter(a => {
    if (activeTab === 'ALL') return true;
    return a.type === activeTab;
  });

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Council Alerts & Notifications Engine</h2>
            {unreadCount > 0 && (
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time inter-bureau notifications, SLA breach warnings, and auto-escalations
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={markAllAlertsAsRead}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition"
          >
            <CheckCheck className="w-4 h-4 mr-1.5 text-blue-600" />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('ALL')}
          className={`px-3 py-1.5 rounded-lg transition ${
            activeTab === 'ALL' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Notifications ({alerts.length})
        </button>
        <button
          onClick={() => setActiveTab('OVERLAP')}
          className={`px-3 py-1.5 rounded-lg transition flex items-center ${
            activeTab === 'OVERLAP' ? 'bg-amber-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5 mr-1" />
          Overlap Alerts ({alerts.filter(a => a.type === 'OVERLAP').length})
        </button>
        <button
          onClick={() => setActiveTab('SLA')}
          className={`px-3 py-1.5 rounded-lg transition flex items-center ${
            activeTab === 'SLA' ? 'bg-rose-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5 mr-1" />
          SLA Overdue ({alerts.filter(a => a.type === 'SLA').length})
        </button>
        <button
          onClick={() => setActiveTab('ESCALATION')}
          className={`px-3 py-1.5 rounded-lg transition flex items-center ${
            activeTab === 'ESCALATION' ? 'bg-purple-600 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Flame className="w-3.5 h-3.5 mr-1" />
          Escalations ({alerts.filter(a => a.type === 'ESCALATION').length})
        </button>
        <button
          onClick={() => setActiveTab('PENDING')}
          className={`px-3 py-1.5 rounded-lg transition flex items-center ${
            activeTab === 'PENDING' ? 'bg-slate-700 text-white' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <Clock className="w-3.5 h-3.5 mr-1" />
          Pending Reminders ({alerts.filter(a => a.type === 'PENDING').length})
        </button>
      </div>

      {/* Alert Cards */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200 text-slate-400">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No alerts found under this category</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-xl border transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                !alert.isRead 
                  ? 'bg-white border-blue-300 shadow-sm' 
                  : 'bg-slate-50 border-slate-200 opacity-80'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                  alert.type === 'OVERLAP' ? 'bg-amber-100 text-amber-800' :
                  alert.type === 'SLA' ? 'bg-rose-100 text-rose-800' :
                  alert.type === 'ESCALATION' ? 'bg-purple-100 text-purple-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                  {alert.type === 'OVERLAP' && <Layers className="w-4 h-4" />}
                  {alert.type === 'SLA' && <AlertTriangle className="w-4 h-4" />}
                  {alert.type === 'ESCALATION' && <Flame className="w-4 h-4" />}
                  {alert.type === 'PENDING' && <Clock className="w-4 h-4" />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-slate-900">{alert.type} Alert</span>
                    {alert.caseNumber && (
                      <span className="text-xs font-mono font-bold text-blue-700">{alert.caseNumber}</span>
                    )}
                    {!alert.isRead && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                    {alert.message}
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Received on {alert.createdAt} • Target: {alert.targetBureau || 'All Bureaus'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                {!alert.isRead && (
                  <button
                    onClick={() => markAlertAsRead(alert.id)}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-1.5 rounded-lg transition"
                  >
                    Mark as Read
                  </button>
                )}

                {alert.type === 'OVERLAP' ? (
                  <button
                    onClick={() => navigate('/overlaps')}
                    className="text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 px-3 py-1.5 rounded-lg transition flex items-center"
                  >
                    <span>View Overlap</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </button>
                ) : alert.caseId ? (
                  <button
                    onClick={() => navigate(`/cases/${alert.caseId}`)}
                    className="text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition flex items-center"
                  >
                    <span>Open Case</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </button>
                ) : null}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

