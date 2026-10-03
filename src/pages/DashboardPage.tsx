import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { 
  Wind, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Compass, 
  CloudRain, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Activity, 
  HeartPulse, 
  ShieldAlert, 
  Trees, 
  Sparkles,
  Info,
  Clock,
  Layers
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { CityLocation, DEFAULT_CITY, fetchLiveEnvironmentalData } from '../services/openMeteo';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { AQIDial } from '../components/common/AQIDial';
import { CPCBBadge } from '../components/common/CPCBBadge';
import { CitySelector } from '../components/common/CitySelector';
import { DashboardSkeleton } from '../components/common/Skeleton';
import { getCPCBColorDetails } from '../utils/cpcbAqi';

interface DashboardPageProps {
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  currentCity,
  onSelectCity,
}) => {
  const { t, i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const [selectedChartPollutant, setSelectedChartPollutant] = useState<'aqi' | 'pm25' | 'pm10' | 'temperature'>('aqi');

  // TanStack Query for caching and live fetching
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['liveEnvironmentalData', currentCity.lat, currentCity.lon],
    queryFn: () => fetchLiveEnvironmentalData(currentCity),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <Card className="p-8 text-center space-y-4 max-w-xl mx-auto border-rose-500/30">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 mx-auto flex items-center justify-center">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
          Failed to fetch Open-Meteo telemetry
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          {(error as Error)?.message || 'Network timeout or API rate limit. Please check your internet connection.'}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-500 transition-colors inline-flex items-center gap-2"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>{t('dashboard.retryButton')}</span>
        </button>
      </Card>
    );
  }

  const { cpcbAqi, weather, rawPollutants, hourly48h, lastUpdated, source, isStale, isDemo } = data;
  const colorDetails = getCPCBColorDetails(cpcbAqi.category);

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* 1. TOP HEADER & CITY SELECTOR */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-5 rounded-3xl bg-white dark:bg-[#111c19] border border-slate-200 dark:border-emerald-950 shadow-sm">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {t('dashboard.title')}
            </span>
            {isStale && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                {t('dashboard.staleBadge')}
              </span>
            )}
            {isDemo && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                {t('dashboard.demoBadge')}
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            {currentCity.name}, {currentCity.state || currentCity.country}
          </h2>
          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-emerald-500" />
              {t('dashboard.lastUpdated')}: <b className="text-slate-600 dark:text-slate-300 font-mono">{lastUpdated}</b>
            </span>
            <span>•</span>
            <span className="truncate max-w-[200px]">
              {t('dashboard.source')}: <b className="text-slate-600 dark:text-slate-300">{source}</b>
            </span>
          </div>
        </div>

        {/* City Selector and Refresh Trigger */}
        <div className="flex items-center gap-2">
          <CitySelector currentCity={currentCity} onSelectCity={onSelectCity} />

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-black/30 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-emerald-500/50 transition-colors disabled:opacity-60"
            title="Refresh Live Data"
            aria-label="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 text-emerald-500 ${isFetching ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* 2. PRIMARY CPCB AQI HERO & WEATHER ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Official CPCB AQI Dial Card */}
        <Card className="lg:col-span-5 p-6 flex flex-col justify-between border-emerald-500/30">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-emerald-950">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t('dashboard.cpcbAqiTitle')} (NAQI)
              </span>
              <CPCBBadge category={cpcbAqi.category} aqiValue={cpcbAqi.aqi} size="sm" />
            </div>

            {/* Gauge */}
            <AQIDial
              aqi={cpcbAqi.aqi}
              category={cpcbAqi.category}
              dominantPollutant={cpcbAqi.dominantPollutant}
            />

            {/* CPCB Health Statement */}
            <div
              className="mt-4 p-3.5 rounded-2xl border text-xs leading-relaxed"
              style={{
                backgroundColor: colorDetails.bgLight,
                borderColor: `${colorDetails.color}35`,
                color: colorDetails.textColor,
              }}
            >
              <p className="font-bold flex items-center gap-1.5 mb-1">
                <Info className="w-3.5 h-3.5 shrink-0" />
                <span>CPCB Health Advisory</span>
              </p>
              <p className="text-[11px]">
                {isHindi ? cpcbAqi.healthStatementHi : cpcbAqi.healthStatement}
              </p>
            </div>
          </div>

          {/* Quick Sub-Indices Strip */}
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-emerald-950">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Key Sub-Indices (Max defines AQI)
            </span>
            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans block">PM2.5</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {cpcbAqi.subIndices['PM2.5']?.subIndex ?? '--'}
                </span>
                <span className="text-[9px] text-slate-400 block font-sans">
                  {rawPollutants.pm25?.toFixed(1)} µg
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans block">PM10</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {cpcbAqi.subIndices['PM10']?.subIndex ?? '--'}
                </span>
                <span className="text-[9px] text-slate-400 block font-sans">
                  {rawPollutants.pm10?.toFixed(1)} µg
                </span>
              </div>
              <div className="p-2 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] text-slate-400 font-sans block">NO2</span>
                <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {cpcbAqi.subIndices['NO2']?.subIndex ?? '--'}
                </span>
                <span className="text-[9px] text-slate-400 block font-sans">
                  {rawPollutants.no2?.toFixed(1)} µg
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: Live Weather Telemetry Cards */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <StatCard
            label={t('dashboard.temperature')}
            value={weather.temperature.toFixed(1)}
            unit="°C"
            icon={Thermometer}
            subtext={`${t('dashboard.feelsLike')}: ${weather.apparentTemperature.toFixed(1)}°C`}
            lastUpdated={lastUpdated}
            isStale={isStale}
            accentColor="#10b981"
          />

          <StatCard
            label={t('dashboard.humidity')}
            value={weather.humidity}
            unit="%"
            icon={Droplets}
            subtext={weather.humidity > 70 ? 'High Moisture' : 'Comfortable'}
            lastUpdated={lastUpdated}
            isStale={isStale}
            accentColor="#0284c7"
          />

          <StatCard
            label={t('dashboard.wind')}
            value={weather.windSpeed.toFixed(1)}
            unit="km/h"
            icon={Wind}
            subtext={`Heading: ${weather.windDirectionCompass} (${weather.windDirection}°)`}
            lastUpdated={lastUpdated}
            isStale={isStale}
            accentColor="#8b5cf6"
          />

          <StatCard
            label={t('dashboard.precipitation')}
            value={weather.precipitation}
            unit="mm"
            icon={CloudRain}
            subtext={weather.precipitation > 0 ? 'Active Rainfall' : 'Clear Precipitation'}
            lastUpdated={lastUpdated}
            isStale={isStale}
            accentColor="#0ea5e9"
          />

          <StatCard
            label={t('dashboard.pressure')}
            value={weather.pressure}
            unit="hPa"
            icon={Gauge}
            subtext="Atmospheric Barometer"
            lastUpdated={lastUpdated}
            isStale={isStale}
            accentColor="#14b8a6"
          />

          <StatCard
            label={t('dashboard.dominantPollutant')}
            value={cpcbAqi.dominantPollutant}
            icon={Activity}
            subtext={`Sub-Index: ${cpcbAqi.aqi}`}
            lastUpdated={lastUpdated}
            isStale={isStale}
            accentColor={colorDetails.color}
          />
        </div>
      </div>

      {/* 3. DETAILED 6 POLLUTANTS BREAKDOWN TABLE */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-emerald-950">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span>{t('dashboard.subIndicesBreakdown')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Live concentrations converted to Indian CPCB sub-index scores.
            </p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-300">
            CPCB NAQI 2014 Framework
          </span>
        </div>

        <div className="overflow-x-auto mt-4">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-sans">
                <th className="pb-2.5 font-bold">Pollutant Name</th>
                <th className="pb-2.5 font-bold">Concentration</th>
                <th className="pb-2.5 font-bold">Unit</th>
                <th className="pb-2.5 font-bold">CPCB Sub-Index</th>
                <th className="pb-2.5 font-bold">Category</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-sans">
              {(['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3'] as const).map((polKey) => {
                const sub = cpcbAqi.subIndices[polKey];
                const isDominant = cpcbAqi.dominantPollutant === polKey;

                return (
                  <tr key={polKey} className={`hover:bg-slate-50/50 dark:hover:bg-black/20 ${isDominant ? 'bg-emerald-500/5' : ''}`}>
                    <td className="py-3 font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                      <span>{t(`pollutants.${polKey}`)}</span>
                      {isDominant && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-emerald-500 text-white font-mono">
                          DOMINANT
                        </span>
                      )}
                    </td>
                    <td className="py-3 font-mono font-bold text-slate-800 dark:text-slate-200">
                      {sub ? sub.concentration.toFixed(2) : '--'}
                    </td>
                    <td className="py-3 text-slate-400 text-xs">
                      {sub ? sub.unit : 'µg/m³'}
                    </td>
                    <td className="py-3 font-mono font-bold">
                      <span className="text-sm" style={{ color: sub ? getCPCBColorDetails(sub.category).color : '#94a3b8' }}>
                        {sub ? sub.subIndex : '--'}
                      </span>
                    </td>
                    <td className="py-3">
                      {sub ? (
                        <CPCBBadge category={sub.category} size="sm" showDot={false} />
                      ) : (
                        <span className="text-slate-400">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* 4. 48-HOUR INTERACTIVE FORECAST CHART (RECHARTS) */}
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-emerald-950">
          <div>
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-500" />
              <span>{t('dashboard.trend48hTitle')}</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('dashboard.trendSubtitle')}
            </p>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-black/30 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setSelectedChartPollutant('aqi')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedChartPollutant === 'aqi' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              CPCB AQI
            </button>
            <button
              onClick={() => setSelectedChartPollutant('pm25')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedChartPollutant === 'pm25' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              PM2.5 (µg/m³)
            </button>
            <button
              onClick={() => setSelectedChartPollutant('pm10')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedChartPollutant === 'pm10' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              PM10 (µg/m³)
            </button>
            <button
              onClick={() => setSelectedChartPollutant('temperature')}
              className={`px-3 py-1 rounded-lg transition-colors ${
                selectedChartPollutant === 'temperature' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Temp (°C)
            </button>
          </div>
        </div>

        {/* Recharts Area Chart */}
        <div className="mt-6 h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={hourly48h} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={colorDetails.color} stopOpacity={0.4} />
                  <stop offset="95%" stopColor={colorDetails.color} stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="hour" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f1715',
                  borderColor: '#059669',
                  borderRadius: '0.75rem',
                  color: '#fff',
                  fontSize: '11px',
                }}
              />
              <Area
                type="monotone"
                dataKey={selectedChartPollutant}
                stroke={colorDetails.color}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#chartFill)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* 5. HEALTH RECOMMENDATIONS BY DEMOGRAPHIC */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 border-l-4 border-emerald-500 space-y-2">
          <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t('dashboard.generalPublic')}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {cpcbAqi.aqi > 200
              ? 'Avoid prolonged outdoor exertion. Wear an N95 respirator mask when commuting in congested traffic.'
              : 'Ideal conditions for normal outdoor walks, sports, and ventilation.'}
          </p>
        </Card>

        <Card className="p-5 border-l-4 border-amber-500 space-y-2">
          <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-bold text-xs">
            <HeartPulse className="w-4 h-4" />
            <span>{t('dashboard.sensitiveGroups')}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {cpcbAqi.aqi > 100
              ? 'Children and elderly should stay indoors during morning and late evening inversion hours.'
              : 'Safe for children play and elder walks during daytime hours.'}
          </p>
        </Card>

        <Card className="p-5 border-l-4 border-orange-500 space-y-2">
          <div className="flex items-center gap-1.5 text-orange-700 dark:text-orange-400 font-bold text-xs">
            <ShieldAlert className="w-4 h-4" />
            <span>{t('dashboard.outdoorWorkers')}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {cpcbAqi.aqi > 200
              ? 'Mandate periodic rest periods in shaded/filtered shelters. Hydrate frequently.'
              : 'Standard work shifts approved. Maintain water hydration.'}
          </p>
        </Card>

        <Card className="p-5 border-l-4 border-rose-500 space-y-2">
          <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold text-xs">
            <Trees className="w-4 h-4" />
            <span>{t('dashboard.respiratoryAsthma')}</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            {cpcbAqi.aqi > 150
              ? 'Keep quick-relief inhalers accessible at all times. Use indoor HEPA filtration.'
              : 'Normal medication schedule. Monitor daily air fluctuations.'}
          </p>
        </Card>
      </div>
    </div>
  );
};
