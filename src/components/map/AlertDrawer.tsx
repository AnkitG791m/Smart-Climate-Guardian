import React from 'react';
import { 
  X, 
  AlertTriangle, 
  Volume2, 
  CheckCircle2, 
  ShieldAlert, 
  Clock, 
  Radio, 
  PhoneCall, 
  Share2 
} from 'lucide-react';
import { soundService } from '../../services/soundService';

interface AlertDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cityName: string;
}

export const AlertDrawer: React.FC<AlertDrawerProps> = ({
  isOpen,
  onClose,
  cityName,
}) => {
  if (!isOpen) return null;

  const testAudio = () => {
    soundService.playAlertChime('critical');
  };

  const activeAlerts = [
    {
      id: 'alt-cpcb-1',
      title: 'CRITICAL INVERSION WARNING: Micro-Particulate Stagnation',
      severity: 'Critical',
      time: '18 mins ago',
      expiresIn: '8 hours',
      region: `${cityName} Metropolitan Basin`,
      description: 'Thermal inversion ceiling at 180m is preventing vertical particulate dispersion. PM2.5 concentrations exceeding 240 µg/m³.',
      actions: [
        'Mandatory N95 respirators for outdoor commuters.',
        'High-emission industrial boilers ordered to suspend operation.',
        'Schools instructed to suspend outdoor athletic sessions.'
      ]
    },
    {
      id: 'alt-cpcb-2',
      title: 'HYDROLOGICAL SPILLWAY CAUTION: Upper Catchment Runoff',
      severity: 'Warning',
      time: '45 mins ago',
      expiresIn: '12 hours',
      region: `${cityName} Sluice Discharge Corridors`,
      description: 'Sustained precipitation has saturated soil to 88%. Drainage sumps experiencing elevated runoff flow.',
      actions: [
        'Do not cross low-lying bridges or flooded culverts.',
        'Follow designated municipal evacuation artery Green-2.',
        'Emergency response units active on VHF Channel 16.'
      ]
    }
  ];

  return (
    <div className="absolute inset-y-0 right-0 z-50 w-full sm:w-96 max-w-full bg-white/95 backdrop-blur-2xl shadow-2xl border-l border-blue-100 overflow-y-auto animate-fadeIn flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="relative p-5 pb-4 border-b border-rose-100 bg-rose-50/70">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-600">
              National Civil Defense Dispatch
            </span>
          </div>

          <h3 className="text-lg font-black text-slate-900 mt-1">
            Emergency Alert Center
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Active directives for <span className="font-bold text-slate-800">{cityName}</span>
          </p>

          {/* Audio Siren Test Trigger */}
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={testAudio}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Test Emergency Siren</span>
            </button>
            <span className="text-[10px] text-slate-400 font-mono">Web Audio Synthesizer</span>
          </div>
        </div>

        {/* Alerts Feed */}
        <div className="p-4 space-y-4 text-xs">
          {activeAlerts.map((a) => (
            <div
              key={a.id}
              className={`p-4 rounded-2xl border ${
                a.severity === 'Critical'
                  ? 'bg-rose-50/50 border-rose-200'
                  : 'bg-amber-50/50 border-amber-200'
              }`}
            >
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200/60">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                  a.severity === 'Critical' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {a.severity} Directive
                </span>
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {a.time}
                </span>
              </div>

              <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                {a.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {a.description}
              </p>

              <div className="mt-3 space-y-1 pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Mandatory Protocols:
                </span>
                {a.actions.map((act, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-700">
                    <span className="text-emerald-500 font-bold">✓</span>
                    <span>{act}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Hotlines Footer */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-bold text-slate-800">
          <PhoneCall className="w-3.5 h-3.5 text-[#2F80ED]" />
          <span>India Civil Emergency Hotlines</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5 text-center font-mono text-[11px]">
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[9px] text-slate-400 block font-sans">National</span>
            <span className="font-extrabold text-slate-800">112</span>
          </div>
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[9px] text-slate-400 block font-sans">Ambulance</span>
            <span className="font-extrabold text-slate-800">108</span>
          </div>
          <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-sm">
            <span className="text-[9px] text-slate-400 block font-sans">NDMA Desk</span>
            <span className="font-extrabold text-slate-800">1078</span>
          </div>
        </div>
      </div>
    </div>
  );
};
