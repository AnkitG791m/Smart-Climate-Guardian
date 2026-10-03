import React, { useState } from 'react';
import { 
  Building2, 
  FileDown, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  FileText, 
  Download, 
  Layers, 
  Users, 
  Check, 
  Clock,
  Printer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useClimate } from '../../context/ClimateContext';
import { generateClimateExecutivePdf } from '../../services/pdfReportGenerator';
import { StatusBadge } from '../common/StatusBadge';
import { MetricCard } from '../common/MetricCard';

export const AuthorityDashboardView: React.FC = () => {
  const { currentStation, stations, authorityAudits, citizenReports, alerts } = useClimate();
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(currentStation.id);

  const targetStation = stations.find(s => s.id === selectedStationId) || currentStation;

  const handleDownloadPdf = (stationToExport = targetStation) => {
    setDownloadingPdf(true);
    try {
      generateClimateExecutivePdf(stationToExport, citizenReports, alerts);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
        colors: ['#10b981', '#065f46', '#84cc16']
      });
    } catch (e) {
      console.error('Failed to generate PDF:', e);
    } finally {
      setTimeout(() => setDownloadingPdf(false), 1200);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. HEADER & PDF EXPORT HERO */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/25 shadow-eco-md">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20">
              <Building2 className="w-3.5 h-3.5" />
              <span>Municipal & Regulatory Compliance Portal</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Environmental Authority Oversight & Audit Dossiers
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Standardized environmental compliance auditing aligned with ISO 14001, WHO 2021 guidelines, and Sendai disaster reduction frameworks. Generate certified PDF regulatory reports instantly.
            </p>
          </div>

          {/* Quick PDF Generator Card */}
          <div className="w-full lg:w-auto glass-panel-elevated rounded-2xl p-5 border border-emerald-500/30 flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Target Audit Station
              </span>
              <select
                value={selectedStationId}
                onChange={(e) => setSelectedStationId(e.target.value)}
                className="mt-1 bg-slate-100 dark:bg-obsidian-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {stations.map(st => (
                  <option key={st.id} value={st.id}>
                    {st.name} ({st.country})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => handleDownloadPdf()}
              disabled={downloadingPdf}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-forest-800 hover:from-emerald-500 hover:to-forest-700 text-white font-bold text-xs shadow-eco-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FileDown className={`w-4 h-4 ${downloadingPdf ? 'animate-bounce' : ''}`} />
              <span>{downloadingPdf ? 'Compiling Dossier...' : 'Generate Official PDF'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. REGULATORY KPI CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          label="Legal Compliance Rate"
          value="87.6"
          unit="%"
          icon={ShieldCheck}
          progress={87.6}
          subtext="WHO 24h Thresholds"
          variant="emerald"
        />

        <MetricCard
          label="24h Exceedance Events"
          value="30"
          unit="Breaches"
          icon={AlertTriangle}
          subtext="Industrial & traffic plumes"
          variant="rose"
        />

        <MetricCard
          label="Active Municipal Dispatches"
          value="12"
          unit="Crews"
          icon={Users}
          subtext="Mist cannons & hazmat"
          variant="purple"
        />

        <MetricCard
          label="Sensor Grid Uptime"
          value="99.8"
          unit="%"
          icon={Activity}
          progress={99.8}
          subtext="Continuous live telemetry"
          variant="emerald"
        />
      </div>

      {/* 3. MULTI-STATION REGULATORY AUDIT TABLE */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-slate-100 dark:border-emerald-950">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" />
              Regional Stations Compliance Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Regulatory compliance scores and legal limit violations logged over the rolling 24-hour window.
            </p>
          </div>

          <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            AUDIT-CYCLE: 2026-Q4
          </span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-mono">
                <th className="pb-3">Station Node</th>
                <th className="pb-3">Compliance Rate</th>
                <th className="pb-3">24h Exceedances</th>
                <th className="pb-3">Sensor Telemetry SLA</th>
                <th className="pb-3">Sensor Health</th>
                <th className="pb-3">Dispatches</th>
                <th className="pb-3 text-right">Audit Dossier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {authorityAudits.map((audit) => {
                const matchedStation = stations.find(s => s.id === audit.stationId);
                return (
                  <tr key={audit.stationId} className="hover:bg-slate-50/50 dark:hover:bg-obsidian-900/50 transition-colors">
                    <td className="py-3.5 pr-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {audit.stationName}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Standard: {audit.legalStandard}
                      </div>
                    </td>

                    <td className="py-3.5 pr-4 font-mono font-bold">
                      <span className={audit.complianceRate > 80 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>
                        {audit.complianceRate}%
                      </span>
                    </td>

                    <td className="py-3.5 pr-4 font-mono">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        audit.exceedanceEvents24h > 5
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600'
                          : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'
                      }`}>
                        {audit.exceedanceEvents24h} incidents
                      </span>
                    </td>

                    <td className="py-3.5 pr-4 font-mono text-slate-700 dark:text-slate-300">
                      {audit.uptimeRate}%
                    </td>

                    <td className="py-3.5 pr-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        audit.sensorHealth === 'Optimal'
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                          : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                      }`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {audit.sensorHealth}
                      </span>
                    </td>

                    <td className="py-3.5 pr-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {audit.activeDispatches} teams
                    </td>

                    <td className="py-3.5 text-right">
                      <button
                        onClick={() => matchedStation && handleDownloadPdf(matchedStation)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-obsidian-800 hover:bg-emerald-500 hover:text-white text-slate-700 dark:text-slate-300 font-bold text-[11px] transition-all inline-flex items-center gap-1"
                        title="Download official PDF report for this station"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export PDF</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. VERIFICATION STAMP & AUDITOR ATTESTATION */}
      <div className="glass-panel rounded-3xl p-6 border-l-4 border-emerald-500 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            ISO 14001:2015 & WHO 2021 Automated Calibration Attestation
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            All telemetry channels are cryptographically stamped with zero-knowledge sensor signatures. Exceedance thresholds are dynamically reconciled against national meteorological and air safety agencies.
          </p>
        </div>

        <div className="text-right shrink-0">
          <span className="text-[10px] font-mono text-slate-400 block">Lead Regulatory Auditor</span>
          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 block">
            Dr. Elena Rostova, Ph.D.
          </span>
          <span className="text-[9px] font-mono text-slate-500 block">Cert ID: SCG-ISO-9902</span>
        </div>
      </div>
    </div>
  );
};
