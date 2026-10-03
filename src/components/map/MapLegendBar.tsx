import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface MapLegendBarProps {
  zoom: number;
  latitude: number;
}

const CPCB_BANDS = [
  { range: '0-50', label: 'Good', color: '#00b050' },
  { range: '51-100', label: 'Satisfactory', color: '#84cc16' },
  { range: '101-200', label: 'Moderate', color: '#eab308' },
  { range: '201-300', label: 'Poor', color: '#f97316' },
  { range: '301-400', label: 'Very Poor', color: '#ef4444' },
  { range: '401-500', label: 'Severe', color: '#7f1d1d' },
];

export const MapLegendBar: React.FC<MapLegendBarProps> = ({ zoom, latitude }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Calculate dynamic scale in meters/pixels
  const metersPerPixel = (156543.03392 * Math.cos((latitude * Math.PI) / 180)) / Math.pow(2, zoom);
  
  // Pick clean human scale target: 50m, 100m, 200m, 500m, 1km, 2km, 5km, 10km, 20km, 50km
  const targetPixels = 70;
  const rawMeters = targetPixels * metersPerPixel;

  const getCleanScale = (meters: number) => {
    if (meters < 75) return { meters: 50, label: '50 m' };
    if (meters < 150) return { meters: 100, label: '100 m' };
    if (meters < 350) return { meters: 200, label: '200 m' };
    if (meters < 750) return { meters: 500, label: '500 m' };
    if (meters < 1500) return { meters: 1000, label: '1 km' };
    if (meters < 3500) return { meters: 2000, label: '2 km' };
    if (meters < 7500) return { meters: 5000, label: '5 km' };
    if (meters < 15000) return { meters: 10000, label: '10 km' };
    if (meters < 35000) return { meters: 20000, label: '20 km' };
    return { meters: 50000, label: '50 km' };
  };

  const scale = getCleanScale(rawMeters);
  const barWidthPx = Math.max(30, Math.min(120, Math.round(scale.meters / metersPerPixel)));

  const toggleExpand = () => {
    soundService.playClick();
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex flex-col items-end gap-1.5 select-none">
      {/* Expanded CPCB AQI Guide Popover */}
      {isExpanded && (
        <div className="glass-panel p-3 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-emerald-800/80 w-64 space-y-2 text-xs animate-fadeIn mb-1">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200/60 dark:border-emerald-950/60">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              CPCB NAQI Index Scale
            </span>
            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-mono font-bold">
              National Standard
            </span>
          </div>

          <div className="space-y-1.5">
            {CPCB_BANDS.map((b) => (
              <div key={b.range} className="flex items-center justify-between text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: b.color }} />
                  <span className="font-bold text-slate-800 dark:text-slate-200">{b.label}</span>
                </div>
                <div className="text-right font-mono text-[10px] text-slate-500 dark:text-slate-400">
                  <span>{b.range}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1.5 border-t border-slate-200/60 dark:border-emerald-950/60 text-[9px] text-slate-400 leading-tight">
            Prescribed by Central Pollution Control Board (MoEFCC).
          </div>
        </div>
      )}

      {/* Dynamic Scale Rule + Legend Toggle Pill */}
      <div className="glass-panel px-3 py-1.5 rounded-xl shadow-lg border border-slate-200/80 dark:border-emerald-950/90 flex items-center gap-3 text-[10px] font-mono text-slate-600 dark:text-slate-300">
        {/* Dynamic Leaflet-style Scale Bar */}
        <div className="flex flex-col items-center">
          <span className="text-[9px] leading-tight font-bold">{scale.label}</span>
          <div
            className="h-1 border-b-2 border-l-2 border-r-2 border-slate-800 dark:border-slate-200"
            style={{ width: `${barWidthPx}px` }}
          />
        </div>

        <span className="text-slate-300 dark:text-slate-700">|</span>

        {/* Mini 6-band gradient bar */}
        <button
          onClick={toggleExpand}
          className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors"
          title="Click to toggle official CPCB NAQI Legend"
        >
          <div className="flex h-2 w-16 rounded overflow-hidden shadow-xs">
            {CPCB_BANDS.map((b) => (
              <span key={b.range} className="flex-1 h-full" style={{ backgroundColor: b.color }} />
            ))}
          </div>
          <span className="text-[10px] font-sans font-bold hidden sm:inline">CPCB</span>
          {isExpanded ? <ChevronDown className="w-3 h-3 text-slate-400" /> : <ChevronUp className="w-3 h-3 text-slate-400" />}
        </button>
      </div>
    </div>
  );
};
