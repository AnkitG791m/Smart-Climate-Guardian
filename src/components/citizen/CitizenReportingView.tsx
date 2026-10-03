import React, { useState } from 'react';
import { 
  Users, 
  PlusCircle, 
  ThumbsUp, 
  MapPin, 
  Clock, 
  Search, 
  Filter, 
  ShieldCheck, 
  AlertCircle, 
  Share2, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { useClimate } from '../../context/ClimateContext';
import { CitizenReport } from '../../types';
import { StatusBadge } from '../common/StatusBadge';

export const CitizenReportingView: React.FC = () => {
  const { citizenReports, upvoteReport, setIsReportModalOpen } = useClimate();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchFilter, setSearchFilter] = useState('');

  const categories = [
    'All',
    'Illegal Burning',
    'Chemical Odor',
    'Flash Flooding',
    'Urban Heat Pocket',
    'Industrial Smoke',
    'Drainage Blockage',
    'Wildfire Smoke'
  ];

  const filteredReports = citizenReports.filter(rep => {
    const matchesCategory = selectedCategory === 'All' || rep.category === selectedCategory;
    const matchesSearch = 
      rep.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rep.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
      rep.locationName.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* 1. HEADER & ACTION STRIP */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Decentralized Community Resilience
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Citizen Climate Reporting Feed
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Crowdsourced ground-truth telemetry verifying local smoke spikes, chemical leaks, and flash flooding.
            </p>
          </div>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-forest-800 hover:from-emerald-500 hover:to-forest-700 text-white font-bold text-sm shadow-eco-md transition-all transform hover:-translate-y-0.5"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Submit Ground Incident</span>
          </button>
        </div>

        {/* Search & Category Filter Pills */}
        <div className="mt-6 pt-5 border-t border-slate-100 dark:border-emerald-950 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search incidents, locations..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-slate-50 dark:bg-obsidian-900 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Category Scroller */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-obsidian-900 text-slate-600 dark:text-slate-400 hover:text-emerald-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. INCIDENT FEED LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredReports.map((report) => (
          <div
            key={report.id}
            className="glass-panel rounded-3xl overflow-hidden border border-slate-200 dark:border-emerald-950 hover:shadow-eco-md transition-all duration-300 flex flex-col justify-between group"
          >
            <div>
              {/* Image Preview with Badges */}
              <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-obsidian-900">
                <img
                  src={report.imageUrl}
                  alt={report.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/70 backdrop-blur-md text-white border border-white/20">
                    {report.category}
                  </span>
                  <StatusBadge category={report.status} size="sm" />
                </div>
                <div className="absolute top-3 right-3">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    report.severity === 'critical' ? 'bg-red-600 text-white' :
                    report.severity === 'high' ? 'bg-orange-500 text-white' :
                    'bg-slate-800 text-slate-200'
                  }`}>
                    {report.severity} Severity
                  </span>
                </div>
              </div>

              {/* Report Body */}
              <div className="p-5">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-emerald-500" />
                  <span>{report.timestamp}</span>
                  <span>•</span>
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{report.locationName}</span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white line-clamp-2 mt-1">
                  {report.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                  {report.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 font-bold flex items-center justify-center text-[10px]">
                      {report.reporterName.charAt(0)}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200 block text-[11px] leading-tight">
                        {report.reporterName}
                      </span>
                      <span className="text-[10px] text-slate-400 block">{report.reporterType}</span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">
                    {report.corroborations} Witnesses Corroborated
                  </span>
                </div>
              </div>
            </div>

            {/* Card Action Footer */}
            <div className="px-5 py-3.5 bg-slate-50/70 dark:bg-obsidian-900/60 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
              <button
                onClick={() => upvoteReport(report.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  report.hasUserUpvoted
                    ? 'bg-emerald-500 text-white shadow-sm'
                    : 'bg-white dark:bg-obsidian-800 text-slate-700 dark:text-slate-300 hover:text-emerald-500 border border-slate-200 dark:border-slate-700'
                }`}
              >
                <ThumbsUp className={`w-3.5 h-3.5 ${report.hasUserUpvoted ? 'fill-current' : ''}`} />
                <span>Confirm & Upvote ({report.upvotes})</span>
              </button>

              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Verified Hash</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <div className="glass-panel rounded-3xl p-12 text-center text-slate-400">
          <p className="text-base font-bold text-slate-600 dark:text-slate-300">No reports found for this filter.</p>
          <p className="text-xs mt-1">Be the first to submit ground observations in this region.</p>
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs"
          >
            Create First Report
          </button>
        </div>
      )}
    </div>
  );
};
