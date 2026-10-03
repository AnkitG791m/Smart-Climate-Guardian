import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Bell, 
  Volume2, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  ShieldAlert, 
  Filter, 
  Radio, 
  Send,
  Check
} from 'lucide-react';
import { useClimate } from '../../context/ClimateContext';
import { soundService } from '../../services/soundService';
import { StatusBadge } from '../common/StatusBadge';

export const AlertCenterView: React.FC = () => {
  const { alerts, acknowledgeAlert, dismissAlert, setIsScenarioModalOpen } = useClimate();
  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'advisory'>('all');
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [subscribedSuccess, setSubscribedSuccess] = useState(false);

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'all') return true;
    return a.severity === severityFilter;
  });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneOrEmail) return;
    setSubscribedSuccess(true);
    soundService.playAlertChime('info');
    setTimeout(() => {
      setSubscribedSuccess(false);
      setPhoneOrEmail('');
    }, 4000);
  };

  const testAudioAlert = (severity: 'critical' | 'warning' | 'info') => {
    soundService.playAlertChime(severity);
  };

  return (
    <div className="space-y-8">
      {/* 1. HEADER & BROADCAST DISPATCH BAR */}
      <div className="glass-panel rounded-3xl p-6 border border-rose-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                National Civil Defense Integration
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Emergency Climate Alert Center
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Real-time multi-channel hazard dispatches, evacuation directives, and acoustic broadcast triggers.
            </p>
          </div>

          {/* Quick Sound Test buttons */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">Chime Test:</span>
            <button
              onClick={() => testAudioAlert('critical')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 text-xs font-bold hover:bg-rose-500/20 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Siren (Critical)</span>
            </button>
            <button
              onClick={() => testAudioAlert('warning')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-bold hover:bg-amber-500/20 transition-colors"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Chime (Warning)</span>
            </button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-emerald-950 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Filter By Severity:</span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-obsidian-900 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setSeverityFilter('all')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  severityFilter === 'all' ? 'bg-emerald-500 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                All ({alerts.length})
              </button>
              <button
                onClick={() => setSeverityFilter('critical')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  severityFilter === 'critical' ? 'bg-rose-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Critical ({alerts.filter(a => a.severity === 'critical').length})
              </button>
              <button
                onClick={() => setSeverityFilter('warning')}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  severityFilter === 'warning' ? 'bg-amber-600 text-white' : 'text-slate-600 dark:text-slate-400'
                }`}
              >
                Warning ({alerts.filter(a => a.severity === 'warning').length})
              </button>
            </div>
          </div>

          <button
            onClick={() => setIsScenarioModalOpen(true)}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <span>+ Simulate New Hazard Broadcast</span>
          </button>
        </div>
      </div>

      {/* 2. ALERTS FEED */}
      <div className="space-y-4">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`glass-panel rounded-3xl p-6 border-l-8 transition-all duration-300 ${
              alert.severity === 'critical'
                ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/15'
                : 'border-amber-500 bg-amber-50/20 dark:bg-amber-950/15'
            }`}
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className={`p-3 rounded-2xl shrink-0 ${
                  alert.severity === 'critical'
                    ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-600'
                    : 'bg-amber-100 dark:bg-amber-900/50 text-amber-600'
                }`}>
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                      ID: {alert.id}
                    </span>
                    <StatusBadge category={alert.severity.toUpperCase()} size="sm" />
                    <span className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      Issued {alert.issuedAt} • Expires in {alert.expiresIn}
                    </span>
                  </div>

                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                    {alert.title}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    {alert.description}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {!alert.acknowledged ? (
                  <button
                    onClick={() => acknowledgeAlert(alert.id)}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Acknowledge</span>
                  </button>
                ) : (
                  <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold border border-emerald-500/20 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Acknowledged
                  </span>
                )}

                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="px-3 py-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>

            {/* Emergency Action Protocols Checklist */}
            <div className="mt-5 pt-4 border-t border-slate-200 dark:border-slate-800/80">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-500" />
                Mandatory Emergency Protocols & Directives:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                {alert.actionProtocol.map((protocol, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2 p-2 rounded-xl bg-white/60 dark:bg-obsidian-900/60 border border-slate-100 dark:border-slate-800">
                    <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-[10px] font-bold mt-0.5 shrink-0">
                      ✓
                    </span>
                    <span className="text-slate-700 dark:text-slate-300 leading-normal">{protocol}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredAlerts.length === 0 && (
          <div className="glass-panel rounded-3xl p-12 text-center text-slate-400">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-base font-bold text-slate-700 dark:text-slate-200">No active alerts for this filter.</p>
            <p className="text-xs mt-0.5">Atmospheric and flood indicators remain inside standard baseline parameters.</p>
          </div>
        )}
      </div>

      {/* 3. BROADCAST SUBSCRIPTION FORM */}
      <div className="glass-panel rounded-3xl p-6 sm:p-8 border border-emerald-500/20 relative overflow-hidden">
        <div className="max-w-xl">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
            <Radio className="w-5 h-5 animate-pulse" />
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Subscribe to Local Disaster Warning Dispatch
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
            Receive automated SMS / Web Push siren broadcasts whenever severe inversion smog (AQI &gt; 250) or flash flood stages are breached in your area.
          </p>

          {subscribedSuccess ? (
            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-2">
              <Check className="w-4 h-4" />
              <span>Subscription confirmed! You will receive high-priority municipal emergency alerts.</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Enter mobile number or email..."
                value={phoneOrEmail}
                onChange={(e) => setPhoneOrEmail(e.target.value)}
                className="flex-1 bg-white dark:bg-obsidian-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              />
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-eco-sm transition-all shrink-0 flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Register</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
