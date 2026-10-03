import React from 'react';
import { X, Flame, Waves, Sun, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useClimate, ScenarioType } from '../../context/ClimateContext';

export const ScenarioModal: React.FC = () => {
  const { isScenarioModalOpen, setIsScenarioModalOpen, triggerScenario, activeScenario, currentStation } = useClimate();

  if (!isScenarioModalOpen) return null;

  const scenarios: {
    id: ScenarioType;
    title: string;
    description: string;
    impact: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    badge: string;
  }[] = [
    {
      id: 'wildfire',
      title: 'Wildfire Smoke & Thermal Inversion',
      description: 'Dense PM2.5 plume blankets the region. Inversion layer traps particulates at ground level with hazardous AQI spike.',
      impact: 'AQI -> 345 (Hazardous), PM2.5 -> 242 µg/m³, Inversion -> Trapped',
      icon: Flame,
      accentColor: 'text-rose-500 bg-rose-500/10 border-rose-500/30',
      badge: 'Red Emergency'
    },
    {
      id: 'flood',
      title: 'Flash Flood & Catchment Saturation',
      description: 'Intense 45mm/h torrential storm exceeds urban storm drainage capacity. River stage breaches critical threshold.',
      impact: 'Precip -> 45 mm/h, Saturation -> 98%, River -> 9.8m',
      icon: Waves,
      accentColor: 'text-sky-500 bg-sky-500/10 border-sky-500/30',
      badge: 'Flash Flood Warning'
    },
    {
      id: 'heatwave',
      title: 'Category 5 Heatwave & Grid Strain',
      description: 'Extreme heat dome pushes wet-bulb globe temperature (WBGT) into physiological danger threshold, straining cooling shelters.',
      impact: 'Temp -> 43.5°C, WBGT -> 33.2°C, Grid Strain -> Critical',
      icon: Sun,
      accentColor: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      badge: 'Heatwave Alert'
    },
    {
      id: 'normal',
      title: 'Baseline Reset (All Clear)',
      description: 'Restores all sensors and telemetry models back to standard operational baseline.',
      impact: 'Restores initial sensor calibrations and clears emergency alerts.',
      icon: RotateCcw,
      accentColor: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      badge: 'Standard Baseline'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel-elevated rounded-3xl p-6 sm:p-8 border border-emerald-500/30 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={() => setIsScenarioModalOpen(false)}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              Crisis Scenario Simulator
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Trigger simulated environmental crises to test defensive response workflows in <span className="font-semibold text-slate-800 dark:text-slate-200">{currentStation.name}</span>.
            </p>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="space-y-3">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isSelected = activeScenario === sc.id;
            return (
              <div
                key={sc.id}
                onClick={() => {
                  triggerScenario(sc.id);
                  setIsScenarioModalOpen(false);
                }}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isSelected 
                    ? 'border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/30 shadow-eco-sm'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-obsidian-900/50 hover:border-emerald-500/40'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 border ${sc.accentColor}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                      {sc.title}
                    </h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-obsidian-800 text-slate-700 dark:text-slate-300">
                      {sc.badge}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    {sc.description}
                  </p>
                  <p className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 mt-2 font-medium">
                    ⚡ {sc.impact}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
