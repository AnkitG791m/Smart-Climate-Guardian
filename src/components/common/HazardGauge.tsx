import React from 'react';

interface HazardGaugeProps {
  value: number;
  min?: number;
  max?: number;
  label: string;
  sublabel?: string;
  unit?: string;
  type?: 'aqi' | 'heat' | 'flood';
}

export const HazardGauge: React.FC<HazardGaugeProps> = ({
  value,
  min = 0,
  max = 500,
  label,
  sublabel,
  unit = '',
  type = 'aqi'
}) => {
  // Clamp value
  const clampedValue = Math.min(Math.max(value, min), max);
  const percentage = (clampedValue - min) / (max - min);

  // Gauge angles (-135deg to +135deg = 270deg sweep)
  const radius = 70;
  const strokeWidth = 12;
  const circumference = 2 * Math.PI * radius;
  const arcLength = circumference * (270 / 360);
  const strokeDashoffset = arcLength - percentage * arcLength;

  // Determine color based on type and value
  const getColor = () => {
    if (type === 'aqi') {
      if (value <= 50) return '#10b981'; // Good (Emerald)
      if (value <= 100) return '#eab308'; // Moderate (Yellow)
      if (value <= 150) return '#f97316'; // Sensitive (Orange)
      if (value <= 200) return '#ef4444'; // Unhealthy (Red)
      if (value <= 300) return '#a855f7'; // Very Unhealthy (Purple)
      return '#881337'; // Hazardous (Maroon)
    }
    if (type === 'heat') {
      if (value < 27) return '#10b981';
      if (value < 32) return '#eab308';
      if (value < 38) return '#f97316';
      return '#ef4444';
    }
    // Flood
    if (value < 40) return '#10b981';
    if (value < 70) return '#eab308';
    if (value < 85) return '#f97316';
    return '#ef4444';
  };

  const currentColor = getColor();

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-44 h-44 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-[225deg]" viewBox="0 0 180 180">
          {/* Background Track */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            className="text-slate-200 dark:text-slate-800"
            strokeLinecap="round"
          />
          {/* Active Progress Arc */}
          <circle
            cx="90"
            cy="90"
            r={radius}
            fill="transparent"
            stroke={currentColor}
            strokeWidth={strokeWidth}
            strokeDasharray={`${arcLength} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${currentColor}66)`
            }}
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
          <span className="text-3xl font-extrabold tracking-tight text-slate-800 dark:text-slate-50 font-mono">
            {value}
            {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
          </span>
          <span 
            className="text-xs font-semibold px-2 py-0.5 rounded-full mt-1"
            style={{ backgroundColor: `${currentColor}22`, color: currentColor }}
          >
            {label}
          </span>
        </div>
      </div>

      {sublabel && (
        <span className="text-xs text-center text-slate-500 dark:text-slate-400 mt-1 max-w-[200px]">
          {sublabel}
        </span>
      )}
    </div>
  );
};
