import React from 'react';
import { useTranslation } from 'react-i18next';
import { ShieldCheck, AlertCircle, Lock, Leaf } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-16 pb-20 md:pb-10 border-t border-slate-200/80 dark:border-emerald-950/80 bg-white/60 dark:bg-[#0c1412]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Brand & Standards */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white flex items-center justify-center">
                <Leaf className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-sm text-slate-900 dark:text-white">
                Smart Climate Guardian
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Open environmental intelligence engine calibrating Open-Meteo atmospheric telemetry against Indian CPCB National Air Quality Index standards.
            </p>
          </div>

          {/* Institutional Statutory Disclaimer */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 dark:text-amber-400">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>{t('disclaimer.title')}</span>
            </div>
            <p className="text-[11px] text-amber-900/80 dark:text-amber-300/80 leading-relaxed">
              {t('disclaimer.text')}
            </p>
          </div>

          {/* Privacy Note */}
          <div className="space-y-1.5 p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-900/40">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-400">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Location Privacy</span>
            </div>
            <p className="text-[11px] text-emerald-900/80 dark:text-emerald-300/80 leading-relaxed">
              {t('disclaimer.privacy')}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} Smart Climate Guardian. Phase 1 Release.</p>
          <div className="flex items-center gap-2">
            <span>CPCB NAQI Standard (India)</span>
            <span>•</span>
            <span>Open-Meteo API</span>
            <span>•</span>
            <span>Bhopal Hub</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
