import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  MapPin, 
  ShieldAlert, 
  Layers, 
  FileText, 
  Clock, 
  ExternalLink,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusChip } from '../components/StatusChip';
import { SlaBadge } from '../components/SlaBadge';
import { OverlapBadge } from '../components/OverlapBadge';

export const InstitutionProfilePage: React.FC = () => {
  const { aicteId } = useParams<{ aicteId: string }>();
  const navigate = useNavigate();
  const { institutions, cases, overlapGroups } = useApp();

  const institution = institutions.find(i => i.aictePermanentId === aicteId);
  const institutionCases = cases.filter(c => c.aictePermanentId === aicteId);
  
  // Check if multiple bureaus are actively handling cases
  const activeBureaus = Array.from(new Set(
    institutionCases
      .filter(c => c.status !== 'DISPOSED')
      .map(c => c.currentBureau)
  ));

  const hasMultiBureauActive = activeBureaus.length > 1;
  const relatedOverlapGroup = overlapGroups.find(g => g.aicteId === aicteId);

  if (!institution) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
        <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-3" />
        <h3 className="text-lg font-bold text-slate-800">Institution Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">No institution found with AICTE Permanent ID: {aicteId}</p>
        <button
          onClick={() => navigate('/institutions')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Back button & Title header */}
      <div className="flex items-center space-x-3">
        <button
          onClick={() => navigate('/institutions')}
          className="p-2 text-slate-500 hover:text-slate-800 hover:bg-white rounded-lg border border-slate-200 shadow-xs transition"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{institution.name}</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            AICTE Permanent ID: <span className="font-mono font-bold text-blue-700">{institution.aictePermanentId}</span>
          </p>
        </div>
      </div>

      {/* MULTI-BUREAU OVERLAP MANDATORY WARNING BANNER */}
      {hasMultiBureauActive && (
        <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-5 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3">
              <div className="p-2.5 bg-rose-600 text-white rounded-lg mt-0.5">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-rose-950">
                  Potential Overlapping Cases – Inter-Bureau Coordination Required!
                </h4>
                <p className="text-xs text-rose-800 mt-1 max-w-2xl leading-relaxed">
                  Notice to Handling Officers: This institution is concurrently undergoing scrutiny in multiple AICTE cells:
                  <span className="font-bold ml-1">
                    {activeBureaus.join(' and ')}
                  </span>.
                  Ensure decisions, notices, and inspections are synchronized before taking punitive or granting actions.
                </p>
              </div>
            </div>
            {relatedOverlapGroup && (
              <button
                onClick={() => navigate('/overlaps')}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition shadow-xs shrink-0"
              >
                Open Overlap Review ({relatedOverlapGroup.confidence}% Match)
              </button>
            )}
          </div>
        </div>
      )}

      {/* Institution Dossier Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold uppercase text-slate-400">Campus Location</div>
          <div className="text-sm font-semibold text-slate-800">{institution.address}</div>
          <div className="text-xs text-slate-600 flex items-center">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
            {institution.city}, {institution.state}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold uppercase text-slate-400">Jurisdiction & Classification</div>
          <div className="text-sm font-semibold text-slate-800">{institution.region} Regional Office</div>
          <div className="text-xs text-slate-600">Category: {institution.institutionType}</div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
          <div className="text-xs font-bold uppercase text-slate-400">Complaint Portfolio</div>
          <div className="text-2xl font-bold text-slate-900">
            {institutionCases.filter(c => c.status !== 'DISPOSED').length} <span className="text-xs font-normal text-slate-500">Active / {institutionCases.length} Cumulative</span>
          </div>
          <div className="flex items-center gap-1.5 pt-1">
            <span className="text-[11px] text-slate-500">Bureaus Involved:</span>
            {institution.activeBureaus.map(b => (
              <span key={b} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Consolidated History Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Consolidated Grievance & Investigation Track Record
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Unified cross-bureau record of all complaints, inquiries, and regulatory inspections
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md">
            {institutionCases.length} Registered Records
          </span>
        </div>

        {institutionCases.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="text-xs">No grievance or regulatory cases on record for this institution.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {institutionCases.map((c) => (
              <div
                key={c.id}
                onClick={() => navigate(`/cases/${c.id}`)}
                className="p-5 hover:bg-slate-50/80 transition cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-sm text-blue-700">{c.caseNumber}</span>
                    <StatusChip status={c.status} size="sm" />
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      Cell: {c.currentBureau}
                    </span>
                    {c.overlapConfidence && (
                      <OverlapBadge confidence={c.overlapConfidence} overlapGroupId={c.overlapGroupId} />
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900">{c.subject}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{c.description}</p>
                  <div className="text-[11px] text-slate-400 flex items-center gap-3 pt-1">
                    <span>Received: {c.receivedOn}</span>
                    <span>•</span>
                    <span>Officer: {c.assignedOfficer}</span>
                    <span>•</span>
                    <span>Complainant: {c.complainantType}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <SlaBadge 
                    expectedDisposalOn={c.expectedDisposalOn} 
                    isOverdue={c.isOverdue} 
                    status={c.status} 
                  />
                  <div className="text-xs text-blue-600 font-semibold hover:underline mt-2 flex items-center justify-end">
                    <span>View Case File</span>
                    <ExternalLink className="w-3.5 h-3.5 ml-1" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

