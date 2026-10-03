import React, { useState } from 'react';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  Sun, 
  Compass, 
  Gauge, 
  CloudRain, 
  Trees, 
  HeartPulse, 
  ShieldAlert, 
  AlertCircle, 
  Check, 
  TrendingUp, 
  Info,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useClimate } from '../../context/ClimateContext';
import { HazardGauge } from '../common/HazardGauge';
import { MetricCard } from '../common/MetricCard';
import { StatusBadge } from '../common/StatusBadge';

export const DashboardView: React.FC = () => {
  const { currentStation, stations, selectStation, setActiveTab, setIsReportModalOpen } = useClimate();
  const [activePollutantTab, setActivePollutantTab] = useState<'aqi' | 'pm25' | 'temp'>('aqi');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);

  const { airQuality, weather, history24h, forecast7d } = currentStation;

  // Compute SVG polyline points for 24h trend chart
  const chartHeight = 140;
  const chartWidth = 500;
  const paddingX = 30;
  const paddingY = 20;

  const dataValues = history24h.map(h => {
    if (activePollutantTab === 'aqi') return h.aqi;
    if (activePollutantTab === 'pm25') return h.pm25;
    return h.temp;
  });

  const minVal = Math.min(...dataValues) * 0.85;
  const maxVal = Math.max(...dataValues) * 1.15;
  const range = maxVal - minVal || 1;

  const points = dataValues.map((val, idx) => {
    const x = paddingX + (idx / (dataValues.length - 1)) * (chartWidth - 2 * paddingX);
    const y = chartHeight - paddingY - ((val - minVal) / range) * (chartHeight - 2 * paddingY);
    return { x, y, val, hour: history24h[idx].hour };
  });

  const polylineStr = points.map(p => `${p.x},${p.y}`).join(' ');
  const areaStr = `${points[0].x},${chartHeight - paddingY} ` + polylineStr + ` ${points[points.length - 1].x},${chartHeight - paddingY}`;

  return (
    <div className="space-y-8">
      {/* 1. STATION TELEMETRY TOP BAR */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-500/20">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Active Monitored Node
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            {currentStation.name}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            {currentStation.region}, {currentStation.country} • Coordinates: {currentStation.lat.toFixed(4)}°N, {currentStation.lng.toFixed(4)}°W • Population Protected: {currentStation.populationCovered.toLocaleString()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge category={airQuality.category} size="lg" />
          <button
            onClick={() => setActiveTab('map')}
            className="px-3.5 py-2 text-xs font-bold rounded-xl bg-white dark:bg-obsidian-850 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-emerald-900 hover:bg-slate-50 transition-colors flex items-center gap-1.5"
          >
            <span>View on GIS Map</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-emerald-500" />
          </button>
        </div>
      </div>

      {/* 2. MAIN AIR QUALITY & WEATHER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: AQI Dial & Dominant Pollutant */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Composite Air Quality Index (US-EPA)
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                Primary: {airQuality.dominantPollutant}
              </span>
            </div>

            <HazardGauge
              value={airQuality.aqi}
              label={airQuality.category}
              sublabel={airQuality.healthAdvisory}
              type="aqi"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-emerald-950/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Primary Sub-Pollutants
            </h4>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans block">PM2.5</span>
                <span className="text-base font-bold text-slate-800 dark:text-slate-200">{airQuality.pm25}</span>
                <span className="text-[9px] text-slate-400 block font-sans">µg/m³</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans block">PM10</span>
                <span className="text-base font-bold text-slate-800 dark:text-slate-200">{airQuality.pm10}</span>
                <span className="text-[9px] text-slate-400 block font-sans">µg/m³</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-obsidian-900 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans block">Ozone (O3)</span>
                <span className="text-base font-bold text-slate-800 dark:text-slate-200">{airQuality.o3}</span>
                <span className="text-[9px] text-slate-400 block font-sans">ppb</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Microclimate & Atmospheric Telemetry */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Ambient Temp"
            value={weather.temperature}
            unit="°C"
            icon={Thermometer}
            subtext={`Feels like ${weather.feelsLike}°C`}
            variant="emerald"
          />

          <MetricCard
            label="Relative Humidity"
            value={weather.humidity}
            unit="%"
            icon={Droplets}
            progress={weather.humidity}
            subtext={weather.humidity > 70 ? 'High moisture' : 'Moderate'}
            variant="blue"
          />

          <MetricCard
            label="Wind Speed"
            value={weather.windSpeed}
            unit="km/h"
            icon={Wind}
            subtext={`Direction ${weather.windDirection}`}
            variant="purple"
          />

          <MetricCard
            label="UV Radiation"
            value={weather.uvIndex}
            unit="/ 12"
            icon={Sun}
            subtext={weather.uvIndex > 8 ? 'Very High UV Risk' : 'Moderate'}
            variant="amber"
          />

          <MetricCard
            label="Barometric Pressure"
            value={weather.pressure}
            unit="hPa"
            icon={Gauge}
            subtext="Stable boundary"
            variant="emerald"
          />

          <MetricCard
            label="Precipitation"
            value={weather.rainfallRate}
            unit="mm/h"
            icon={CloudRain}
            subtext={weather.rainfallRate > 10 ? 'Heavy Inundation' : 'No Rain'}
            variant="rose"
          />
        </div>
      </div>

      {/* 3. 24-HOUR TREND GRAPH */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-emerald-950">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              24-Hour Telemetry Dynamics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sensor readings sampled across the last 24-hour cycle.
            </p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-obsidian-900 p-1 rounded-xl">
            <button
              onClick={() => setActivePollutantTab('aqi')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                activePollutantTab === 'aqi'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
              }`}
            >
              AQI Trend
            </button>
            <button
              onClick={() => setActivePollutantTab('pm25')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                activePollutantTab === 'pm25'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
              }`}
            >
              PM2.5 (µg/m³)
            </button>
            <button
              onClick={() => setActivePollutantTab('temp')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                activePollutantTab === 'temp'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
              }`}
            >
              Temperature (°C)
            </button>
          </div>
        </div>

        {/* SVG Interactive Chart */}
        <div className="mt-4 w-full overflow-x-auto">
          <div className="min-w-[450px] relative">
            <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-44 overflow-visible">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              <line x1={paddingX} y1={paddingY} x2={chartWidth - paddingX} y2={paddingY} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1={paddingX} y1={chartHeight / 2} x2={chartWidth - paddingX} y2={chartHeight / 2} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeDasharray="3 3" />
              <line x1={paddingX} y1={chartHeight - paddingY} x2={chartWidth - paddingX} y2={chartHeight - paddingY} stroke="currentColor" className="text-slate-200 dark:text-slate-800" />

              {/* Filled Area */}
              <polygon points={areaStr} fill="url(#chartGradient)" />

              {/* Trend Polyline */}
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={polylineStr}
              />

              {/* Interactive Data points */}
              {points.map((pt, idx) => (
                <g key={idx} onMouseEnter={() => setHoveredPointIndex(idx)} onMouseLeave={() => setHoveredPointIndex(null)}>
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={hoveredPointIndex === idx ? 6 : 4}
                    className="fill-white dark:fill-obsidian-950 stroke-emerald-500 transition-all duration-200 cursor-pointer"
                    strokeWidth="2.5"
                  />
                  {/* Hour labels */}
                  <text
                    x={pt.x}
                    y={chartHeight - 4}
                    textAnchor="middle"
                    className="text-[10px] fill-slate-400 font-mono"
                  >
                    {pt.hour}
                  </text>
                </g>
              ))}
            </svg>

            {/* Hover Tooltip */}
            {hoveredPointIndex !== null && (
              <div 
                className="absolute top-2 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg shadow-lg pointer-events-none transform -translate-x-1/2 font-mono"
                style={{ left: `${(points[hoveredPointIndex].x / chartWidth) * 100}%` }}
              >
                <div className="font-bold text-emerald-400">
                  {points[hoveredPointIndex].val} {activePollutantTab === 'temp' ? '°C' : activePollutantTab === 'pm25' ? 'µg/m³' : 'AQI'}
                </div>
                <div className="text-[10px] text-slate-300">Time: {points[hoveredPointIndex].hour}</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. 7-DAY RESILIENCE FORECAST */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-emerald-950">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-500" />
              7-Day Environmental Outlook
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Predictive forecast integrating atmospheric dispersion and synoptic weather.
            </p>
          </div>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
            AI Model Ensemble
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 mt-4">
          {forecast7d.map((fc, idx) => (
            <div
              key={idx}
              className="bg-slate-50 dark:bg-obsidian-900/80 rounded-2xl p-3 border border-slate-100 dark:border-slate-800 text-center flex flex-col justify-between hover:border-emerald-500/40 transition-colors"
            >
              <div>
                <p className="text-xs font-bold text-slate-900 dark:text-white">{fc.day}</p>
                <p className="text-[10px] text-slate-400 font-mono">{fc.date}</p>
                
                <div className="my-2 flex flex-col items-center">
                  <span className="text-xl font-extrabold font-mono text-slate-800 dark:text-slate-200">
                    {fc.aqi}
                  </span>
                  <span className="text-[9px] font-bold text-slate-400">AQI</span>
                </div>
              </div>

              <div>
                <StatusBadge category={fc.category} size="sm" showPulse={false} />
                <div className="mt-2 text-xs font-mono text-slate-600 dark:text-slate-300">
                  <span className="font-bold text-slate-900 dark:text-white">{fc.tempMax}°</span> / {fc.tempMin}°
                </div>
                <div className="text-[10px] text-sky-500 font-medium mt-0.5">
                  🌧 {fc.rainProb}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. ENVIRONMENTAL HEALTH & ACTION RECOMMENDATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel rounded-3xl p-5 border-l-4 border-emerald-500">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 mb-2">
            <HeartPulse className="w-5 h-5" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Vulnerable Populations</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {airQuality.aqi > 150 
              ? 'Children, the elderly, and individuals with asthma or COPD should remain strictly indoors in filtered environments.' 
              : 'Conditions are safe for normal daily outdoor activities for all demographics.'}
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border-l-4 border-amber-500">
          <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-2">
            <ShieldAlert className="w-5 h-5" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Outdoor Athletics & Work</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {airQuality.aqi > 100 || weather.temperature > 35
              ? 'Curtail strenuous cardiovascular workouts outdoors. Reschedule endurance training to indoor gyms or early dawn.'
              : 'Outdoor exercise is approved. Keep hydration levels optimal throughout peak UV hours.'}
          </p>
        </div>

        <div className="glass-panel rounded-3xl p-5 border-l-4 border-sky-500">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400 mb-2">
            <Trees className="w-5 h-5" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Ventilation & Filtration</h4>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {airQuality.aqi > 150
              ? 'Keep building envelope sealed. Operate HEPA air purifiers at medium-high. Do not use outdoor air economizers.'
              : 'Natural window ventilation is recommended during midday hours to refresh indoor oxygen levels.'}
          </p>
        </div>
      </div>
    </div>
  );
};
