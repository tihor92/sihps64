import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Layers, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  Building2, 
  ArrowRight, 
  AlertTriangle, 
  Sparkles,
  ExternalLink,
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusChip } from '../components/StatusChip';
import { SlaBadge } from '../components/SlaBadge';

export const OverlapCenterPage: React.FC = () => {
  const { overlapGroups, cases, confirmOverlap, dismissOverlap, requestCoordination, currentUser } = useApp();
  const navigate = useNavigate();

  const [filterState, setFilterState] = useState<'ALL' | 'SUGGESTED' | 'CONFIRMED' | 'DISMISSED'>('ALL');
  
  // Coordination modal state
  const [coordinationModalOpen, setCoordinationModalOpen] = useState(false);
  const [activeGroupForCoordination, setActiveGroupForCoordination] = useState<string | null>(null);
  const [coordinationNote, setCoordinationNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const filteredGroups = overlapGroups.filter(g => {
    if (filterState === 'ALL') return true;
    return g.state === filterState;
  });

  const handleOpenCoordination = (groupId: string) => {
    const group = overlapGroups.find(g => g.id === groupId);
    setActiveGroupForCoordination(groupId);
    setCoordinationNote(group?.coordinationNote || '');
    setCoordinationModalOpen(true);
  };

  const handleSendCoordination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGroupForCoordination || !coordinationNote.trim()) return;

    requestCoordination(activeGroupForCoordination, coordinationNote);
    setCoordinationModalOpen(false);
    setActiveGroupForCoordination(null);
    setCoordinationNote('');
    
    setToastMessage('Coordination directive dispatched! Involved bureaus have been alerted.');
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleConfirm = (groupId: string) => {
    confirmOverlap(groupId);
    setToastMessage('Cross-bureau case linkage confirmed.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDismiss = (groupId: string) => {
    dismissOverlap(groupId);
    setToastMessage('Overlap suggestion marked as dismissed.');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Inter-Bureau Overlap Detection Center</h2>
            <span className="text-xs font-semibold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full flex items-center border border-amber-300">
              <Sparkles className="w-3 h-3 mr-1 text-amber-600" />
              Automated AI Trigram & TF-IDF Match Engine
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Prevent duplicated actions and contradictory council orders by correlating grievances across cells
          </p>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-4 py-3 rounded-lg flex items-center shadow-xs">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
          {toastMessage}
        </div>
      )}

      {/* State Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-3 text-xs font-semibold">
        <button
          onClick={() => setFilterState('ALL')}
          className={`px-3 py-1.5 rounded-lg transition ${
            filterState === 'ALL' 
              ? 'bg-blue-600 text-white' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Scenarios ({overlapGroups.length})
        </button>
        <button
          onClick={() => setFilterState('SUGGESTED')}
          className={`px-3 py-1.5 rounded-lg transition flex items-center ${
            filterState === 'SUGGESTED' 
              ? 'bg-amber-600 text-white' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <span>Suggested (Pending Review)</span>
          <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold">
            {overlapGroups.filter(g => g.state === 'SUGGESTED').length}
          </span>
        </button>
        <button
          onClick={() => setFilterState('CONFIRMED')}
          className={`px-3 py-1.5 rounded-lg transition ${
            filterState === 'CONFIRMED' 
              ? 'bg-emerald-600 text-white' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Confirmed Links ({overlapGroups.filter(g => g.state === 'CONFIRMED').length})
        </button>
        <button
          onClick={() => setFilterState('DISMISSED')}
          className={`px-3 py-1.5 rounded-lg transition ${
            filterState === 'DISMISSED' 
              ? 'bg-slate-700 text-white' 
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Dismissed ({overlapGroups.filter(g => g.state === 'DISMISSED').length})
        </button>
      </div>

      {/* Overlap Cards List */}
      <div className="space-y-6">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 text-slate-400">
            <Layers className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-sm font-medium text-slate-600">No overlap clusters under this filter</p>
          </div>
        ) : (
          filteredGroups.map((group) => {
            const isSuggested = group.state === 'SUGGESTED';

            return (
              <div 
                key={group.id}
                className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden"
              >
                {/* Header Banner */}
                <div className="p-4 bg-gradient-to-r from-slate-50 to-blue-50/40 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      group.confidence >= 90 ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="text-base font-bold text-slate-900">{group.institutionName}</h3>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                          group.state === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-800' :
                          group.state === 'DISMISSED' ? 'bg-slate-100 text-slate-700' :
                          'bg-amber-100 text-amber-800 animate-pulse'
                        }`}>
                          {group.state}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        AICTE Permanent ID: <span className="font-mono font-bold text-blue-700">{group.aicteId}</span> • Region: {group.region}
                      </p>
                    </div>
                  </div>

                  {/* Score & Actions */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-right mr-2">
                      <div className="text-xs text-slate-500">Correlation Confidence</div>
                      <div className="text-base font-black text-rose-600">{group.confidence}% Match</div>
                    </div>

                    {isSuggested && (
                      <>
                        <button
                          onClick={() => handleConfirm(group.id)}
                          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition shadow-xs flex items-center"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                          Confirm Link
                        </button>
                        <button
                          onClick={() => handleDismiss(group.id)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold rounded-lg transition flex items-center"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Dismiss
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => handleOpenCoordination(group.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition shadow-xs flex items-center"
                    >
                      <MessageSquare className="w-3.5 h-3.5 mr-1" />
                      {group.coordinationNote ? 'Update Coordination Note' : 'Request Coordination'}
                    </button>
                  </div>
                </div>

                {/* Match Signals Breakdown */}
                <div className="px-5 py-3 bg-amber-50/50 border-b border-amber-200/60 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-amber-900">
                  <span className="font-bold flex items-center">
                    <Sparkles className="w-3.5 h-3.5 mr-1 text-amber-600" />
                    Detection Signals:
                  </span>
                  {group.reasons.map((r, i) => (
                    <span key={i} className="flex items-center text-slate-700">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
                      {r}
                    </span>
                  ))}
                </div>

                {/* Coordination Note Banner (if present) */}
                {group.coordinationNote && (
                  <div className="px-5 py-3 bg-blue-50/70 border-b border-blue-200 flex items-start space-x-2 text-xs text-blue-900">
                    <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Active Inter-Bureau Coordination Directive: </span>
                      {group.coordinationNote}
                      {group.reviewedBy && (
                        <span className="text-blue-700 ml-1 text-[11px]">
                          — Issued by {group.reviewedBy} on {group.reviewedAt}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {/* Side-by-Side Comparison of Cases */}
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {group.cases.map((c, index) => (
                    <div 
                      key={c.id}
                      className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-xs transition space-y-2.5 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-xs text-blue-700">
                            {c.caseNumber}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800">
                            Cell: {c.currentBureau}
                          </span>
                        </div>

                        <div className="mt-2 flex items-center space-x-2">
                          <StatusChip status={c.status} size="sm" />
                          <span className="text-xs text-slate-500">Recv: {c.receivedOn}</span>
                        </div>

                        <h4 className="text-xs font-bold text-slate-900 mt-2 line-clamp-1">
                          {c.category}
                        </h4>

                        <p className="text-xs text-slate-700 font-medium mt-1 leading-snug">
                          {c.subject}
                        </p>

                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">
                          {c.description}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="text-[11px] text-slate-500">
                          Officer: <span className="font-semibold text-slate-700">{c.assignedOfficer}</span>
                        </span>
                        <Link 
                          to={`/cases/${c.id}`} 
                          className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center"
                        >
                          <span>Open Case File</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Request Coordination Note */}
      {coordinationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-bold text-slate-900">Issue Cross-Bureau Coordination Directive</h3>
              </div>
              <button 
                onClick={() => setCoordinationModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              This note will be attached to both cases and broadcast as a high-priority alert to handling officers in both Bureaus/Cells.
            </p>

            <form onSubmit={handleSendCoordination} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Coordination Instructions / Action Plan:
                </label>
                <textarea
                  rows={4}
                  value={coordinationNote}
                  onChange={(e) => setCoordinationNote(e.target.value)}
                  placeholder="e.g. Put approval variation on hold until Regulation Bureau's physical inspection report is reviewed. Schedule joint meeting next Tuesday."
                  className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  required
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCoordinationModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                >
                  Broadcast Coordination Directive
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

