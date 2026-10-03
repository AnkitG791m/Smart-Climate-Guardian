import React from 'react';
import { AQICategory } from '../../types';

interface StatusBadgeProps {
  category: AQICategory | string;
  size?: 'sm' | 'md' | 'lg';
  showPulse?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  category, 
  size = 'md',
  showPulse = true 
}) => {
  const getColors = () => {
    switch (category) {
      case 'Good':
      case 'Low':
      case 'Normal':
      case 'Resolved':
        return {
          bg: 'bg-emerald-50 dark:bg-emerald-950/40',
          text: 'text-emerald-700 dark:text-emerald-300',
          border: 'border-emerald-200 dark:border-emerald-800/60',
          dot: 'bg-emerald-500'
        };
      case 'Moderate':
      case 'Caution':
      case 'Investigating':
        return {
          bg: 'bg-amber-50 dark:bg-amber-950/40',
          text: 'text-amber-700 dark:text-amber-300',
          border: 'border-amber-200 dark:border-amber-800/60',
          dot: 'bg-amber-500'
        };
      case 'Unhealthy for Sensitive Groups':
      case 'Elevated':
      case 'Extreme Caution':
        return {
          bg: 'bg-orange-50 dark:bg-orange-950/40',
          text: 'text-orange-700 dark:text-orange-300',
          border: 'border-orange-200 dark:border-orange-800/60',
          dot: 'bg-orange-500'
        };
      case 'Unhealthy':
      case 'High':
      case 'Danger':
      case 'Verified by Authority':
        return {
          bg: 'bg-rose-50 dark:bg-rose-950/40',
          text: 'text-rose-700 dark:text-rose-300',
          border: 'border-rose-200 dark:border-rose-800/60',
          dot: 'bg-rose-500'
        };
      case 'Very Unhealthy':
      case 'Severe':
      case 'Response Dispatched':
        return {
          bg: 'bg-purple-50 dark:bg-purple-950/40',
          text: 'text-purple-700 dark:text-purple-300',
          border: 'border-purple-200 dark:border-purple-800/60',
          dot: 'bg-purple-500'
        };
      case 'Hazardous':
      case 'Critical':
      case 'Extreme Danger':
      case 'Flash Flood Warning':
        return {
          bg: 'bg-red-100 dark:bg-red-950/60',
          text: 'text-red-800 dark:text-red-200',
          border: 'border-red-300 dark:border-red-700',
          dot: 'bg-red-600'
        };
      default:
        return {
          bg: 'bg-slate-50 dark:bg-slate-800',
          text: 'text-slate-700 dark:text-slate-300',
          border: 'border-slate-200 dark:border-slate-700',
          dot: 'bg-slate-400'
        };
    }
  };

  const style = getColors();

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses[size]} transition-colors`}
    >
      <span className="relative flex h-2 w-2">
        {showPulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${style.dot}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${style.dot}`}></span>
      </span>
      <span>{category}</span>
    </span>
  );
};
