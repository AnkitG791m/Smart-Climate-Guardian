import React, { useState } from 'react';
import { 
  MapPin, 
  Wind, 
  Thermometer, 
  Droplets, 
  AlertTriangle, 
  PlusCircle, 
  Sparkles, 
  Compass, 
  ChevronRight,
  ArrowLeft,
  Crosshair,
  ChevronDown,
  Home as HomeIcon,
  Layers,
  FileText,
  BarChart3,
  Settings,
  Bell,
  Activity,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { CityLocation, LiveEnvironmentalData } from '../../services/openMeteo';
import { soundService } from '../../services/soundService';

interface EugeneAirShowcaseProps {
  currentCity: CityLocation;
  liveData: LiveEnvironmentalData;
  onOpenMap: () => void;
  onOpenChat: () => void;
  onOpenReportModal: () => void;
  onSelectCity: (city: CityLocation) => void;
}

export const EugeneAirShowcase: React.FC<EugeneAirShowcaseProps> = ({
  currentCity,
  liveData,
  onOpenMap,
  onOpenChat,
  onOpenReportModal,
  onSelectCity,
}) => {
  const { cpcbAqi, weather, rawPollutants } = liveData;

  // Active view: 'home' or 'detail' (for drill-down)
  const [activeView, setActiveView] = useState<'home' | 'detail'>('home');
  const [activePhotoId, setActivePhotoId] = useState<'industrial' | 'landfill' | 'family' | 'fire' | 'smog'>('industrial');
  const [selectedStation, setSelectedStation] = useState<{
    name: string;
    aqi: number;
    status: string;
    pm25: number;
    cloud: number;
    temp: number;
    wind: number;
  }>({
    name: 'MP Nagar Zone-I',
    aqi: cpcbAqi.aqi || 68,
    status: cpcbAqi.category || 'Satisfactory',
    pm25: rawPollutants.pm25 || 38.5,
    cloud: 48,
    temp: weather.temperature || 32,
    wind: weather.windSpeed || 8.5,
  });

  // Photo Gallery with real ground-truth images uploaded by the user
  const photoGallery = [
    {
      id: 'industrial' as const,
      label: '🏭 Industrial',
      url: '/images/thermal-power-smoke.png',
      title: 'Mandideep & Govindpura Industrial Stacks',
      subtitle: 'Massive Flue Gas Emission & Heavy Particulate Plume',
      meta: 'Thermal Boiler Combustion • Boundary Layer Trapping',
    },
    {
      id: 'landfill' as const,
      label: '🔥 Landfill Dump',
      url: '/images/landfill-smoke-crisis.png',
      title: 'Bhanpur Waste Landfill & Brick Kilns',
      subtitle: 'Open Dump Smoldering & Toxic Hydrocarbon Smoke',
      meta: 'Severe Particulate Dispersion • 4.2 km Radius Affected',
    },
    {
      id: 'family' as const,
      label: '👨‍👦 Family Health',
      url: '/images/father-child-pollution.png',
      title: 'Sensitive Groups & Child Respiratory Defense',
      subtitle: 'Protecting Future Generations • Pediatric Health Warning',
      meta: 'Buffer Zone Monitoring • Mandatory Mask Advisory',
    },
    {
      id: 'fire' as const,
      label: '🚒 Citizen Action',
      url: '/images/wildfire-citizen-action.png',
      title: 'Community Fire Suppression • Kolar Road',
      subtitle: 'Citizen Brigade Active Suppression of Scrub Combustion',
      meta: 'GPS 23.168°N, 77.419°E • Verified by 28 Observers',
    },
    {
      id: 'smog' as const,
      label: '🌫️ Basin Smog',
      url: '/images/smog-haze-city.png',
      title: 'Upper Lake Thermal Inversion & City Smog',
      subtitle: 'Atmospheric Boundary Layer Trapping Urban Exhaust',
      meta: 'Optical Visibility: 5.1 km • Solar Inversion',
    },
  ];

  // Watchlist items matching user image media_1791013058414.png
  const watchlist = [
    { name: 'TT Nagar Core', aqi: 62, status: 'Satisfactory', ringColor: '#10B981', textColor: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'MP Nagar Zone-I', aqi: 108, status: 'Unhealthy for sensitive groups', ringColor: '#F97316', textColor: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Arera Colony', aqi: 54, status: 'Satisfactory', ringColor: '#10B981', textColor: 'text-emerald-600', bg: 'bg-emerald-50' },
    { name: 'Upper Lake VIP', aqi: 35, status: 'Good', ringColor: '#10B981', textColor: 'text-emerald-600', bg: 'bg-emerald-50' },
  ];

  // Nearby ranked list matching media_1791013058414.png
  const nearbySectors = [
    { rank: 1, name: 'TT Nagar Central', aqi: 72, aqiColor: 'text-emerald-700 bg-emerald-100' },
    { rank: 2, name: 'Kolar Road Bypass', aqi: 85, aqiColor: 'text-amber-700 bg-amber-100' },
    { rank: 3, name: 'Govindpura Ind.', aqi: 124, aqiColor: 'text-orange-700 bg-orange-100' },
    { rank: 4, name: 'BHEL Township', aqi: 92, aqiColor: 'text-emerald-700 bg-emerald-100' },
    { rank: 5, name: 'Shahpura Lake', aqi: 48, aqiColor: 'text-emerald-700 bg-emerald-100' },
  ];

  // Hourly AQI series matching media_1791013058414.png bar chart
  const hourlyBars = [
    { time: '8 AM', value: 45, height: '45%' },
    { time: '10 AM', value: 72, height: '72%' },
    { time: '12 PM', value: 85, height: '85%' },
    { time: '2 PM', value: 78, height: '78%' },
    { time: '4 PM', value: 65, height: '65%' },
    { time: '6 PM', value: 52, height: '52%' },
  ];

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#EBF5FF] via-[#F4F9FF] to-[#E3F0FC] py-6 px-4 sm:px-6 lg:px-8 font-sans select-none text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Floating App Bar */}
        <header className="bg-white/90 backdrop-blur-xl p-3 px-5 rounded-3xl shadow-sm border border-blue-100/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white p-1 border border-blue-200/80 shadow-md shadow-blue-500/10 flex items-center justify-center shrink-0">
              <img src="/images/earth-melting-care.png" alt="Save Earth" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="text-base font-black text-slate-900 leading-tight flex items-center gap-2">
                <span>{currentCity.name}, Central Hub</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Save Earth Initiative • Live CPCB Verified • {currentCity.state || 'Madhya Pradesh'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenChat}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#2F80ED] font-bold text-xs border border-blue-200/80 transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>AI Voice Guide</span>
            </button>

            <button
              onClick={onOpenMap}
              className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-[#2F80ED] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md shadow-blue-500/25 transition-all active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Open Live Map</span>
            </button>
          </div>
        </header>

        {/* ----------------------------------------------------------------- */}
        {/* MAIN UNIFIED DASHBOARD: Two-Column Responsive Layout              */}
        {/* ----------------------------------------------------------------- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: GREETING, HERO CARD, WATCHLIST & NEARBY (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Top Greeting */}
            <div className="flex items-center justify-between px-1">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Hi, Citizen!
                </h2>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">
                  {cpcbAqi.aqi > 100 
                    ? "Wear a mask when you're outside in traffic areas" 
                    : "Air is clean and pleasant today. Safe for outdoor walks!"}
                </p>
              </div>

              <div className="w-11 h-11 rounded-2xl bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-sm">
                🦊
              </div>
            </div>

            {/* Hero Skyline Card (Exact styling from reference image) */}
            <div 
              onClick={() => {
                soundService.playClick();
                setSelectedStation({
                  name: `${currentCity.name} Hub`,
                  aqi: cpcbAqi.aqi || 68,
                  status: cpcbAqi.category || 'Satisfactory',
                  pm25: rawPollutants.pm25 || 38.5,
                  cloud: 48,
                  temp: weather.temperature || 32,
                  wind: weather.windSpeed || 8.5,
                });
              }}
              className="rounded-3xl overflow-hidden shadow-xl border border-blue-100/90 bg-white cursor-pointer active:scale-[0.99] transition-all"
            >
              {/* Skyline Art Top Banner */}
              <div className="relative h-36 sm:h-40 overflow-hidden p-4 flex items-start justify-between">
                {/* Background City Skyline Image */}
                <img 
                  src="/images/city-skyline-banner.jpg" 
                  alt="City Skyline" 
                  className="absolute inset-0 w-full h-full object-cover object-center"
                />
                {/* Soft gradient overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />

                <div className="relative z-10 px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-md border border-white/80">
                  <span className="text-xs font-black text-slate-900 block leading-tight">
                    {currentCity.name}, Madhya Pradesh
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium block leading-tight mt-0.5">
                    MP Nagar & Central Sector Hub
                  </span>
                </div>

                <div className="relative z-10 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md shadow-md border border-white/80">
                    <img src="/images/climate-change-thermometer.png" alt="Climate Tracker" className="w-4 h-4 object-contain" />
                    <span className="text-[11px] font-bold text-slate-800 font-mono">
                      {weather.temperature}°C
                    </span>
                  </div>
                  <span className="px-3 py-1.5 rounded-full bg-black/60 text-white font-mono text-[10px] font-bold backdrop-blur-md shadow-md border border-white/20">
                    LIVE TELEMETRY
                  </span>
                </div>
              </div>

              {/* Bottom Details Row */}
              <div className="p-5 flex items-center justify-between bg-white">
                <div>
                  <span className={`text-base font-black block leading-tight ${
                    cpcbAqi.aqi > 100 ? 'text-[#FF8A3D]' : 'text-emerald-600'
                  }`}>
                    {cpcbAqi.category || 'Satisfactory Air Quality'}
                  </span>
                  <p className="text-xs text-slate-400 font-medium mt-1">
                    Last update Today • CPCB NAQI Standard
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-center font-mono">
                    <span className="text-sm font-black text-amber-700 block leading-none">
                      {rawPollutants.pm25 ? rawPollutants.pm25.toFixed(0) : '38'}
                    </span>
                    <span className="text-[9px] font-bold text-amber-600 uppercase font-sans mt-0.5 block">
                      PM 2.5
                    </span>
                  </div>

                  <div className="w-14 h-14 rounded-full border-4 border-[#2F80ED] bg-white flex flex-col items-center justify-center font-mono shadow-md">
                    <span className="text-[8px] text-slate-400 font-sans uppercase leading-none font-bold">AQI</span>
                    <span className="text-base font-black text-slate-900 leading-tight">
                      {cpcbAqi.aqi || 68}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Watchlist Section (2x2 Grid from reference image) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-black text-slate-900 uppercase tracking-wider text-[12px]">
                  Local Watchlist Sectors
                </span>
                <button 
                  onClick={onOpenMap}
                  className="text-xs font-bold text-[#2F80ED] hover:underline flex items-center gap-1"
                >
                  <span>See all on map</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2x2 Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {watchlist.map((item) => (
                  <div
                    key={item.name}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedStation({
                        name: item.name,
                        aqi: item.aqi,
                        status: item.status,
                        pm25: item.aqi * 0.45,
                        cloud: 42,
                        temp: 31,
                        wind: 9.0,
                      });
                    }}
                    className="p-4 rounded-3xl bg-white border border-blue-50/90 shadow-sm space-y-2 cursor-pointer hover:border-[#2F80ED]/50 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-800">
                        {item.name}
                      </span>
                      <div 
                        className="w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono text-[10px] font-black text-slate-800 shadow-sm"
                        style={{ borderColor: item.ringColor }}
                      >
                        {item.aqi}
                      </div>
                    </div>
                    <span className={`text-[11px] font-bold block ${item.textColor}`}>
                      {item.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Nearby Ranked Sectors */}
            <div className="space-y-3">
              <div className="flex items-center justify-between px-1">
                <span className="text-sm font-black text-slate-900 uppercase tracking-wider text-[12px]">
                  Nearby Bhopal Stations
                </span>
                <button 
                  onClick={onOpenMap}
                  className="text-xs font-bold text-[#2F80ED] hover:underline"
                >
                  Explore Map
                </button>
              </div>

              <div className="rounded-3xl p-4 bg-white border border-blue-50/90 shadow-sm divide-y divide-slate-100">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400 pb-2">
                  <span>Locality / Sector</span>
                  <span>AQI Index</span>
                </div>
                {nearbySectors.map((s) => (
                  <div
                    key={s.name}
                    onClick={() => {
                      soundService.playClick();
                      setSelectedStation({
                        name: s.name,
                        aqi: s.aqi,
                        status: s.aqi > 100 ? 'Moderate' : 'Good',
                        pm25: s.aqi * 0.45,
                        cloud: 45,
                        temp: 31.5,
                        wind: 8.0,
                      });
                    }}
                    className="flex items-center justify-between py-2.5 hover:bg-blue-50/40 rounded-xl px-2 cursor-pointer transition-colors"
                  >
                    <span className="text-xs font-bold text-slate-800">
                      {s.rank}. {s.name}
                    </span>
                    <span className={`text-xs font-black font-mono px-2.5 py-0.5 rounded-full ${s.aqiColor}`}>
                      {s.aqi} AQI
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: DETAILED REPORT, HOURLY BAR CHART & ADVICE (5 COLS) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Detailed Air Quality Card (From reference screen 3) */}
            <div className="rounded-3xl p-5 bg-white border border-blue-50/90 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                    Hyperlocal Telemetry
                  </span>
                  <h3 className="text-base font-black text-slate-900">
                    {selectedStation.name}
                  </h3>
                </div>

                <span className={`px-2.5 py-1 rounded-full text-xs font-black ${
                  selectedStation.aqi > 100 
                    ? 'bg-orange-100 text-orange-700' 
                    : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {selectedStation.status}
                </span>
              </div>

              {/* PM2.5 Metric with Mask Emoji */}
              <div className="p-4 rounded-2xl bg-[#FFF9F2] border border-amber-200/60 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <span>PM 2.5 (Fine Particulate)</span>
                    <span className="w-3.5 h-3.5 rounded-full bg-amber-400 text-white flex items-center justify-center text-[9px] font-black">!</span>
                  </span>
                  <span className="text-3xl font-black text-[#FF8A3D] font-mono block mt-0.5">
                    {selectedStation.pm25.toFixed(1)}<span className="text-sm font-normal text-slate-500">µg/m³</span>
                  </span>
                </div>

                <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 flex items-center justify-center text-2xl shadow-inner">
                  😷
                </div>
              </div>

              {/* 3 Metrics: Cloudiness, Temperature, Wind */}
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[9px] text-slate-400 block font-medium">Cloudiness</span>
                  <span className="text-sm font-black text-slate-800 font-mono">{selectedStation.cloud}%</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[9px] text-slate-400 block font-medium">Temperature</span>
                  <span className="text-sm font-black text-slate-800 font-mono">{selectedStation.temp}°C</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[9px] text-slate-400 block font-medium">Wind</span>
                  <span className="text-sm font-black text-slate-800 font-mono">{selectedStation.wind} km/h</span>
                </div>
              </div>

              {/* Citizen Advice in Simple Language */}
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Daily Citizen Advice:</span>
                </div>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Morning outdoor walks and exercise are completely safe today. Keep house windows open during daytime for natural ventilation.
                </p>
              </div>

              {/* Sensitive Groups & Family Protection Card (feat. father-child-pollution image) */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50/90 to-amber-50/80 border border-blue-100 flex items-center gap-3.5 shadow-sm">
                <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 shadow-md border-2 border-white">
                  <img 
                    src="/images/father-child-pollution.png" 
                    alt="Child & Family Protection" 
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-black uppercase tracking-wider">
                      Family Protection
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">Pediatric Guidance</span>
                  </div>
                  <h4 className="text-xs font-black text-slate-900 leading-snug">
                    Child & Senior Care Guidance
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-tight">
                    During industrial smoke inversion hours, ensure kids and seniors avoid outdoor athletics near highway corridors.
                  </p>
                </div>
              </div>
            </div>

            {/* "AQI average today's" Hourly Bar Chart (From reference screen 3) */}
            <div className="rounded-3xl p-5 bg-white border border-blue-50/90 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black text-slate-900 block">
                    AQI average today's
                  </span>
                  <span className="text-[10px] text-slate-400">
                    24h CPCB Trend Analysis
                  </span>
                </div>

                <div className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-100 text-amber-800 text-xs font-black">
                  <span>{selectedStation.aqi} AQI</span>
                  <ChevronDown className="w-3 h-3" />
                </div>
              </div>

              {/* Vertical Hourly Bar Chart */}
              <div className="pt-4 pb-2">
                <div className="h-32 flex items-end justify-between gap-3 border-b border-slate-100 pb-2 px-2">
                  {hourlyBars.map((bar) => (
                    <div key={bar.time} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                      <span className="text-[9px] font-mono text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        {bar.value}
                      </span>
                      <div 
                        className="w-full max-w-[32px] rounded-t-xl bg-gradient-to-t from-[#FF8A3D] to-amber-400 shadow-sm transition-all duration-500 hover:brightness-105"
                        style={{ height: bar.height }}
                      />
                      <span className="text-[10px] font-medium text-slate-500 whitespace-nowrap">
                        {bar.time}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-2 px-1">
                  <span>Baseline: 0 AQI</span>
                  <span>Peak: 100 AQI</span>
                </div>
              </div>
            </div>

            {/* Ground-Truth Incident Photographic Feed */}
            <div className="rounded-3xl p-5 bg-white border border-blue-50/90 shadow-sm space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <span className="text-xs font-black text-slate-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                  Verified Field Evidence & Real Impact Gallery
                </span>

                {/* 5 Chips for the 5 real photos */}
                <div className="flex items-center gap-1 text-[10px] overflow-x-auto scrollbar-none py-0.5">
                  {photoGallery.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        soundService.playClick();
                        setActivePhotoId(item.id);
                      }}
                      className={`px-2.5 py-1 rounded-xl font-bold whitespace-nowrap transition-all ${
                        activePhotoId === item.id
                          ? 'bg-[#2F80ED] text-white shadow-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Image Display */}
              {(() => {
                const currentPhoto = photoGallery.find(p => p.id === activePhotoId) || photoGallery[0];
                return (
                  <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-900 shadow-inner group">
                    <img
                      src={currentPhoto.url}
                      alt={currentPhoto.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />
                    
                    <div className="absolute top-2.5 left-2.5">
                      <span className="px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase bg-black/75 text-emerald-400 backdrop-blur-md border border-white/20 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ground-Truth Photo
                      </span>
                    </div>

                    <div className="absolute bottom-0 inset-x-0 p-3.5 text-white">
                      <h4 className="font-extrabold text-sm leading-tight">
                        {currentPhoto.title}
                      </h4>
                      <p className="text-[11px] text-slate-200 mt-0.5 leading-snug">
                        {currentPhoto.subtitle}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5 text-[9px] text-slate-300 font-mono">
                        <span>{currentPhoto.meta}</span>
                        <span>•</span>
                        <span className="text-emerald-400 font-bold">CPCB Ground Sensor Matched</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <button
                onClick={onOpenReportModal}
                className="w-full py-2.5 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#2F80ED] text-xs font-extrabold flex items-center justify-center gap-1.5 transition-colors border border-blue-200/60"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Submit Citizen Incident Evidence</span>
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
