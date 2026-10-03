import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, FastForward, Clock, Radio, CloudRain, Flame, Wind } from 'lucide-react';
import { soundService } from '../../services/soundService';

interface RadarTimelineScrubberProps {
  onTimeChange?: (timeOffsetHours: number) => void;
  activeMode: 'aqi' | 'heat' | 'flood';
  onChangeMode: (mode: 'aqi' | 'heat' | 'flood') => void;
}

const TIMELINE_STEPS = [
  { offset: -12, label: '-12h' },
  { offset: -6, label: '-6h' },
  { offset: -3, label: '-3h' },
  { offset: -1, label: '-1h' },
  { offset: 0, label: 'Live' },
  { offset: 3, label: '+3h' },
  { offset: 6, label: '+6h' },
  { offset: 12, label: '+12h' },
  { offset: 24, label: '+24h' },
];

export const RadarTimelineScrubber: React.FC<RadarTimelineScrubberProps> = ({
  onTimeChange,
  activeMode,
  onChangeMode,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(4); // default 4 = 'Live'
  const [playSpeed, setPlaySpeed] = useState<1 | 2>(1);

  // Auto-play timer
  useEffect(() => {
    if (!isPlaying) return;

    const intervalMs = playSpeed === 1 ? 1400 : 700;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = prev >= TIMELINE_STEPS.length - 1 ? 0 : prev + 1;
        if (onTimeChange) onTimeChange(TIMELINE_STEPS[next].offset);
        return next;
      });
    }, intervalMs);

    return () => clearInterval(interval);
  }, [isPlaying, playSpeed, onTimeChange]);

  const handleStepClick = (index: number) => {
    setCurrentIndex(index);
    if (onTimeChange) onTimeChange(TIMELINE_STEPS[index].offset);
    soundService.playAlertChime('info');
  };

  const currentStep = TIMELINE_STEPS[currentIndex];

  // Compute timestamp label
  const getFormattedTime = () => {
    const d = new Date();
    d.setHours(d.getHours() + currentStep.offset);
    const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    if (currentStep.offset === 0) return `${timeStr} (Live Telemetry)`;
    if (currentStep.offset < 0) return `${timeStr} (${Math.abs(currentStep.offset)}h Recorded Archive)`;
    return `${timeStr} (+${currentStep.offset}h Predictive Forecast)`;
  };

  return (
    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-30 max-w-lg w-[calc(100vw-2.5rem)] sm:w-auto">
      <div className="glass-panel rounded-2xl shadow-2xl p-2.5 sm:px-4 sm:py-3 border border-slate-200/90 dark:border-emerald-800/60 flex flex-col gap-2">
        {/* Top Info Header */}
        <div className="flex items-center justify-between text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
            <Radio className={`w-3.5 h-3.5 ${currentStep.offset === 0 ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
            <span className="font-bold font-sans">{getFormattedTime()}</span>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/30 p-0.5 rounded-lg text-[10px] font-sans font-bold">
            <button
              onClick={() => onChangeMode('aqi')}
              className={`px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                activeMode === 'aqi' ? 'bg-emerald-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-emerald-500'
              }`}
            >
              <Wind className="w-3 h-3" />
              <span>AQI</span>
            </button>
            <button
              onClick={() => onChangeMode('heat')}
              className={`px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                activeMode === 'heat' ? 'bg-amber-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              <Flame className="w-3 h-3" />
              <span>Heat</span>
            </button>
            <button
              onClick={() => onChangeMode('flood')}
              className={`px-2 py-0.5 rounded-md transition-colors flex items-center gap-1 ${
                activeMode === 'flood' ? 'bg-sky-600 text-white' : 'text-slate-500 dark:text-slate-400 hover:text-sky-500'
              }`}
            >
              <CloudRain className="w-3 h-3" />
              <span>Flood</span>
            </button>
          </div>
        </div>

        {/* Timeline Scrubber Controls */}
        <div className="flex items-center gap-2">
          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-eco-sm transition-all transform active:scale-95 shrink-0"
            title={isPlaying ? 'Pause Radar' : 'Play Radar Simulation'}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>

          {/* Reset Live Button */}
          <button
            onClick={() => handleStepClick(4)}
            className="p-1.5 rounded-xl bg-slate-100 dark:bg-black/30 hover:bg-slate-200 dark:hover:bg-emerald-950/60 text-slate-600 dark:text-slate-300 transition-colors shrink-0"
            title="Reset to Live Current Time"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Stepper Buttons */}
          <div className="flex-1 flex items-center justify-between gap-1 overflow-x-auto scrollbar-none py-0.5">
            {TIMELINE_STEPS.map((step, idx) => {
              const isActive = currentIndex === idx;
              const isLive = step.offset === 0;

              return (
                <button
                  key={step.label}
                  onClick={() => handleStepClick(idx)}
                  className={`px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-all relative ${
                    isActive
                      ? isLive
                        ? 'bg-emerald-500 text-white shadow-eco-glow'
                        : 'bg-slate-800 text-white dark:bg-emerald-700'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-black/30'
                  }`}
                >
                  {step.label}
                  {isLive && !isActive && (
                    <span className="absolute -top-1 right-0 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Speed Toggle */}
          <button
            onClick={() => setPlaySpeed(playSpeed === 1 ? 2 : 1)}
            className="px-2 py-1 rounded-xl bg-slate-100 dark:bg-black/30 text-slate-700 dark:text-slate-200 hover:text-emerald-500 text-[10px] font-mono font-bold shrink-0 transition-colors"
            title="Toggle playback speed"
          >
            {playSpeed}x
          </button>
        </div>
      </div>
    </div>
  );
};
