import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Search, 
  Layers, 
  MapPin, 
  FileText, 
  ArrowUpRight,
  ShieldAlert
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const InstitutionsListPage: React.FC = () => {
  const { institutions, cases } = useApp();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('ALL');

  const filteredInstitutions = institutions.filter(inst => {
    const matchesSearch = 
      searchTerm === '' ||
      inst.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.aictePermanentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inst.state.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegion = regionFilter === 'ALL' || inst.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Technical Institutions Master Directory</h2>
          <p className="text-sm text-slate-500 mt-1">
            Browse institution profiles, historical compliance track records, and multi-bureau active matters
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search by institution name, city, state, or AICTE Permanent ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white"
          />
        </div>

        <div className="w-full md:w-56">
          <select
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
            className="w-full py-2 px-3 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500"
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
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredInstitutions.map((inst) => {
          const instCases = cases.filter(c => c.institutionId === inst.id);
          const hasMultiBureau = inst.activeBureaus.length > 1;

          return (
            <div
              key={inst.id}
              onClick={() => navigate(`/institutions/${inst.aictePermanentId}`)}
              className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md hover:border-blue-300 transition cursor-pointer p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700">
                    <Building2 className="w-5 h-5" />
                  </div>
                  {hasMultiBureau && (
                    <span className="inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                      <ShieldAlert className="w-3 h-3 mr-1 text-amber-600" />
                      Multi-Bureau Active
                    </span>
                  )}
                </div>

                <h3 className="text-sm font-bold text-slate-900 mt-3 line-clamp-2">
                  {inst.name}
                </h3>

                <div className="mt-2 space-y-1 text-xs text-slate-500">
                  <div className="font-mono text-blue-700 font-semibold">
                    AICTE ID: {inst.aictePermanentId}
                  </div>
                  <div className="flex items-center text-slate-600">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {inst.city}, {inst.state} ({inst.region} Region)
                  </div>
                  <div>Type: <span className="font-medium text-slate-700">{inst.institutionType}</span></div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900">{inst.openCases}</span> Open / {inst.totalCases} Total
                </div>
                <div className="flex items-center gap-1">
                  {inst.activeBureaus.map(b => (
                    <span key={b} className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                      {b}
                    </span>
                  ))}
                  <ArrowUpRight className="w-4 h-4 text-blue-600 ml-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

