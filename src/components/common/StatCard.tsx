import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card } from './Card';

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  subtext?: string;
  source?: string;
  lastUpdated?: string;
  isStale?: boolean;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  subtext,
  source = 'Open-Meteo',
  lastUpdated,
  isStale = false,
  accentColor = '#10b981',
}) => {
  return (
    <Card variant="solid" className="p-4 sm:p-5 flex flex-col justify-between group hover:border-emerald-500/40">
      <div>
        <div className="flex items-start justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            {label}
          </span>
          <div
            className="p-2 rounded-xl transition-transform duration-200 group-hover:scale-105"
            style={{ backgroundColor: `${accentColor}18`, color: accentColor }}
          >
            <Icon className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-2 flex items-baseline gap-1">
          <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
            {value}
          </span>
          {unit && (
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {unit}
            </span>
          )}
        </div>

        {subtext && (
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            {subtext}
          </p>
        )}
      </div>

      <div className="mt-4 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
        <span className="truncate max-w-[120px]">{source}</span>
        {isStale ? (
          <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold">
            Stale Data
          </span>
        ) : lastUpdated ? (
          <span>{lastUpdated}</span>
        ) : null}
      </div>
    </Card>
  );
};
