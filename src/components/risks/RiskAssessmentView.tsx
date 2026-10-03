import React, { useState } from 'react';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  ShieldCheck, 
  ShieldAlert, 
  Flame, 
  Activity, 
  Layers, 
  Waves, 
  Sun, 
  Zap, 
  Compass, 
  CheckCircle2,
  Building,
  ArrowRight
} from 'lucide-react';
import { useClimate } from '../../context/ClimateContext';
import { StatusBadge } from '../common/StatusBadge';
import { HazardGauge } from '../common/HazardGauge';
import { MetricCard } from '../common/MetricCard';

export const RiskAssessmentView: React.FC = () => {
  const { currentStation, setIsScenarioModalOpen, setActiveTab } = useClimate();
  const [activeHazardTab, setActiveHazardTab] = useState<'air' | 'heat' | 'flood'>('air');

  const { airRisk, heatwaveRisk, floodRisk, airQuality, weather } = currentStation;

  return (
    <div className="space-y-8">
      {/* 1. SECTION HEADER WITH QUICK HAZARD TOGGLES */}
      <div className="glass-panel rounded-3xl p-6 border border-emerald-500/20">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                Multi-Hazard Assessment Suite
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Microclimate & Hazard Vulnerability Engines
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Active Node: <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStation.name}</span> • Multi-spectral risk modeling.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-100 dark:bg-obsidian-900 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveHazardTab('air')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeHazardTab === 'air'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-500'
              }`}
            >
              <Wind className="w-4 h-4" />
              <span>Air & Plume</span>
            </button>
            <button
              onClick={() => setActiveHazardTab('heat')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeHazardTab === 'heat'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-amber-500'
              }`}
            >
              <Thermometer className="w-4 h-4" />
              <span>Heatwave & WBGT</span>
            </button>
            <button
              onClick={() => setActiveHazardTab('flood')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeHazardTab === 'flood'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-sky-500'
              }`}
            >
              <Waves className="w-4 h-4" />
              <span>Flood Catchment</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. AIR QUALITY & PLUME MODEL */}
      {activeHazardTab === 'air' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Plume Gauge & Overview */}
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Smoke Dispersion Index
                  </span>
                  <StatusBadge category={airRisk.plumeRisk} size="sm" />
                </div>

                <HazardGauge
                  value={airRisk.smokeDispersionIndex}
                  min={0}
                  max={100}
                  unit="%"
                  label={`Plume ${airRisk.plumeRisk}`}
                  sublabel="Atmospheric boundary layer trapping capacity"
                  type="aqi"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-emerald-950/80 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Thermal Inversion Cap:</span>
                  <span className={`font-bold ${airRisk.inversionStagnation ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {airRisk.inversionStagnation ? 'Severe Inversion Trapping' : 'Vertical Mixing Active'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 dark:text-slate-400">Vulnerable Population Risk:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {airRisk.vulnerableRiskScore} / 100
                  </span>
                </div>
              </div>
            </div>

            {/* Sub-Pollutants vs WHO Guidelines Table */}
            <div className="lg:col-span-7 glass-panel rounded-3xl p-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-500" />
                Pollutant Toxicity vs Regulatory Thresholds
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-emerald-950 text-slate-400">
                      <th className="pb-2">Pollutant</th>
                      <th className="pb-2">Current Level</th>
                      <th className="pb-2">WHO 24h Standard</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    <tr>
                      <td className="py-2.5 font-bold font-sans">PM2.5 (Fine particulate)</td>
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-100">{airQuality.pm25} µg/m³</td>
                      <td className="py-2.5 text-slate-500">15.0 µg/m³</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${airQuality.pm25 > 15 ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'}`}>
                          {airQuality.pm25 > 15 ? 'Exceeded' : 'Compliant'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold font-sans">PM10 (Coarse particulate)</td>
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-100">{airQuality.pm10} µg/m³</td>
                      <td className="py-2.5 text-slate-500">45.0 µg/m³</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${airQuality.pm10 > 45 ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'}`}>
                          {airQuality.pm10 > 45 ? 'Exceeded' : 'Compliant'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold font-sans">Nitrogen Dioxide (NO2)</td>
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-100">{airQuality.no2} ppb</td>
                      <td className="py-2.5 text-slate-500">25.0 ppb</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${airQuality.no2 > 25 ? 'bg-amber-100 dark:bg-amber-950/60 text-amber-600' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'}`}>
                          {airQuality.no2 > 25 ? 'Moderate' : 'Compliant'}
                        </span>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2.5 font-bold font-sans">Ground-level Ozone (O3)</td>
                      <td className="py-2.5 font-bold text-slate-800 dark:text-slate-100">{airQuality.o3} ppb</td>
                      <td className="py-2.5 text-slate-500">50.0 ppb</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${airQuality.o3 > 50 ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600'}`}>
                          {airQuality.o3 > 50 ? 'Exceeded' : 'Compliant'}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Protocol CTA */}
              <div className="mt-5 p-3 rounded-2xl bg-slate-50 dark:bg-obsidian-900 border border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-400">
                  Simulate emergency wildfire inversion event:
                </span>
                <button
                  onClick={() => setIsScenarioModalOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold hover:bg-rose-500/20 transition-colors"
                >
                  Test Inversion Surge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. HEATWAVE & WBGT MODEL */}
      {activeHazardTab === 'heat' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Wet-Bulb Globe Temp (WBGT)
                  </span>
                  <StatusBadge category={heatwaveRisk.riskLevel} size="sm" />
                </div>

                <HazardGauge
                  value={heatwaveRisk.wbgtIndex}
                  min={15}
                  max={40}
                  unit="°C"
                  label={heatwaveRisk.riskLevel}
                  sublabel="Measures heat stress in direct sunlight"
                  type="heat"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-emerald-950/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Urban Heat Island (UHI) Delta:</span>
                  <span className="font-bold text-amber-500">+{heatwaveRisk.urbanHeatIslandDelta}°C above rural</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Power Grid Stress:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{heatwaveRisk.powerGridStress}</span>
                </div>
              </div>
            </div>

            {/* Heatwave Protocol and Shelters */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  label="Urban Heat Anomaly"
                  value={`+${heatwaveRisk.urbanHeatIslandDelta}`}
                  unit="°C"
                  icon={Sun}
                  subtext="Asphalt thermal retention"
                  variant="amber"
                />

                <MetricCard
                  label="Cooling Shelters"
                  value={heatwaveRisk.coolingSheltersAvailable}
                  unit="Active"
                  icon={Building}
                  subtext="Municipal refuge centers"
                  variant="emerald"
                />
              </div>

              <div className="glass-panel rounded-3xl p-6">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  OSHA & NIOSH Physiological Work/Rest Guidance
                </h4>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p>
                    • <b>WBGT &gt; 30°C:</b> Enforce 45 minutes rest per hour in shaded/air-conditioned rest bays.
                  </p>
                  <p>
                    • <b>Electrolyte Hydration:</b> 1 liter of cool water per hour for outdoor workers.
                  </p>
                  <p>
                    • <b>Vulnerable Alert:</b> Initiate automated welfare checks on isolated elderly residents.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. FLOOD CATCHMENT & HYDROLOGICAL MODEL */}
      {activeHazardTab === 'flood' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Catchment Saturation
                  </span>
                  <StatusBadge category={floodRisk.runoffRisk} size="sm" />
                </div>

                <HazardGauge
                  value={floodRisk.catchmentSaturation}
                  min={0}
                  max={100}
                  unit="%"
                  label={floodRisk.runoffRisk}
                  sublabel="Soil water absorption limit"
                  type="flood"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-emerald-950/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">Drainage Arteries Capacity:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{floodRisk.drainageCapacity}% Open</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400">River Stage:</span>
                  <span className="font-bold font-mono text-sky-500">
                    {floodRisk.riverGaugeLevel}m / {floodRisk.riverThreshold}m Max
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <MetricCard
                  label="River Basin Gauge"
                  value={floodRisk.riverGaugeLevel}
                  unit="m"
                  icon={Waves}
                  subtext={`Alert at ${floodRisk.riverThreshold}m`}
                  variant="blue"
                />

                <MetricCard
                  label="Rainfall Rate"
                  value={weather.rainfallRate}
                  unit="mm/h"
                  icon={Droplets}
                  subtext={weather.rainfallRate > 15 ? 'Torrential Downpour' : 'Moderate'}
                  variant="rose"
                />
              </div>

              <div className="glass-panel rounded-3xl p-6">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-2">
                  Hydrological Drainage Status & Evacuation Roads
                </h4>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-obsidian-900">
                    <span>Evacuation Route Green-4 (Highway 101 Bypass)</span>
                    <span className="font-bold text-emerald-500">CLEAR</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-obsidian-900">
                    <span>Arterial Storm Culvert Zone B</span>
                    <span className="font-bold text-amber-500">74% Flow</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-obsidian-900">
                    <span>Low-lying Underpass Sump Pumps</span>
                    <span className="font-bold text-emerald-500">3/3 Operational</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
