import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  Building2, 
  Layers, 
  Bell, 
  BarChart3, 
  ShieldCheck, 
  UserCheck, 
  RotateCcw,
  CheckCircle2,
  Menu,
  X,
  ExternalLink
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AppShell: React.FC = () => {
  const { currentUser, setCurrentUser, users, alerts, overlapGroups, resetToDefaultData } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const unreadAlerts = alerts.filter(a => !a.isRead).length;
  const suggestedOverlaps = overlapGroups.filter(o => o.state === 'SUGGESTED').length;

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Case Directory', path: '/cases', icon: FileText },
    { name: 'Institutions', path: '/institutions', icon: Building2 },
    { 
      name: 'Overlap Center', 
      path: '/overlaps', 
      icon: Layers, 
      badge: suggestedOverlaps > 0 ? suggestedOverlaps : undefined,
      badgeColor: 'bg-rose-500'
    },
    { 
      name: 'Alerts & SLA', 
      path: '/alerts', 
      icon: Bell, 
      badge: unreadAlerts > 0 ? unreadAlerts : undefined,
      badgeColor: 'bg-amber-500'
    },
    { name: 'Reports & Export', path: '/reports', icon: BarChart3 },
    { name: 'Admin Console', path: '/admin', icon: ShieldCheck, adminOnly: true }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-900 to-indigo-800 flex items-center justify-center text-white font-black text-lg shadow-inner">
                AICTE
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 tracking-tight leading-none">
                  AICTE | Complaint Monitoring Dashboard
                </h1>
                <p className="text-xs text-slate-500 mt-1 flex items-center">
                  <span>Single-Window Cross-Bureau Resolution Portal</span>
                  <span className="mx-2 text-slate-300">•</span>
                  <span className="inline-flex items-center text-emerald-600 font-medium">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1 animate-pulse"></span>
                    Live Sync Active
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Right Header: Role switcher, Alert bell, Reset data */}
          <div className="flex items-center space-x-3">
            {/* Quick RBAC Role Switcher */}
            <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
              <span className="text-xs font-semibold text-slate-500 px-2 flex items-center">
                <UserCheck className="w-3.5 h-3.5 mr-1" />
                Active Persona:
              </span>
              <select
                value={currentUser.id}
                onChange={(e) => {
                  const found = users.find(u => u.id === e.target.value);
                  if (found) setCurrentUser(found);
                }}
                className="text-xs font-medium bg-white text-slate-800 border border-slate-300 rounded px-2 py-1 focus:outline-hidden focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.bureauCode} • {u.role.replace('_', ' ')})
                  </option>
                ))}
              </select>
            </div>

            {/* Notification Bell */}
            <button
              onClick={() => navigate('/alerts')}
              className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadAlerts > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadAlerts}
                </span>
              )}
            </button>

            {/* Reset mock data button */}
            <button
              onClick={() => {
                if (window.confirm('Reset all cases and test data to default seed state?')) {
                  resetToDefaultData();
                }
              }}
              title="Reset Sample Demo Data"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200 p-4 shrink-0">
          <div className="p-2.5 mb-3 bg-blue-50/70 border border-blue-200 rounded-lg">
            <div className="text-xs font-semibold text-blue-900">{currentUser.name}</div>
            <div className="text-[11px] text-blue-700">{currentUser.designation}</div>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-200 text-blue-800">
                {currentUser.bureauCode}
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-200 text-slate-700">
                {currentUser.role.replace('_', ' ')}
              </span>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <div className="flex items-center space-x-3">
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.name}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full text-white ${
                        isActive ? 'bg-blue-800' : item.badgeColor
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-200">
            <div className="text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700">System Information</div>
              <div>GIGW & WCAG 2.1 AA Compliant</div>
              <div>Version 2.4-prod • AICTE New Delhi</div>
            </div>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            <div className="fixed inset-0 bg-slate-900/50" onClick={() => setMobileMenuOpen(false)} />
            <div className="relative w-64 max-w-[80%] bg-white p-4 flex flex-col h-full shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="font-bold text-slate-800">Menu</span>
                <button onClick={() => setMobileMenuOpen(false)}>
                  <X className="w-5 h-5 text-slate-600" />
                </button>
              </div>

              <div className="my-3">
                <select
                  value={currentUser.id}
                  onChange={(e) => {
                    const found = users.find(u => u.id === e.target.value);
                    if (found) setCurrentUser(found);
                  }}
                  className="w-full text-xs font-medium bg-slate-100 border border-slate-300 rounded p-2"
                >
                  {users.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.bureauCode})
                    </option>
                  ))}
                </select>
              </div>

              <nav className="flex-1 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </div>
                    {item.badge && (
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

