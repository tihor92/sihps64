import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, UserCheck, Lock, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const LoginPage: React.FC = () => {
  const { users, setCurrentUser } = useApp();
  const navigate = useNavigate();
  const [selectedUserId, setSelectedUserId] = useState(users[0].id);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.find(u => u.id === selectedUserId);
    if (user) {
      setCurrentUser(user);
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-900 to-indigo-800 text-white font-black text-2xl flex items-center justify-center mx-auto shadow-md">
            AICTE
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            AICTE Institutional Grievance & Complaint Portal
          </h2>
          <p className="text-xs text-slate-500">
            Single-Window Monitoring & Inter-Bureau Overlap Resolution System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Official Sign-In Persona:
            </label>
            <div className="space-y-2">
              {users.map(u => (
                <label
                  key={u.id}
                  onClick={() => setSelectedUserId(u.id)}
                  className={`block p-3 rounded-xl border text-xs cursor-pointer transition ${
                    selectedUserId === u.id
                      ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{u.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {u.bureauCode}
                    </span>
                  </div>
                  <div className="text-slate-500 text-[11px] mt-0.5">
                    {u.designation} • <span className="font-semibold text-slate-700">{u.role.replace('_', ' ')}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-md transition flex items-center justify-center space-x-2"
          >
            <span>Proceed to Authorized Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Government of India • Ministry of Education • AICTE New Delhi
          </p>
        </div>
      </div>
    </div>
  );
};

