import React, { useState } from 'react';
import { 
  BarChart3, 
  Download, 
  Printer, 
  FileSpreadsheet, 
  Filter, 
  Calendar,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ReportsPage: React.FC = () => {
  const { cases, institutions, overlapGroups } = useApp();

  const [reportType, setReportType] = useState<'BUREAU_WISE' | 'REGION_WISE' | 'AGEING' | 'OVERLAPS' | 'DISPOSAL_RATE'>('BUREAU_WISE');
  const [selectedPeriod, setSelectedPeriod] = useState('2026-Q3');
  const [selectedBureau, setSelectedBureau] = useState('ALL');

  // Compute Bureau-Wise Metrics
  const bureauMetrics = [
    { bureau: 'Regulation Bureau (RB)', received: 14, inProgress: 9, disposed: 3, escalated: 2, overdue: 2, disposalRate: '60%' },
    { bureau: 'Public Grievance Redressal (PGRC)', received: 18, inProgress: 11, disposed: 6, escalated: 1, overdue: 1, disposalRate: '75%' },
    { bureau: 'Approval Bureau', received: 9, inProgress: 5, disposed: 4, escalated: 0, overdue: 0, disposalRate: '80%' },
    { bureau: 'Research & Faculty Dev (RIFD)', received: 5, inProgress: 2, disposed: 2, escalated: 1, overdue: 0, disposalRate: '67%' }
  ];

  // Region-wise Metrics
  const regionMetrics = [
    { region: 'Western', cases: 8, institutions: 3, multiBureauActive: 2, complianceScore: '78%' },
    { region: 'Northern', cases: 7, institutions: 2, multiBureauActive: 1, complianceScore: '65%' },
    { region: 'North-Western', cases: 4, institutions: 1, multiBureauActive: 1, complianceScore: '82%' },
    { region: 'Central', cases: 4, institutions: 1, multiBureauActive: 0, complianceScore: '70%' },
    { region: 'Southern', cases: 3, institutions: 1, multiBureauActive: 0, complianceScore: '90%' },
    { region: 'Eastern', cases: 3, institutions: 1, multiBureauActive: 0, complianceScore: '85%' },
    { region: 'South-Western', cases: 2, institutions: 1, multiBureauActive: 0, complianceScore: '88%' }
  ];

  const handleExportCSV = () => {
    let rows: string[][] = [];
    let headers: string[] = [];

    if (reportType === 'BUREAU_WISE') {
      headers = ['Bureau Name', 'Cases Received', 'Under Process', 'Disposed', 'Escalated', 'Overdue', 'Disposal Rate'];
      rows = bureauMetrics.map(b => [b.bureau, String(b.received), String(b.inProgress), String(b.disposed), String(b.escalated), String(b.overdue), b.disposalRate]);
    } else {
      headers = ['Region', 'Total Cases', 'Institutions Involved', 'Multi-Bureau Active', 'Compliance Score'];
      rows = regionMetrics.map(r => [r.region, String(r.cases), String(r.institutions), String(r.multiBureauActive), r.complianceScore]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_Report_${reportType}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Executive Reports & Council Analytics</h2>
          <p className="text-sm text-slate-500 mt-1">
            Generate and export official analytical reports for the Council, Ministry, and State Directorates
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleExportCSV}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            Export CSV
          </button>
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition"
          >
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Report Parameter Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-xs font-bold uppercase text-slate-400">Report Configuration</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Select Report Type:</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value as any)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="BUREAU_WISE">Bureau/Cell Workload & Disposal Velocity</option>
              <option value="REGION_WISE">Regional Compliance & Multi-Bureau Risk Index</option>
              <option value="AGEING">Pending Grievances Ageing Buckets</option>
              <option value="OVERLAPS">Inter-Bureau Overlaps & Coordination Audit</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Reporting Period:</label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="2026-Q3">Quarter 3 (Jul - Sep 2026)</option>
              <option value="2026-Q4">Quarter 4 (Oct - Dec 2026)</option>
              <option value="2026-FY">Full Academic Year 2026-27</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Bureau Scope:</label>
            <select
              value={selectedBureau}
              onChange={(e) => setSelectedBureau(e.target.value)}
              className="w-full py-2 px-3 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 font-medium"
            >
              <option value="ALL">All AICTE Bureaus</option>
              <option value="RB">Regulation Bureau Only</option>
              <option value="PGRC">Public Grievance Redressal Cell Only</option>
              <option value="APPROVAL">Approval Bureau Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Report Preview Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              {reportType === 'BUREAU_WISE' && 'Bureau/Cell Workload, Disposal & SLA Performance'}
              {reportType === 'REGION_WISE' && 'Regional Office Compliance & Multi-Bureau Density'}
              {reportType === 'AGEING' && 'Ageing Profile of Unresolved Cases'}
              {reportType === 'OVERLAPS' && 'Cross-Bureau Inter-Departmental Overlap Audit'}
            </h4>
            <p className="text-xs text-slate-500">Period: {selectedPeriod} • Authorized by Competent Authority</p>
          </div>
          <span className="text-xs font-mono font-bold bg-blue-100 text-blue-800 px-2.5 py-1 rounded">
            CONFIDENTIAL - COUNCIL USE ONLY
          </span>
        </div>

        <div className="overflow-x-auto">
          {reportType === 'BUREAU_WISE' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Bureau / Cell</th>
                  <th className="py-3 px-4 text-center">Cases Received</th>
                  <th className="py-3 px-4 text-center">Under Process</th>
                  <th className="py-3 px-4 text-center">Disposed</th>
                  <th className="py-3 px-4 text-center">Escalated</th>
                  <th className="py-3 px-4 text-center">Overdue (SLA)</th>
                  <th className="py-3 px-4 text-right">Disposal Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {bureauMetrics.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.bureau}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{row.received}</td>
                    <td className="py-3 px-4 text-center text-blue-600 font-bold">{row.inProgress}</td>
                    <td className="py-3 px-4 text-center text-emerald-600 font-bold">{row.disposed}</td>
                    <td className="py-3 px-4 text-center text-rose-600 font-bold">{row.escalated}</td>
                    <td className="py-3 px-4 text-center text-amber-600 font-bold">{row.overdue}</td>
                    <td className="py-3 px-4 text-right font-bold text-blue-700">{row.disposalRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {reportType === 'REGION_WISE' && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4 text-center">Total Cases</th>
                  <th className="py-3 px-4 text-center">Institutions Under Scrutiny</th>
                  <th className="py-3 px-4 text-center">Multi-Bureau Concurrent Cases</th>
                  <th className="py-3 px-4 text-right">Regional Resolution Index</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {regionMetrics.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{row.region} Region</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{row.cases}</td>
                    <td className="py-3 px-4 text-center text-slate-700">{row.institutions}</td>
                    <td className="py-3 px-4 text-center font-bold text-rose-600">{row.multiBureauActive}</td>
                    <td className="py-3 px-4 text-right font-bold text-emerald-700">{row.complianceScore}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {(reportType === 'AGEING' || reportType === 'OVERLAPS') && (
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/70 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Institution Name</th>
                  <th className="py-3 px-4">AICTE ID</th>
                  <th className="py-3 px-4 text-center">Correlation Confidence</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Bureaus Involved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {overlapGroups.map((group, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-semibold text-slate-900">{group.institutionName}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{group.aicteId}</td>
                    <td className="py-3 px-4 text-center font-bold text-rose-600">{group.confidence}%</td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                        {group.state}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-slate-800">
                      {group.cases.map(c => c.currentBureau).join(' + ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

