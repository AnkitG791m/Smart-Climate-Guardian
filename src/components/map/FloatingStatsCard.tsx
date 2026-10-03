import React, { useState } from 'react';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  ChevronDown, 
  ChevronUp, 
  Activity, 
  Sparkles,
  Info,
  Clock,
  ShieldCheck,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertTriangle,
  Heart,
  Baby,
  Sun
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { LiveEnvironmentalData } from '../../services/openMeteo';
import { getCPCBColorDetails } from '../../utils/cpcbAqi';
import { soundService } from '../../services/soundService';

interface FloatingStatsCardProps {
  data: LiveEnvironmentalData;
  forceMinimized?: boolean;
}

export const FloatingStatsCard: React.FC<FloatingStatsCardProps> = ({ data, forceMinimized = false }) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const effectiveMinimized = forceMinimized || isMinimized;
  const { cpcbAqi, weather, rawPollutants, city, lastUpdated, isStale } = data;
  const colorDetails = getCPCBColorDetails(cpcbAqi.category);

  // Friendly Citizen Guidance based on AQI
  const isGood = cpcbAqi.aqi <= 50;
  const isSatisfactory = cpcbAqi.aqi > 50 && cpcbAqi.aqi <= 100;
  const isModerate = cpcbAqi.aqi > 100 && cpcbAqi.aqi <= 200;
  const isPoor = cpcbAqi.aqi > 200;

  // Simple plain-language guidance for normal users
  const simpleVerdictEn = isGood 
    ? "Air is clean and fresh. Perfect for morning walks and outdoor fun!"
    : isSatisfactory
    ? "Air quality is good. Safe for almost everyone outdoors."
    : isModerate
    ? "Air is acceptable, but sensitive people should take care outside."
    : "Air is polluted today. Wear an N95 mask and limit outdoor exertion.";

  const simpleVerdictHi = isGood
    ? "हवा बिल्कुल साफ और ताज़ा है। सुबह की सैर और घूमने के लिए बहुत बढ़िया!"
    : isSatisfactory
    ? "हवा की गुणवत्ता अच्छी है। बाहर जाना पूरी तरह सुरक्षित है।"
    : isModerate
    ? "हवा में हल्की धूल है। सांस के मरीज और बुजुर्ग बाहर संभलकर रहें।"
    : "आज हवा खराब है। बाहर जाते समय N95 मास्क पहनें।";

  // Minimized Compact Pill Mode
  if (effectiveMinimized) {
    return (
      <div className="absolute top-4 right-4 z-30">
        <button
          onClick={() => {
            soundService.playClick();
            setIsMinimized(false);
          }}
          className="bg-white/95 dark:bg-[#131d2e]/95 backdrop-blur-xl px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-3 border border-blue-100 dark:border-blue-900/40 hover:border-[#2F80ED] transition-all hover:scale-105"
        >
          <span className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: colorDetails.color }} />
          <div className="text-left font-sans">
            <span className="text-xs font-black text-slate-800 dark:text-slate-100 block">
              {city.name}: {cpcbAqi.aqi} AQI ({cpcbAqi.category})
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-medium">
              {weather.temperature}°C • {isHindi ? 'विस्तार देखें' : 'Click to expand'}
            </span>
          </div>
          <Maximize2 className="w-4 h-4 text-[#2F80ED] ml-1" />
        </button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-30 max-w-sm w-[calc(100vw-2.5rem)] sm:w-88 transition-all duration-300">
      <div className="bg-white/95 dark:bg-[#131d2e]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-100/90 dark:border-blue-900/40 overflow-hidden">
        {/* Top Header */}
        <div className="p-3.5 px-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-gradient-to-r from-blue-50/50 to-white dark:from-[#162338] dark:to-[#131d2e]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-white p-0.5 border border-blue-100 shadow-xs flex items-center justify-center shrink-0">
              <img src="/images/earth-melting-care.png" alt="Earth Care" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 dark:text-white">
                  {city.name} Air Quality
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-blue-100 dark:bg-blue-900/60 text-[#2F80ED] dark:text-blue-200">
                  LIVE
                </span>
              </div>
              <span className="text-[10px] text-slate-400 block">
                {lastUpdated}
              </span>
            </div>
          </div>

          <button
            onClick={() => {
              soundService.playClick();
              setIsMinimized(true);
            }}
            className="p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-4 h-4" />
          </button>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
          {/* Main Friendly AQI Hero Banner */}
          <div 
            className="p-4 rounded-2xl flex items-center justify-between shadow-sm border"
            style={{
              backgroundColor: colorDetails.bgLight,
              borderColor: `${colorDetails.color}35`,
            }}
          >
            <div className="space-y-1">
              <span 
                className="text-xs font-black uppercase tracking-wider block"
                style={{ color: colorDetails.textColor }}
              >
                {isHindi ? colorDetails.labelHi : cpcbAqi.category}
              </span>
              <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-snug max-w-[190px]">
                {isHindi ? simpleVerdictHi : simpleVerdictEn}
              </p>
            </div>

            <div className="text-center font-mono">
              <span 
                className="text-3xl font-black block leading-none"
                style={{ color: colorDetails.color }}
              >
                {cpcbAqi.aqi}
              </span>
              <span className="text-[9px] font-black uppercase text-slate-500 font-sans tracking-wider">
                AQI
              </span>
            </div>
          </div>

          {/* Everyday Citizen Lifestyle Advice (Normal User Friendly) */}
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">
              {isHindi ? 'दैनिक गतिविधियां और सुझाव' : 'Daily Activity & Health Guide'}
            </span>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {/* 1. Walk / Exercise */}
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <span className="text-lg">🏃</span>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                    {isHindi ? 'सुबह की सैर' : 'Morning Walk'}
                  </span>
                  <span className={`text-[10px] font-semibold ${isPoor ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {isPoor ? (isHindi ? 'कम करें' : 'Avoid peak') : (isHindi ? 'सुरक्षित' : 'Safe to go')}
                  </span>
                </div>
              </div>

              {/* 2. Ventilation */}
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <span className="text-lg">🪟</span>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                    {isHindi ? 'घर की खिड़कियां' : 'Home Windows'}
                  </span>
                  <span className={`text-[10px] font-semibold ${isPoor ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {isPoor ? (isHindi ? 'बंद रखें' : 'Keep closed') : (isHindi ? 'खोल सकते हैं' : 'Open for air')}
                  </span>
                </div>
              </div>

              {/* 3. Kids & Seniors */}
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <span className="text-lg">👶</span>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                    {isHindi ? 'बच्चे व बुजुर्ग' : 'Kids & Seniors'}
                  </span>
                  <span className={`text-[10px] font-semibold ${isPoor || isModerate ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {isPoor || isModerate ? (isHindi ? 'ध्यान रखें' : 'Take care') : (isHindi ? 'पूरी तरह सुरक्षित' : 'Safe')}
                  </span>
                </div>
              </div>

              {/* 4. Face Mask */}
              <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <span className="text-lg">😷</span>
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                    {isHindi ? 'फेस मास्क' : 'Face Mask'}
                  </span>
                  <span className={`text-[10px] font-semibold ${isPoor ? 'text-amber-600 font-bold' : 'text-slate-500'}`}>
                    {isPoor ? (isHindi ? 'N95 जरूरी' : 'N95 Advised') : (isHindi ? 'जरूरत नहीं' : 'Not required')}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Weather Pills */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-2xl bg-blue-50/60 dark:bg-black/20 border border-blue-100/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Temp</span>
              <span className="font-black text-slate-800 dark:text-slate-100 font-mono text-xs">
                {weather.temperature}°C
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-blue-50/60 dark:bg-black/20 border border-blue-100/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Humidity</span>
              <span className="font-black text-slate-800 dark:text-slate-100 font-mono text-xs">
                {weather.humidity}%
              </span>
            </div>
            <div className="p-2.5 rounded-2xl bg-blue-50/60 dark:bg-black/20 border border-blue-100/80 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 block font-medium">Wind</span>
              <span className="font-black text-slate-800 dark:text-slate-100 font-mono text-xs">
                {weather.windSpeed} km/h
              </span>
            </div>
          </div>

          {/* Technical Details (Expandable for advanced users) */}
          <div className="pt-1">
            <button
              onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
              className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-600 dark:text-slate-300 text-xs font-bold flex items-center justify-between transition-colors"
            >
              <span>{isHindi ? 'वैज्ञानिक विवरण (PM2.5, PM10)' : 'Scientific Pollutant Details'}</span>
              <ChevronDown className={`w-4 h-4 transition-transform ${showTechnicalDetails ? 'rotate-180' : ''}`} />
            </button>

            {showTechnicalDetails && (
              <div className="mt-2 p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 space-y-2 text-xs animate-fadeIn">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">PM2.5 (Fine Dust)</span>
                  <span className="font-mono font-bold text-amber-600">{rawPollutants.pm25?.toFixed(1) || '38'} µg/m³</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">PM10 (Coarse Dust)</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{rawPollutants.pm10?.toFixed(1) || '64'} µg/m³</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">NO₂ (Vehicle Exhaust)</span>
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{rawPollutants.no2?.toFixed(1) || '22'} µg/m³</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Dominant Cause</span>
                  <span className="font-mono font-bold text-[#2F80ED]">{cpcbAqi.dominantPollutant}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
