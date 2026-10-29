import React, { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  Plus, 
  Layers, 
  AlertCircle, 
  Eye, 
  ArrowUpDown,
  Building,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { StatusChip } from '../components/StatusChip';
import { SlaBadge } from '../components/SlaBadge';
import { OverlapBadge } from '../components/OverlapBadge';
import { BureauCode, Status } from '../types';

export const CaseListPage: React.FC = () => {
  const { cases, currentUser } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBureau, setSelectedBureau] = useState<string>(searchParams.get('bureau') || 'ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>(searchParams.get('status') || 'ALL');
  const [selectedRegion, setSelectedRegion] = useState<string>('ALL');
  const [overdueOnly, setOverdueOnly] = useState<boolean>(searchParams.get('overdue') === 'true');
  const [overlapOnly, setOverlapOnly] = useState<boolean>(false);
  
  // Sort State
  const [sortField, setSortField] = useState<'receivedOn' | 'expectedDisposalOn' | 'status'>('receivedOn');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtered & Sorted Cases
  const filteredCases = useMemo(() => {
    return cases.filter(c => {
      // Search text (Case Number, Institution Name, AICTE ID, Subject)
      const matchesSearch = 
        searchTerm === '' ||
        c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.institutionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.aictePermanentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.subject.toLowerCase().includes(searchTerm.toLowerCase());

      // Bureau filter
      const matchesBureau = selectedBureau === 'ALL' || c.currentBureau === selectedBureau;

      // Status filter
      const matchesStatus = selectedStatus === 'ALL' || c.status === selectedStatus;

      // Region filter
      const matchesRegion = selectedRegion === 'ALL' || c.region === selectedRegion;

      // Overdue filter
      const matchesOverdue = !overdueOnly || c.isOverdue || (c.status !== 'DISPOSED' && new Date(c.expectedDisposalOn) < new Date('2026-10-30'));

      // Overlap filter
      const matchesOverlap = !overlapOnly || (c.overlapGroupId !== undefined);

      return matchesSearch && matchesBureau && matchesStatus && matchesRegion && matchesOverdue && matchesOverlap;
    }).sort((a, b) => {
      let comparison = 0;
      if (sortField === 'receivedOn') {
        comparison = new Date(a.receivedOn).getTime() - new Date(b.receivedOn).getTime();
      } else if (sortField === 'expectedDisposalOn') {
        comparison = new Date(a.expectedDisposalOn).getTime() - new Date(b.expectedDisposalOn).getTime();
      } else if (sortField === 'status') {
        comparison = a.status.localeCompare(b.status);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [cases, searchTerm, selectedBureau, selectedStatus, selectedRegion, overdueOnly, overlapOnly, sortField, sortOrder]);

  const totalPages = Math.ceil(filteredCases.length / itemsPerPage) || 1;
  const paginatedCases = filteredCases.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleSort = (field: 'receivedOn' | 'expectedDisposalOn' | 'status') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = ['Case Number', 'Institution', 'AICTE ID', 'Region', 'Category', 'Bureau', 'Status', 'Received Date', 'Disposal Deadline', 'Overdue'];
    const rows = filteredCases.map(c => [
      c.caseNumber,
      `"${c.institutionName}"`,
      c.aictePermanentId,
      c.region,
      `"${c.category}"`,
      c.currentBureau,
      c.status,
      c.receivedOn,
      c.expectedDisposalOn,
      c.isOverdue ? 'YES' : 'NO'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `AICTE_Cases_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Case Directory & Investigation Registry</h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse, search and track cases across all active AICTE Bureaus and Regional Offices
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
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search box */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by Institution, AICTE Permanent ID, or Case Number..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
            />
          </div>

          {/* Bureau Filter */}
          <div>
            <select
              value={selectedBureau}
              onChange={(e) => {
                setSelectedBureau(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Bureaus/Cells</option>
              <option value="RB">Regulation Bureau (RB)</option>
              <option value="PGRC">Grievance Cell (PGRC)</option>
              <option value="APPROVAL">Approval Bureau</option>
              <option value="RIFD">RIFD</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Statuses</option>
              <option value="PENDING">Pending Scrutiny</option>
              <option value="UNDER_PROCESS">Under Process</option>
              <option value="ESCALATED">Escalated</option>
              <option value="TRANSFERRED">Transferred</option>
              <option value="DISPOSED">Disposed / Closed</option>
            </select>
          </div>
        </div>

        {/* Secondary Filters: Region + Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-3">
            {/* Region select */}
            <div className="flex items-center space-x-1.5 text-xs text-slate-500">
              <span className="font-semibold">Region:</span>
              <select
                value={selectedRegion}
                onChange={(e) => {
                  setSelectedRegion(e.target.value);
                  setCurrentPage(1);
                }}
                className="text-xs py-1 px-2 bg-slate-50 border border-slate-200 rounded"
              >
                <option value="ALL">All Regions</option>
                <option value="Northern">Northern</option>
                <option value="Western">Western</option>
                <option value="Southern">Southern</option>
                <option value="Central">Central</option>
                <option value="North-Western">North-Western</option>
                <option value="Eastern">Eastern</option>
                <option value="South-Western">South-Western</option>
              </select>
            </div>

            {/* Overdue toggle */}
            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100">
              <input
                type="checkbox"
                checked={overdueOnly}
                onChange={(e) => {
                  setOverdueOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded text-rose-600 focus:ring-rose-500"
              />
              <span className="flex items-center text-rose-700">
                <AlertCircle className="w-3.5 h-3.5 mr-1 text-rose-500" />
                Overdue Only
              </span>
            </label>

            {/* Overlap toggle */}
            <label className="flex items-center space-x-2 text-xs font-medium text-slate-700 cursor-pointer bg-slate-50 px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100">
              <input
                type="checkbox"
                checked={overlapOnly}
                onChange={(e) => {
                  setOverlapOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded text-blue-600 focus:ring-blue-500"
              />
              <span className="flex items-center text-blue-700">
                <Layers className="w-3.5 h-3.5 mr-1 text-blue-500" />
                Overlaps Only
              </span>
            </label>
          </div>

          <div className="text-xs text-slate-500">
            Showing <span className="font-bold text-slate-900">{filteredCases.length}</span> cases matching criteria
          </div>
        </div>
      </div>

      {/* Cases Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Case Number</th>
                <th className="py-3 px-4">Institution & AICTE ID</th>
                <th className="py-3 px-4">Category</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition"
                  onClick={() => handleSort('receivedOn')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Received</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition"
                  onClick={() => handleSort('status')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Status</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4">Current Cell</th>
                <th className="py-3 px-4">Assigned Officer</th>
                <th 
                  className="py-3 px-4 cursor-pointer hover:bg-slate-100 transition"
                  onClick={() => handleSort('expectedDisposalOn')}
                >
                  <div className="flex items-center space-x-1">
                    <span>Deadline (SLA)</span>
                    <ArrowUpDown className="w-3 h-3 text-slate-400" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Cross-Bureau Overlap</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedCases.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-slate-400">
                    <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    <p className="text-sm font-medium text-slate-600">No cases match the selected filters</p>
                    <p className="text-xs text-slate-400 mt-1">Try resetting your search query or filters.</p>
                  </td>
                </tr>
              ) : (
                paginatedCases.map((c) => (
                  <tr 
                    key={c.id} 
                    className="hover:bg-blue-50/40 transition group cursor-pointer"
                    onClick={() => navigate(`/cases/${c.id}`)}
                  >
                    <td className="py-3 px-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {c.caseNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition">
                        {c.institutionName}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <span className="font-mono">{c.aictePermanentId}</span>
                        <span>•</span>
                        <span>{c.region}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 max-w-[200px] truncate" title={c.category}>
                      {c.category}
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {c.receivedOn}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusChip status={c.status} size="sm" />
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                        {c.currentBureau}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                      {c.assignedOfficer}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <SlaBadge 
                        expectedDisposalOn={c.expectedDisposalOn} 
                        isOverdue={c.isOverdue} 
                        status={c.status} 
                      />
                    </td>
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      {c.overlapGroupId ? (
                        <OverlapBadge 
                          confidence={c.overlapConfidence} 
                          overlapGroupId={c.overlapGroupId} 
                          size="sm"
                        />
                      ) : (
                        <span className="text-slate-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => navigate(`/cases/${c.id}`)}
                        className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-md transition"
                        title="View Full Case Dossier"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Page <span className="font-bold text-slate-900">{currentPage}</span> of <span className="font-bold text-slate-900">{totalPages}</span>
          </div>
          <div className="flex items-center space-x-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 rounded font-medium ${
                  currentPage === page 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white border border-slate-300 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1 border border-slate-300 rounded bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

