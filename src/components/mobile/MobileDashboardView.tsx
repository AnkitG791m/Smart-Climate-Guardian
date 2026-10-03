import React, { useState } from 'react';
import { 
  MapPin, 
  Wind, 
  Thermometer, 
  Droplets, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  PlusCircle, 
  Sparkles, 
  Compass, 
  ChevronRight,
  ArrowLeft,
  Crosshair,
  User,
  Share2,
  Activity,
  Info,
  Cloud,
  ChevronDown,
  Layers,
  Check
} from 'lucide-react';
import { CityLocation, LiveEnvironmentalData } from '../../services/openMeteo';
import { soundService } from '../../services/soundService';

interface MobileDashboardViewProps {
  currentCity: CityLocation;
  liveData: LiveEnvironmentalData;
  onOpenMap: () => void;
  onOpenReportModal: () => void;
  onOpenChat: () => void;
  onOpenAlerts: () => void;
  onSelectCity: (city: CityLocation) => void;
}

export const MobileDashboardView: React.FC<MobileDashboardViewProps> = ({
  currentCity,
  liveData,
  onOpenMap,
  onOpenReportModal,
  onOpenChat,
  onOpenAlerts,
  onSelectCity,
}) => {
  const { cpcbAqi, weather, rawPollutants } = liveData;
  const [activePhoto, setActivePhoto] = useState<'fire' | 'smog'>('fire');
  const [viewMode, setViewMode] = useState<'home' | 'detail'>('home');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [selectedStationName, setSelectedStationName] = useState('MP Nagar Zone-I');

  // Watchlist items matching media_1791013058414.png 2x2 grid
  const watchlist = [
    { 
      name: 'TT Nagar', 
      aqi: 89, 
      status: 'Moderate', 
      ringColor: '#eab308', 
      textColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10' 
    },
    { 
      name: 'MP Nagar', 
      aqi: 108, 
      status: 'Unhealthy for sensitive groups', 
      ringColor: '#f97316', 
      textColor: 'text-orange-500',
      bgColor: 'bg-orange-500/10' 
    },
    { 
      name: 'Arera Colony', 
      aqi: 68, 
      status: 'Moderate', 
      ringColor: '#eab308', 
      textColor: 'text-amber-500',
      bgColor: 'bg-amber-500/10' 
    },
    { 
      name: 'Upper Lake', 
      aqi: 35, 
      status: 'Good', 
      ringColor: '#10b981', 
      textColor: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10' 
    },
  ];

  // Nearby ranked list matching media_1791013058414.png
  const nearbySectors = [
    { rank: 1, name: 'TT Nagar Central', aqi: 169, cat: 'Poor', color: 'bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300' },
    { rank: 2, name: 'Kolar Bypass', aqi: 76, cat: 'Satisfactory', color: 'bg-lime-100 text-lime-700 dark:bg-lime-950/60 dark:text-lime-300' },
    { rank: 3, name: 'Govindpura Ind.', aqi: 142, cat: 'Moderate', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
    { rank: 4, name: 'BHEL Township', aqi: 113, cat: 'Moderate', color: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300' },
    { rank: 5, name: 'Shahpura Lake', aqi: 62, cat: 'Satisfactory', color: 'bg-lime-100 text-lime-700 dark:bg-lime-950/60 dark:text-lime-300' },
  ];

  // Hourly AQI series matching media_1791013058414.png bar chart
  const hourlyAqi = [
    { time: '8 AM', value: 95, height: '48%' },
    { time: '10 AM', value: 140, height: '70%' },
    { time: '12 PM', value: 185, height: '92%' },
    { time: '2 PM', value: 160, height: '80%' },
    { time: '4 PM', value: 135, height: '67%' },
    { time: '6 PM', value: 110, height: '55%' },
  ];

  // --- SCREEN 1: ONBOARDING / INTRO MODAL ---
  if (showOnboarding) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-md flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white dark:bg-[#0c1815] rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-emerald-900/50 space-y-5 animate-scale-in">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
              Check the air quality on around you
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Live hyperlocal telemetry for Bhopal, MP Nagar & Central India
            </p>
          </div>

          {/* Mascot / Mask Graphic */}
          <div className="relative rounded-2xl h-44 bg-gradient-to-b from-blue-100 to-indigo-100 dark:from-[#11241f] dark:to-[#07110e] flex items-center justify-center overflow-hidden border border-slate-200/80 dark:border-emerald-950">
            <div className="text-center space-y-2">
              <span className="text-6xl animate-bounce inline-block">😷</span>
              <div className="flex items-center justify-center gap-1.5">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-indigo-700 shadow-sm">
                  AQI 135 Live
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500 text-white">
                  CPCB Verified
                </span>
              </div>
            </div>
          </div>

          {/* Carousel Dots */}
          <div className="flex items-center justify-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
            <div className="w-6 h-2 rounded-full bg-blue-600" />
            <div className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-700" />
          </div>

          {/* 3 Value Propositions */}
          <div className="space-y-3 pt-1">
            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-black/30">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-600 flex items-center justify-center shrink-0 font-bold text-xs">
                AQI
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">Real-time Air quality</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Accurate, reliable data from CPCB CAAQMS sensor grid.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-black/30">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 flex items-center justify-center shrink-0 font-bold text-xs">
                📰
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">Hyperlocal Intelligence</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Actionable health recommendations for your immediate street.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-50 dark:bg-black/30">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 flex items-center justify-center shrink-0 font-bold text-xs">
                📊
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800 dark:text-slate-200">Constantly Updated Statistics</p>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Hourly sub-indices across PM2.5, PM10, NO₂, and O₃.</p>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={() => {
              soundService.playClick();
              setShowOnboarding(false);
            }}
            className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <span>Connect me</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // --- SCREEN 3: DETAIL VIEW (Exact match to media_1791013058414.png right phone) ---
  if (viewMode === 'detail') {
    return (
      <div className="w-full pb-24 pt-3 px-4 space-y-4 font-sans select-none overflow-y-auto">
        {/* Top Navigation Bar with Back & Center */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => {
              soundService.playClick();
              setViewMode('home');
            }}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-[#0c1815] border border-slate-200 dark:border-emerald-950 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-5 h-5 text-blue-600" />
          </button>

          <div className="text-center">
            <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block font-mono">
              Detailed Air Report
            </span>
            <h3 className="text-sm font-black text-slate-900 dark:text-white">
              {selectedStationName}
            </h3>
          </div>

          <button
            onClick={onOpenMap}
            className="w-10 h-10 rounded-2xl bg-white dark:bg-[#0c1815] border border-slate-200 dark:border-emerald-950 flex items-center justify-center text-slate-700 dark:text-slate-200 shadow-sm active:scale-95"
          >
            <Compass className="w-5 h-5 text-emerald-500" />
          </button>
        </div>

        {/* Top Skyline Banner */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl border border-slate-200/90 dark:border-emerald-900/60 bg-gradient-to-b from-orange-400/20 via-white to-amber-400/10 dark:from-[#1b2b25] dark:to-[#0c1815] p-5">
          <div 
            className="absolute inset-0 opacity-20 pointer-events-none bg-cover bg-center"
            style={{ backgroundImage: `url('/images/smog-haze-city.png')` }}
          />

          <div className="relative z-10 space-y-3">
            {/* City & Sector Pill */}
            <div className="inline-block px-3 py-1 rounded-xl bg-orange-500 text-white font-black text-xs shadow-md">
              <span className="block font-sans">{currentCity.name}, {currentCity.state || 'MP'}</span>
              <span className="text-[10px] font-normal opacity-90">{selectedStationName}</span>
            </div>

            {/* Large Orange Alert Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 dark:from-orange-950/40 dark:to-amber-950/40 border border-orange-200 dark:border-orange-800/60 flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-orange-900 dark:text-orange-200">
                  Unhealthy for sensitive groups
                </h4>
                <p className="text-xs text-orange-700 dark:text-orange-300 mt-0.5 font-medium">
                  wear a mask when you're outside
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-orange-600 dark:text-orange-400 block font-mono">
                  135
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-700 dark:text-orange-300 font-sans">
                  AQI
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Middle Card: "This is the air quality for [City] region today" */}
        <div className="rounded-3xl p-5 bg-white dark:bg-[#0c1815] border border-slate-200 dark:border-emerald-950 shadow-md space-y-4">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            This is the air quality for {currentCity.name} region today
          </span>

          {/* PM2.5 Gauge with Mask Emoji */}
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-amber-700 dark:text-amber-300 flex items-center gap-1 font-mono">
                PM 2.5
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
              </span>
              <span className="text-2xl font-black text-amber-800 dark:text-amber-200 font-mono">
                65.2<span className="text-xs font-normal text-slate-500">µg/m³</span>
              </span>
            </div>

            {/* Mask Emoji Circle Avatar */}
            <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-2xl shadow-inner border border-amber-300 dark:border-amber-700">
              😷
            </div>
          </div>

          {/* 3 Metrics: Cloudiness, Temperature, Wind */}
          <div className="grid grid-cols-3 gap-2.5 text-center text-xs">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Cloudiness</span>
              <span className="font-black text-slate-800 dark:text-slate-200 font-mono text-sm">48%</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Temperature</span>
              <span className="font-black text-slate-800 dark:text-slate-200 font-mono text-sm">{weather.temperature}°C</span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Wind</span>
              <span className="font-black text-slate-800 dark:text-slate-200 font-mono text-sm">{weather.windSpeed} km/h</span>
            </div>
          </div>
        </div>

        {/* Bottom Card: "AQI average today's" Hourly Bar Chart */}
        <div className="rounded-3xl p-5 bg-white dark:bg-[#0c1815] border border-slate-200 dark:border-emerald-950 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white">
              AQI average today's
            </span>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 text-xs font-bold">
              <span>135 AQI</span>
              <ChevronDown className="w-3 h-3" />
            </div>
          </div>

          {/* Bar Chart Container */}
          <div className="h-44 pt-4 flex items-end justify-between gap-2 px-2 border-b border-slate-100 dark:border-slate-800 pb-2">
            {hourlyAqi.map((item) => (
              <div key={item.time} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.value}
                </span>
                <div 
                  className="w-full max-w-[28px] rounded-t-xl bg-gradient-to-t from-orange-500 to-amber-400 dark:from-orange-600 dark:to-amber-500 shadow-sm transition-all duration-500"
                  style={{ height: item.height }}
                />
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {item.time}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Baseline: 50 AQI</span>
            <span>Peak: 200 AQI</span>
          </div>
        </div>

        {/* Back to Home Button */}
        <button
          onClick={() => {
            soundService.playClick();
            setViewMode('home');
          }}
          className="w-full py-3 rounded-2xl bg-slate-100 dark:bg-black/40 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-800"
        >
          ← Back to Local Watchlist & Feed
        </button>
      </div>
    );
  }

  // --- SCREEN 2: MOBILE HOME (Exact match to media_1791013058414.png center phone) ---
  return (
    <div className="w-full pb-24 pt-3 px-4 space-y-4 font-sans select-none overflow-y-auto">
      {/* 1. TOP GREETING & STATUS */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Hi, Citizen!
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
            wear a mask when you're outside
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Info / Onboarding button */}
          <button 
            onClick={() => {
              soundService.playClick();
              setShowOnboarding(true);
            }}
            className="w-9 h-9 rounded-full bg-slate-100 dark:bg-[#0c1815] border border-slate-200 dark:border-emerald-900/50 flex items-center justify-center text-slate-600 dark:text-slate-300 shadow-sm"
          >
            <Info className="w-4 h-4" />
          </button>

          {/* AI Voice Pill */}
          <button 
            onClick={onOpenChat}
            className="flex items-center gap-1.5 p-1 pr-2.5 rounded-full bg-emerald-100 dark:bg-emerald-950/70 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-bold"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <span>AI Voice</span>
          </button>
        </div>
      </div>

      {/* 2. HERO AIR QUALITY CARD (Skyline + Category Banner) */}
      <div 
        onClick={() => {
          soundService.playClick();
          setSelectedStationName(currentCity.name);
          setViewMode('detail');
        }}
        className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/90 dark:border-emerald-900/60 bg-gradient-to-br from-amber-500/10 via-white to-emerald-500/10 dark:from-[#11241f] dark:via-[#0c1815] dark:to-[#07110e] p-5 cursor-pointer active:scale-[0.99] transition-transform"
      >
        {/* Background Skyline Art Overlay */}
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-bottom"
          style={{ backgroundImage: `url('/images/smog-haze-city.png')` }}
        />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                Official CPCB Hub
              </span>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{currentCity.name}, {currentCity.state || 'MP'}</span>
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                MP Nagar Zone-I Sector Hub
              </p>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenMap();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-eco-sm flex items-center gap-1"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>

          {/* Health Category & Badges Row */}
          <div className="flex items-center justify-between pt-1">
            <div>
              <span className="text-sm font-black text-orange-600 dark:text-orange-400 block">
                Unhealthy for sensitive groups
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Last update 09.41, Today
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* PM2.5 Pill */}
              <div className="p-2 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center font-mono">
                <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 block font-sans">
                  PM 2.5
                </span>
                <span className="text-sm font-black text-amber-700 dark:text-amber-300">
                  {rawPollutants.pm25 !== undefined ? rawPollutants.pm25.toFixed(0) : '65'}
                </span>
              </div>

              {/* Overall AQI Circular Indicator */}
              <div className="w-12 h-12 rounded-full border-4 border-orange-500 bg-white dark:bg-[#0c1815] flex flex-col items-center justify-center font-mono shadow-md">
                <span className="text-[8px] font-bold text-slate-400 uppercase leading-none font-sans">AQI</span>
                <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                  {cpcbAqi.aqi || 135}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 2x2 WATCHLIST GRID (Exact match to media_1791013058414.png center phone) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Watchlist
          </span>
          <button 
            onClick={onOpenMap} 
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-xs"
          >
            See all
          </button>
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-3">
          {watchlist.map((item) => (
            <div
              key={item.name}
              onClick={() => {
                soundService.playClick();
                setSelectedStationName(item.name);
                setViewMode('detail');
              }}
              className="p-3.5 rounded-3xl bg-white dark:bg-[#0c1815] border border-slate-200/90 dark:border-emerald-950/80 shadow-sm space-y-2 cursor-pointer active:scale-95 transition-all"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">
                  {item.name}
                </span>

                {/* Ring Indicator */}
                <div 
                  className="w-8 h-8 rounded-full border-2 flex flex-col items-center justify-center font-mono shrink-0"
                  style={{ borderColor: item.ringColor }}
                >
                  <span className="text-[7px] text-slate-400 uppercase font-sans leading-none">AQI</span>
                  <span className="text-[10px] font-black leading-tight text-slate-800 dark:text-slate-200">
                    {item.aqi}
                  </span>
                </div>
              </div>

              <span className={`text-[10px] font-bold block line-clamp-1 ${item.textColor}`}>
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. NEARBY RANKED LIST (Exact match to media_1791013058414.png center phone) */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-black text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
            Nearby
          </span>
          <button 
            onClick={onOpenMap} 
            className="text-blue-600 dark:text-blue-400 font-bold hover:underline text-xs"
          >
            See all
          </button>
        </div>

        <div className="rounded-3xl p-3 bg-white dark:bg-[#0c1815] border border-slate-200 dark:border-emerald-950/80 shadow-md divide-y divide-slate-100 dark:divide-slate-800">
          <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase text-slate-400">
            <span>City / Local Sector</span>
            <span>AQI</span>
          </div>

          {nearbySectors.map((sector) => (
            <div
              key={sector.name}
              onClick={() => {
                soundService.playClick();
                setSelectedStationName(sector.name);
                setViewMode('detail');
              }}
              className="flex items-center justify-between p-2.5 hover:bg-slate-50 dark:hover:bg-black/30 rounded-2xl cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-slate-400 w-4">
                  {sector.rank}.
                </span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  {sector.name}
                </span>
              </div>

              <span className={`text-xs font-black font-mono px-2 py-0.5 rounded-full ${sector.color}`}>
                {sector.aqi}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. GROUND-TRUTH FIELD EVIDENCE (Uploaded user photos) */}
      <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-emerald-950/80 bg-white dark:bg-[#0c1815] shadow-lg space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <h4 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              Verified Ground-Truth Evidence
            </h4>
          </div>

          <div className="flex items-center gap-1 text-[10px]">
            <button
              onClick={() => setActivePhoto('fire')}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                activePhoto === 'fire' ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-black/30 text-slate-500'
              }`}
            >
              Fire Action
            </button>
            <button
              onClick={() => setActivePhoto('smog')}
              className={`px-2 py-1 rounded-lg font-bold transition-all ${
                activePhoto === 'smog' ? 'bg-slate-800 text-white dark:bg-emerald-600' : 'bg-slate-100 dark:bg-black/30 text-slate-500'
              }`}
            >
              Smog Inversion
            </button>
          </div>
        </div>

        {/* Dynamic Image Display */}
        <div className="relative rounded-2xl overflow-hidden h-44 bg-slate-900 border border-slate-200 dark:border-slate-800">
          <img
            src={activePhoto === 'fire' ? '/images/wildfire-citizen-action.png' : '/images/smog-haze-city.png'}
            alt="Ground Truth Environmental Incident"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 left-2 flex items-center gap-1">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-red-600 text-white backdrop-blur-md">
              {activePhoto === 'fire' ? 'Citizen Fire Brigade' : 'Atmospheric Smog Cam'}
            </span>
          </div>
          <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white text-[10px]">
            <div className="flex justify-between font-mono text-[9px] text-slate-300">
              <span>{activePhoto === 'fire' ? 'Kolar Road Bypass' : 'Upper Lake Inversion'}</span>
              <span>GPS Tagged • 14m ago</span>
            </div>
            <p className="text-[10px] text-slate-200 mt-0.5 line-clamp-1">
              {activePhoto === 'fire' 
                ? 'Citizen dousing stubble blaze with water bucket before fire truck arrival.'
                : '180m atmospheric inversion ceiling trapping urban particulate matter.'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenReportModal}
          className="w-full py-2.5 rounded-xl bg-slate-100 dark:bg-black/40 hover:bg-emerald-50 text-slate-800 dark:text-slate-200 hover:text-emerald-600 text-xs font-bold transition-all border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-emerald-500" />
          <span>Submit Ground Evidence from Your Phone</span>
        </button>
      </div>
    </div>
  );
};
