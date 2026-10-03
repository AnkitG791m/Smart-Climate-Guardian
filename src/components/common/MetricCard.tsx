import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon: LucideIcon;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'emerald' | 'amber' | 'rose' | 'blue' | 'purple';
  progress?: number; // 0 to 100
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  icon: Icon,
  subtext,
  trend,
  trendValue,
  variant = 'emerald',
  progress
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'amber':
        return {
          iconBg: 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400',
          borderHover: 'hover:border-amber-400/50',
          progressBar: 'bg-amber-500'
        };
      case 'rose':
        return {
          iconBg: 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400',
          borderHover: 'hover:border-rose-400/50',
          progressBar: 'bg-rose-500'
        };
      case 'blue':
        return {
          iconBg: 'bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400',
          borderHover: 'hover:border-sky-400/50',
          progressBar: 'bg-sky-500'
        };
      case 'purple':
        return {
          iconBg: 'bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400',
          borderHover: 'hover:border-purple-400/50',
          progressBar: 'bg-purple-500'
        };
      case 'emerald':
      default:
        return {
          iconBg: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400',
          borderHover: 'hover:border-emerald-500/50',
          progressBar: 'bg-emerald-500'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div className={`glass-panel rounded-2xl p-4 sm:p-5 transition-all duration-300 hover:shadow-eco-md ${styles.borderHover} relative overflow-hidden group`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono tracking-tight">
              {value}
            </span>
            {unit && (
              <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
                {unit}
              </span>
            )}
          </div>
        </div>
        <div className={`p-2.5 rounded-xl ${styles.iconBg} transition-transform duration-300 group-hover:scale-110 shadow-sm`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {typeof progress === 'number' && (
        <div className="mt-3 w-full bg-slate-200 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${styles.progressBar}`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      {(subtext || trendValue) && (
        <div className="mt-3 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <span>{subtext}</span>
          {trendValue && (
            <span className={`font-semibold ${trend === 'up' ? 'text-rose-500' : trend === 'down' ? 'text-emerald-500' : 'text-slate-400'}`}>
              {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'} {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
