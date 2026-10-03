import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Wind, 
  Thermometer, 
  Droplets, 
  MapPin, 
  ArrowRight, 
  AlertTriangle, 
  Activity, 
  Users, 
  FileText, 
  CheckCircle2, 
  Search,
  Sparkles,
  Zap,
  Flame
} from 'lucide-react';
import { useClimate } from '../../context/ClimateContext';
import { StatusBadge } from '../common/StatusBadge';
import { HazardGauge } from '../common/HazardGauge';

export const LandingView: React.FC = () => {
  const { 
    currentStation, 
    stations, 
    selectStation, 
    setActiveTab, 
    setIsReportModalOpen, 
    setIsScenarioModalOpen,
    citizenReports,
    alerts 
  } = useClimate();

  const [searchQuery, setSearchQuery] = useState('');

  const filteredStations = stations.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* 1. HERO SECTION */}
      <section className="relative rounded-3xl overflow-hidden glass-panel-elevated p-6 sm:p-10 lg:p-14 border border-emerald-500/20 shadow-eco-lg">
        {/* Ambient background glowing circles */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 w-96 h-96 bg-gradient-to-br from-emerald-500/20 to-lime-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-forest-900/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headlines & Action */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-950/60 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
              <span>Next-Gen Climate Defense & Environmental Intelligence</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Safeguarding <span className="bg-gradient-to-r from-emerald-600 via-forest-600 to-lime-500 bg-clip-text text-transparent">Communities</span> from Climate Hazards
            </h1>

            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              An institutional-grade environmental intelligence platform combining real-time particulate telemetry, multi-hazard risk models, interactive GIS hotspot tracking, and decentralized citizen reporting.
            </p>

            {/* Quick Station Finder Search */}
            <div className="relative max-w-md">
              <div className="flex items-center bg-white dark:bg-obsidian-850 rounded-2xl border border-slate-200 dark:border-emerald-900/50 p-1.5 shadow-sm">
                <Search className="w-5 h-5 text-slate-400 ml-2" />
                <input
                  type="text"
                  placeholder="Search city, region, or station..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-3 py-1.5 text-xs sm:text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                />
              </div>

              {searchQuery && (
                <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-obsidian-900 rounded-xl border border-slate-200 dark:border-emerald-800 shadow-xl z-20 max-h-48 overflow-y-auto p-1">
                  {filteredStations.length > 0 ? (
                    filteredStations.map(st => (
                      <button
                        key={st.id}
                        onClick={() => {
                          selectStation(st.id);
                          setSearchQuery('');
                          setActiveTab('dashboard');
                        }}
                        className="w-full text-left px-3 py-2 text-xs rounded-lg hover:bg-emerald-50 dark:hover:bg-obsidian-800 flex items-center justify-between transition-colors"
                      >
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{st.name}, {st.country}</span>
                        <StatusBadge category={st.airQuality.category} size="sm" />
                      </button>
                    ))
                  ) : (
                    <div className="p-3 text-xs text-slate-400 text-center">No matching station found</div>
                  )}
                </div>
              )}
            </div>

            {/* Primary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveTab('dashboard')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-forest-800 hover:from-emerald-500 hover:to-forest-700 text-white font-bold text-sm shadow-eco-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>Launch Live Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('map')}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-white dark:bg-obsidian-850 hover:bg-slate-50 dark:hover:bg-obsidian-800 text-slate-800 dark:text-slate-200 font-bold text-sm border border-slate-200 dark:border-emerald-900/60 shadow-sm transition-all"
              >
                <MapPin className="w-4 h-4 text-emerald-500" />
                <span>Explore GIS Risk Map</span>
              </button>

              <button
                onClick={() => setIsReportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 font-bold text-sm border border-emerald-500/20 transition-all"
              >
                <Users className="w-4 h-4" />
                <span>Submit Citizen Report</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Live Telemetry Preview Card */}
          <div className="lg:col-span-5">
            <div className="glass-panel-elevated rounded-3xl p-6 border border-emerald-500/25 shadow-eco-md relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-emerald-950">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Live Telemetry Spotlight
                  </span>
                </div>
                <StatusBadge category={currentStation.airQuality.category} size="sm" />
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                  {currentStation.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {currentStation.region}, {currentStation.country}
                </p>
              </div>

              {/* Central Gauge */}
              <HazardGauge 
                value={currentStation.airQuality.aqi}
                label={currentStation.airQuality.category}
                sublabel={`Dominant: ${currentStation.airQuality.dominantPollutant}`}
                type="aqi"
              />

              {/* Sub-metrics mini grid */}
              <div className="grid grid-cols-3 gap-2 mt-2 pt-4 border-t border-slate-100 dark:border-emerald-950/80">
                <div className="bg-slate-50 dark:bg-obsidian-900 p-2.5 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">PM2.5</p>
                  <p className="text-sm font-extrabold font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                    {currentStation.airQuality.pm25} <span className="text-[10px] font-normal">µg</span>
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-obsidian-900 p-2.5 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Temp</p>
                  <p className="text-sm font-extrabold font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                    {currentStation.weather.temperature}°C
                  </p>
                </div>
                <div className="bg-slate-50 dark:bg-obsidian-900 p-2.5 rounded-xl text-center">
                  <p className="text-[10px] uppercase font-bold text-slate-400">WBGT Heat</p>
                  <p className="text-sm font-extrabold font-mono text-slate-800 dark:text-slate-200 mt-0.5">
                    {currentStation.heatwaveRisk.wbgtIndex}°C
                  </p>
                </div>
              </div>

              {/* Advisory snippet */}
              <div className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
                <p className="font-semibold flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  Health Advisory
                </p>
                <p className="mt-1 text-[11px] leading-relaxed line-clamp-2">
                  {currentStation.airQuality.healthAdvisory}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS & RESILIENCE METRICS STRIP */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel rounded-2xl p-5 border-l-4 border-emerald-500">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Population Shielded</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-2">
            41.9M+
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Across 5 Mega-regions
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-l-4 border-lime-500">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Sensor Grids</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-2">
            1,480
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Sub-second telemetry sync
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-l-4 border-amber-500">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Monitored Hotspots</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-2">
            28 Active
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5" /> Thermal & particulate
          </p>
        </div>

        <div className="glass-panel rounded-2xl p-5 border-l-4 border-purple-500">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Verified Citizen Reports</p>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-mono mt-2">
            {citizenReports.length * 14 + 182}
          </p>
          <p className="text-xs text-purple-600 dark:text-purple-400 mt-1 flex items-center gap-1">
            <Users className="w-3.5 h-3.5" /> Community confirmed
          </p>
        </div>
      </section>

      {/* 3. FOUR CORE CAPABILITIES */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Integrated Environmental Defense Engine
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Four specialized pillars providing complete visibility from atmospheric micro-toxins to watershed flooding.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="glass-panel rounded-3xl p-6 cursor-pointer hover:shadow-eco-md hover:border-emerald-500/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wind className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 group-hover:text-emerald-500 transition-colors">
              Real-Time AQI & Weather
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Sub-pollutant breakdowns for PM2.5, PM10, NO2, O3, with hourly 24h trends and calibrated WHO health advisories.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              <span>View Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2 */}
          <div 
            onClick={() => setActiveTab('risks')}
            className="glass-panel rounded-3xl p-6 cursor-pointer hover:shadow-eco-md hover:border-amber-500/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Thermometer className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 group-hover:text-amber-500 transition-colors">
              Multi-Hazard Risk Engine
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Calculates Wet-Bulb Globe Temperature (WBGT), Urban Heat Island severity, and catchment flood runoff saturation.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400">
              <span>Analyze Hazards</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3 */}
          <div 
            onClick={() => setActiveTab('map')}
            className="glass-panel rounded-3xl p-6 cursor-pointer hover:shadow-eco-md hover:border-sky-500/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 group-hover:text-sky-500 transition-colors">
              GIS Interactive Map
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Leaflet-powered mapping with danger-zone buffer overlays, station telemetry popups, and citizen incident pins.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400">
              <span>Open GIS Map</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4 */}
          <div 
            onClick={() => setActiveTab('citizen')}
            className="glass-panel rounded-3xl p-6 cursor-pointer hover:shadow-eco-md hover:border-purple-500/50 transition-all duration-300 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-4 group-hover:text-purple-500 transition-colors">
              Citizen Reporting Hub
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              Empower citizens to report illegal burnings, chemical odors, or drainage blockages with photo verification & upvoting.
            </p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400">
              <span>View Community Feed</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* 4. EMERGENCY BROADCAST BANNER */}
      {alerts.length > 0 && (
        <section className="glass-panel rounded-3xl p-6 border-l-8 border-rose-500 bg-rose-50/30 dark:bg-rose-950/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-2xl bg-rose-100 dark:bg-rose-900/50 text-rose-600 shrink-0">
                <AlertTriangle className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    Active Emergency Directive
                  </span>
                  <StatusBadge category="Critical" size="sm" />
                </div>
                <h4 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white mt-1">
                  {alerts[0].title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 max-w-3xl">
                  {alerts[0].description}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActiveTab('alerts')}
              className="shrink-0 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-colors"
            >
              Inspect All Directives
            </button>
          </div>
        </section>
      )}
    </div>
  );
};
