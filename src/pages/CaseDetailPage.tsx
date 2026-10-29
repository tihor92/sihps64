import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Clock, 
  User, 
  Send, 
  ArrowRightLeft, 
  Flame, 
  CheckCircle2, 
  FileText, 
  Layers, 
  Upload, 
  Link as LinkIcon,
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusChip } from '../components/StatusChip';
import { SlaBadge } from '../components/SlaBadge';
import { OverlapBadge } from '../components/OverlapBadge';
import { Status, BureauCode } from '../types';

export const CaseDetailPage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { 
    cases, 
    currentUser, 
    addCaseAction, 
    updateCaseStatus, 
    transferCase, 
    escalateCase, 
    overlapGroups 
  } = useApp();

  // Find active case
  const currentCase = cases.find(c => c.id === caseId);

  // Form states
  const [activeTab, setActiveTab] = useState<'timeline' | 'actions' | 'documents'>('timeline');
  const [remarkText, setRemarkText] = useState('');
  const [newStatus, setNewStatus] = useState<Status>('UNDER_PROCESS');
  const [targetBureau, setTargetBureau] = useState<BureauCode>('RB');
  const [transferRemarks, setTransferRemarks] = useState('');
  const [escalationRemarks, setEscalationRemarks] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  if (!currentCase) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
        <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Case Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">The requested case dossier does not exist.</p>
        <button
          onClick={() => navigate('/cases')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Return to Case Registry
        </button>
      </div>
    );
  }

  // RBAC Permission Check:
  // Admin: can do anything
  // Senior Mgmt: can escalate or read
  // Bureau Officer: can take action ONLY if case is currently with their bureau
  const canModifyCase = 
    currentUser.role === 'ADMIN' || 
    currentUser.bureauCode === currentCase.currentBureau;

  const canEscalate = 
    currentUser.role === 'ADMIN' || 
    currentUser.role === 'SENIOR_MGMT' || 
    canModifyCase;

  // Check for overlap group
  const overlapGroup = overlapGroups.find(g => g.id === currentCase.overlapGroupId);
  const relatedCases = cases.filter(c => currentCase.linkedCaseIds.includes(c.id));

  const handleAddRemark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarkText.trim()) return;

    addCaseAction(currentCase.id, {
      actionType: 'REMARK',
      remarks: remarkText,
      statusAfter: newStatus
    });

    setRemarkText('');
    setFeedbackMsg('Action recorded successfully in append-only audit trail.');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferRemarks.trim()) return;

    transferCase(currentCase.id, targetBureau, transferRemarks);
    setTransferRemarks('');
    setFeedbackMsg(`Case transferred to ${targetBureau} Bureau.`);
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  const handleEscalate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!escalationRemarks.trim()) return;

    escalateCase(currentCase.id, escalationRemarks);
    setEscalationRemarks('');
    setFeedbackMsg('Case escalated to Senior Management / Competent Authority.');
    setTimeout(() => setFeedbackMsg(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Back button & Title header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => navigate('/cases')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg border border-slate-200 shadow-xs transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold font-mono text-slate-900">{currentCase.caseNumber}</h2>
              <StatusChip status={currentCase.status} />
              {currentCase.overlapConfidence && (
                <OverlapBadge 
                  confidence={currentCase.overlapConfidence} 
                  overlapGroupId={currentCase.overlapGroupId} 
                />
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registered on {currentCase.receivedOn} • Category: <span className="font-semibold text-slate-700">{currentCase.category}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <SlaBadge 
            expectedDisposalOn={currentCase.expectedDisposalOn} 
            isOverdue={currentCase.isOverdue} 
            status={currentCase.status} 
          />
        </div>
      </div>

      {/* Success / Feedback toast */}
      {feedbackMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs px-4 py-2.5 rounded-lg flex items-center shadow-xs">
          <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />
          {feedbackMsg}
        </div>
      )}

      {/* RBAC Permission Banner if officer cannot edit */}
      {!canModifyCase && (
        <div className="bg-slate-100 border border-slate-300 text-slate-700 text-xs px-4 py-2.5 rounded-lg flex items-center">
          <span className="font-semibold mr-1">Read-Only Mode:</span>
          You are signed in as {currentUser.name} ({currentUser.bureauCode}). Modifying actions is restricted to officers of the assigned Bureau ({currentCase.currentBureau}).
        </div>
      )}

      {/* Cross-Bureau Overlap Alert Box (if present) */}
      {overlapGroup && (
        <div className="bg-gradient-to-r from-amber-50 to-rose-50 border border-amber-300 rounded-xl p-4 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="flex items-start space-x-3">
              <div className="p-2 bg-amber-500 text-white rounded-lg mt-0.5">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-bold text-slate-900">
                    Cross-Bureau Overlap Alert ({overlapGroup.confidence}% Match)
                  </h4>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                    Status: {overlapGroup.state}
                  </span>
                </div>
                <p className="text-xs text-slate-700 mt-1">
                  This institution has another concurrent case in another cell:
                </p>
                <div className="mt-2 space-y-1">
                  {overlapGroup.reasons.map((reason, idx) => (
                    <div key={idx} className="text-[11px] text-slate-600 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-2 shrink-0"></span>
                      {reason}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <Link
              to="/overlaps"
              className="text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg transition shrink-0 self-start md:self-center shadow-xs"
            >
              Open Overlap Center
            </Link>
          </div>
        </div>
      )}

      {/* Main Grid: Details (Left) + Workflow / Actions (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metadata & Institution Dossier */}
        <div className="space-y-6">
          {/* Institution Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Target Institution</span>
              <Building2 className="w-4 h-4 text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                {currentCase.institutionName}
              </h3>
              <p className="text-xs font-mono text-blue-700 mt-1">
                AICTE Permanent ID: {currentCase.aictePermanentId}
              </p>
            </div>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Region:</span>
              <span className="font-semibold text-slate-800">{currentCase.region}</span>
            </div>
            <Link
              to={`/institutions/${currentCase.aictePermanentId}`}
              className="block text-center text-xs font-semibold text-blue-600 hover:text-blue-800 bg-blue-50 py-2 rounded-lg transition"
            >
              View Full Institution History →
            </Link>
          </div>

          {/* Case Information Card */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <span className="text-xs font-bold uppercase text-slate-400">Case Metadata</span>
            
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Complainant:</span>
                <span className="font-semibold text-slate-800">{currentCase.complainantType}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Originating Bureau:</span>
                <span className="font-semibold text-slate-800">{currentCase.sourceBureau}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Handling Bureau:</span>
                <span className="font-semibold text-blue-700">{currentCase.currentBureau}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Assigned Officer:</span>
                <span className="font-semibold text-slate-800">{currentCase.assignedOfficer}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Disposal Target:</span>
                <span className="font-semibold text-slate-800">{currentCase.expectedDisposalOn}</span>
              </div>
            </div>

            <div className="pt-2">
              <h5 className="text-xs font-bold text-slate-800 mb-1">Subject:</h5>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
                {currentCase.subject}
              </p>
            </div>

            <div>
              <h5 className="text-xs font-bold text-slate-800 mb-1">Detailed Grievance:</h5>
              <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded border border-slate-200 leading-relaxed">
                {currentCase.description}
              </p>
            </div>
          </div>

          {/* Related / Linked Cases */}
          {relatedCases.length > 0 && (
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-2">
                <LinkIcon className="w-4 h-4 text-blue-600" />
                <h4 className="text-xs font-bold uppercase text-slate-600">Cross-Referenced Cases</h4>
              </div>
              <div className="space-y-2">
                {relatedCases.map(rc => (
                  <Link
                    key={rc.id}
                    to={`/cases/${rc.id}`}
                    className="block p-2 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 transition text-xs"
                  >
                    <div className="font-mono font-bold text-blue-700">{rc.caseNumber}</div>
                    <div className="text-slate-600 mt-0.5 line-clamp-1">{rc.subject}</div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      {rc.currentBureau} • {rc.status}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Columns: Workflow Timeline & Action Tabs */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tabs Navigation */}
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex space-x-1">
            <button
              onClick={() => setActiveTab('timeline')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'timeline' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Workflow Timeline ({currentCase.actions.length})
            </button>
            <button
              onClick={() => setActiveTab('actions')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'actions' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Take Action / Transfer / Escalate
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
                activeTab === 'documents' 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Supporting Documents ({currentCase.documents.length})
            </button>
          </div>

          {/* TAB 1: WORKFLOW TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Append-Only Procedural Timeline</h3>
                  <p className="text-xs text-slate-500">Official log of decisions, notices, hearings and bureau actions</p>
                </div>
                <span className="text-[11px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">
                  Immutable Audit Chain
                </span>
              </div>

              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {currentCase.actions.map((act, index) => (
                  <div key={act.id} className="relative group">
                    {/* Timeline bullet */}
                    <div className="absolute -left-6 top-1 w-4 h-4 rounded-full border-2 border-white bg-blue-600 shadow-xs" />
                    
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-slate-900">{act.actionType}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            {act.fromBureau} {act.toBureau && act.toBureau !== act.fromBureau ? `→ ${act.toBureau}` : ''}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">{act.performedAt}</span>
                      </div>
                      
                      <p className="text-xs text-slate-700 mt-2 leading-relaxed">
                        {act.remarks}
                      </p>

                      <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {act.performedByName}
                        </span>
                        {act.statusAfter && (
                          <span className="text-slate-600">
                            Status: <b>{act.statusAfter}</b>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: ACTIONS & TRANSFERS */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              {/* Add Remark Form */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Add Procedural Remark / Update Status</h3>
                <p className="text-xs text-slate-500">
                  Record show-cause notice issuance, hearing summary, or update disposition status.
                </p>

                <form onSubmit={handleAddRemark} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Update Case Status:
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value as Status)}
                      disabled={!canModifyCase}
                      className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      <option value="PENDING">Pending Scrutiny</option>
                      <option value="UNDER_PROCESS">Under Process (Investigation)</option>
                      <option value="DISPOSED">Disposed (Resolved & Closed)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Remarks / Decision Notes:
                    </label>
                    <textarea
                      rows={3}
                      value={remarkText}
                      onChange={(e) => setRemarkText(e.target.value)}
                      disabled={!canModifyCase}
                      placeholder="Enter official action details, committee findings, or communication summary..."
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!canModifyCase || !remarkText.trim()}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center"
                  >
                    <Send className="w-3.5 h-3.5 mr-1.5" />
                    Commit Action to Audit Trail
                  </button>
                </form>
              </div>

              {/* Inter-Bureau Transfer */}
              <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <ArrowRightLeft className="w-4 h-4 text-purple-600" />
                  <h3 className="text-sm font-bold text-slate-900">Transfer to Another Bureau/Cell</h3>
                </div>
                <p className="text-xs text-slate-500">
                  Transfer jurisdiction (e.g. from Grievance Cell to Regulation Bureau for punitive inquiry).
                </p>

                <form onSubmit={handleTransfer} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Destination Bureau:
                    </label>
                    <select
                      value={targetBureau}
                      onChange={(e) => setTargetBureau(e.target.value as BureauCode)}
                      disabled={!canModifyCase}
                      className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    >
                      <option value="RB">Regulation Bureau (RB)</option>
                      <option value="PGRC">Public Grievance Redressal Cell (PGRC)</option>
                      <option value="APPROVAL">Approval Bureau</option>
                      <option value="RIFD">RIFD</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Reason for Transfer:
                    </label>
                    <textarea
                      rows={2}
                      value={transferRemarks}
                      onChange={(e) => setTransferRemarks(e.target.value)}
                      disabled={!canModifyCase}
                      placeholder="Specify why jurisdiction is being reassigned..."
                      className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!canModifyCase || !transferRemarks.trim()}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center"
                  >
                    <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" />
                    Execute Bureau Transfer
                  </button>
                </form>
              </div>

              {/* Escalate Case */}
              <div className="bg-white p-6 rounded-xl border border-rose-200 shadow-xs space-y-4">
                <div className="flex items-center space-x-2">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <h3 className="text-sm font-bold text-rose-900">Escalate to Senior Management / Member Secretary</h3>
                </div>
                <p className="text-xs text-rose-700">
                  Escalate cases with severe regulatory breaches, court notices, or persistent institution defiance.
                </p>

                <form onSubmit={handleEscalate} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Escalation Rationale:
                    </label>
                    <textarea
                      rows={2}
                      value={escalationRemarks}
                      onChange={(e) => setEscalationRemarks(e.target.value)}
                      disabled={!canEscalate}
                      placeholder="Provide justification for senior management intervention..."
                      className="w-full p-3 text-xs bg-rose-50/50 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!canEscalate || !escalationRemarks.trim()}
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center"
                  >
                    <Flame className="w-3.5 h-3.5 mr-1.5" />
                    Escalate to Competent Authority
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* TAB 3: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Attached Documents & Evidences</h3>
                  <p className="text-xs text-slate-500">Official show cause notices, compliance responses, and inspection reports</p>
                </div>
                <button 
                  onClick={() => alert('Simulated document upload: File uploaded and encrypted with SHA-256.')}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-xs font-semibold rounded-lg hover:bg-blue-100 transition flex items-center"
                >
                  <Upload className="w-3.5 h-3.5 mr-1.5" />
                  Upload Document
                </button>
              </div>

              {currentCase.documents.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs">No documents uploaded for this case yet.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {currentCase.documents.map((doc) => (
                    <div key={doc.id} className="py-3 flex items-center justify-between hover:bg-slate-50 p-2 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileCheck className="w-5 h-5 text-blue-600" />
                        <div>
                          <div className="text-xs font-bold text-slate-900">{doc.fileName}</div>
                          <div className="text-[11px] text-slate-400">
                            Size: {doc.fileSize} • Uploaded by {doc.uploadedBy} on {doc.uploadedAt}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => alert(`Simulated download of ${doc.fileName}`)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-800"
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

