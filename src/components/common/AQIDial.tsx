import React from 'react';
import { useTranslation } from 'react-i18next';
import { CPCBCategory, getCPCBColorDetails } from '../../utils/cpcbAqi';

interface AQIDialProps {
  aqi: number;
  category: CPCBCategory;
  dominantPollutant: string;
}

export const AQIDial: React.FC<AQIDialProps> = ({
  aqi,
  category,
  dominantPollutant,
}) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const colorDetails = getCPCBColorDetails(category);

  // CPCB 0-500 clamp
  const clampedAqi = Math.min(500, Math.max(0, aqi));
  // 180 degree semi-circle gauge
  const percentage = clampedAqi / 500;
  const radius = 80;
  const strokeWidth = 14;
  const circumference = Math.PI * radius; // 180 degrees
  const strokeDashoffset = circumference * (1 - percentage);

  // Needle angle: -90 deg (left, 0 AQI) to +90 deg (right, 500 AQI)
  const needleAngle = -90 + percentage * 180;

  return (
    <div className="flex flex-col items-center justify-center p-2">
      <div className="relative w-64 h-36 flex items-end justify-center overflow-hidden">
        <svg className="w-64 h-64 overflow-visible" viewBox="0 0 200 200">
          <defs>
            {/* CPCB 6-color segmented gradient */}
            <linearGradient id="cpcbGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="10%" stopColor="#00b050" />  {/* Good */}
              <stop offset="20%" stopColor="#84cc16" />  {/* Satisfactory */}
              <stop offset="40%" stopColor="#eab308" />  {/* Moderate */}
              <stop offset="60%" stopColor="#f97316" />  {/* Poor */}
              <stop offset="80%" stopColor="#ef4444" />  {/* Very Poor */}
              <stop offset="100%" stopColor="#7f1d1d" /> {/* Severe */}
            </linearGradient>
          </defs>

          {/* Background Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            className="text-slate-100 dark:text-slate-800"
          />

          {/* CPCB Colored Scale Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="url(#cpcbGradient)"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${colorDetails.color}55)`,
            }}
          />

          {/* Center Indicator Pivot */}
          <circle
            cx="100"
            cy="100"
            r="7"
            fill={colorDetails.color}
            className="transition-colors duration-500"
          />

          {/* Needle Indicator */}
          <g transform={`rotate(${needleAngle}, 100, 100)`} className="transition-transform duration-1000 ease-out">
            <line
              x1="100"
              y1="100"
              x2="100"
              y2="28"
              stroke={colorDetails.color}
              strokeWidth="3.5"
              strokeLinecap="round"
            />
          </g>

          {/* Tick Labels */}
          <text x="18" y="118" className="text-[9px] fill-slate-400 font-mono font-bold" textAnchor="middle">0</text>
          <text x="60" y="50" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">100</text>
          <text x="100" y="32" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">250</text>
          <text x="140" y="50" className="text-[8px] fill-slate-400 font-mono" textAnchor="middle">400</text>
          <text x="182" y="118" className="text-[9px] fill-slate-400 font-mono font-bold" textAnchor="middle">500</text>
        </svg>

        {/* Center Readout Text */}
        <div className="absolute bottom-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-1 font-mono">
            <span
              className="text-4xl sm:text-5xl font-black tracking-tight"
              style={{ color: colorDetails.color }}
            >
              {aqi}
            </span>
            <span className="text-xs font-semibold text-slate-400">AQI</span>
          </div>
        </div>
      </div>

      {/* Category Pill and Dominant Pollutant */}
      <div className="mt-3 flex flex-col items-center gap-1.5">
        <span
          className="text-xs font-bold px-3 py-1 rounded-full border shadow-sm"
          style={{
            backgroundColor: colorDetails.bgLight,
            color: colorDetails.textColor,
            borderColor: `${colorDetails.color}66`,
          }}
        >
          {isHindi ? colorDetails.labelHi : category} (CPCB NAQI)
        </span>

        {dominantPollutant && dominantPollutant !== 'None' && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
            {t('dashboard.dominantPollutant')}: <b className="text-slate-800 dark:text-slate-200">{dominantPollutant}</b>
          </span>
        )}
      </div>
    </div>
  );
};
