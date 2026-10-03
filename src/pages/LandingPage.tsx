import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  ShieldCheck, 
  ArrowRight, 
  Wind, 
  Thermometer, 
  Sparkles, 
  CheckCircle2, 
  MapPin, 
  Activity, 
  Globe2, 
  Leaf,
  Layers,
  HeartPulse,
  Compass
} from 'lucide-react';
import { CityLocation } from '../services/openMeteo';
import { Card } from '../components/common/Card';

interface LandingPageProps {
  currentCity: CityLocation;
}

export const LandingPage: React.FC<LandingPageProps> = ({ currentCity }) => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const next = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(next);
    localStorage.setItem('scg_language', next);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#091210] text-slate-800 dark:text-slate-100 selection:bg-emerald-500 selection:text-white pb-20">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-white/70 dark:bg-[#091210]/70 border-b border-slate-200/80 dark:border-emerald-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-forest-900 to-emerald-600 text-white flex items-center justify-center shadow-eco-sm">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm text-slate-900 dark:text-white tracking-tight block">Smart Climate Guardian</span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono block -mt-0.5">Bhopal & Central India</span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleLanguage}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-500 transition-colors border border-slate-200 dark:border-emerald-900"
            >
              {i18n.language === 'hi' ? 'English' : 'हिन्दी'}
            </button>

            <Link
              to="/"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-eco-sm transition-all"
            >
              <Compass className="w-4 h-4" />
              <span>Full-Screen GIS Map</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-14">
        {/* 1. HERO SECTION */}
        <section className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-emerald-950/10 via-transparent to-transparent p-6 sm:p-12 lg:p-16 border border-emerald-500/20 shadow-eco-lg">
          {/* Ambient atmospheric gradients */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 bg-gradient-to-br from-emerald-500/20 via-lime-500/10 to-transparent rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-80 h-80 bg-forest-900/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Mission & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                <span>{t('hero.badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.12]">
                {t('hero.titlePart1')}{' '}
                <span className="bg-gradient-to-r from-forest-700 via-emerald-600 to-lime-500 bg-clip-text text-transparent">
                  {t('hero.titlePart2')}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl font-normal">
                {t('hero.subtitle')}
              </p>

              {/* City Hub Tag */}
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <span>{t('hero.defaultCityLabel')}</span>
                <span className="inline-flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 px-2.5 py-1 rounded-lg bg-white dark:bg-[#111c19] border border-slate-200 dark:border-emerald-900">
                  <MapPin className="w-3.5 h-3.5 text-emerald-500" />
                  {currentCity.name}, {currentCity.state || 'Madhya Pradesh'}, India
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/"
                  className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-forest-800 hover:from-emerald-500 hover:to-forest-700 text-white font-extrabold text-sm shadow-eco-md transition-all transform hover:-translate-y-0.5"
                >
                  <span>{t('hero.ctaDashboard')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          {/* Right Column: Hero Spotlight Card */}
          <div className="lg:col-span-5">
            <Card variant="glass" className="p-6 sm:p-7 border-emerald-500/30 relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200/80 dark:border-emerald-950">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300">
                    Live Telemetry Spotlight
                  </span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  Bhopal, MP
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                    Central Madhya Pradesh Monitoring Hub
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Continuous Open-Meteo telemetry processed with Indian CPCB NAQI algorithm.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Pollutant Standard</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                      Indian CPCB
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">6 Pollutant Bands</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Forecast Window</span>
                    <span className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5 block">
                      48 Hours
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Hourly Granularity</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-200">
                  <p className="font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    Bilingual Platform (हिन्दी / English)
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed opacity-90">
                    Full interface localization with Indian national health guidance tailored for general citizens and vulnerable groups.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* 2. STATS BAR */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-l-4 border-emerald-500">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Target Coverage</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {t('hero.statsProtected')}
          </p>
          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Madhya Pradesh & Nationwide
          </p>
        </Card>

        <Card className="p-5 border-l-4 border-lime-500">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Data Stream</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {t('hero.statsSensors')}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Open-Meteo Air Quality & Weather API
          </p>
        </Card>

        <Card className="p-5 border-l-4 border-amber-500">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Algorithmic Standard</p>
          <p className="text-2xl font-black text-slate-900 dark:text-white font-mono mt-1">
            {t('hero.statsAccuracy')}
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5" /> Max Sub-Index Method
          </p>
        </Card>
      </section>

      {/* 3. FOUR CORE CAPABILITIES */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Comprehensive Climate Resilience Engine
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Engineered with strict environmental standards, real-time API integrations, and community defense mechanisms.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="p-6 space-y-3 group hover:border-emerald-500/50">
            <div className="w-11 h-11 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Wind className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Indian CPCB AQI Calculation
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Computes official sub-indices for PM2.5, PM10, NO2, SO2, CO, and O3 to extract the true dominant pollutant and official category (Good to Severe).
            </p>
          </Card>

          <Card className="p-6 space-y-3 group hover:border-emerald-500/50">
            <div className="w-11 h-11 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Thermometer className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Live Weather & Atmospheric Physics
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Monitors ambient temperature, heat index (feels like), relative humidity, wind vector, barometric pressure, and precipitation rate from Open-Meteo.
            </p>
          </Card>

          <Card className="p-6 space-y-3 group hover:border-emerald-500/50">
            <div className="w-11 h-11 rounded-2xl bg-sky-100 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Demographic Health Guidance
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Personalized precautions for outdoor laborers, active children, the elderly, and asthma/respiratory patients aligned with Indian national health guidelines.
            </p>
          </Card>
        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="rounded-3xl bg-slate-100/70 dark:bg-[#111c19] p-8 sm:p-12 border border-slate-200/80 dark:border-emerald-950">
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white text-center mb-8">
          How Smart Climate Guardian Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center mx-auto text-sm">
              1
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Live Data Ingestion</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Polls Open-Meteo Air Quality & Weather APIs for current and 48-hour forecasted concentrations.
            </p>
          </div>

          <div className="space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center mx-auto text-sm">
              2
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">CPCB NAQI Standardization</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Transforms raw µg/m³ values into statutory Indian air quality sub-indices and identifies the dominant pollutant.
            </p>
          </div>

          <div className="space-y-2 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-600 text-white font-mono font-bold flex items-center justify-center mx-auto text-sm">
              3
            </div>
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Resilience & Action</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Delivers actionable health advisories, trends, and risk analysis in English and Hindi.
            </p>
          </div>
        </div>
      </section>

      {/* 5. GROUND TRUTH FIELD PHOTOGRAPHY SHOWCASE (USER REAL IMAGES) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>On-Ground Evidence & Incident Verification</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Human-Crafted Environmental Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real field photography combining NASA FIRMS satellite thermal detection with community ground-truth confirmation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Wildfire / Crop Burning Active Dousing */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-emerald-950 bg-white dark:bg-[#111c19] shadow-eco-md flex flex-col justify-between group">
            <div className="relative h-64 overflow-hidden bg-slate-900">
              <img
                src="/images/wildfire-citizen-action.png"
                alt="Community responder actively dousing roadside flare"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-600/90 text-white backdrop-blur-md border border-white/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                  Ground Zero Emergency
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-slate-200 backdrop-blur-md">
                  Kolar Bypass, Bhopal
                </span>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white text-xs">
                <span className="font-mono text-[10px] opacity-80">GPS 23.1680° N, 77.4190° E • Verified 14m ago</span>
              </div>
            </div>

            <div className="p-5 space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Active Stubble & Brush Suppression Brigade
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Local volunteer dousing roadside agricultural burn with water bucket before fire dispatch arrived. Cross-referenced with NASA VIIRS satellite thermal alert #FIRMS-334K.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Status: Dispatched & Suppressed</span>
                <span className="text-emerald-500 font-bold">28 Corroborations</span>
              </div>
            </div>
          </div>

          {/* Card 2: Smog Haze Inversion */}
          <div className="rounded-3xl overflow-hidden border border-slate-200 dark:border-emerald-950 bg-white dark:bg-[#111c19] shadow-eco-md flex flex-col justify-between group">
            <div className="relative h-64 overflow-hidden bg-slate-900">
              <img
                src="/images/smog-haze-city.png"
                alt="Urban Particulate Inversion Over Skyline"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-600/90 text-white backdrop-blur-md border border-white/20 flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  Thermal Inversion
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-slate-200 backdrop-blur-md">
                  CPCB Station Cam
                </span>
              </div>
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white text-xs">
                <span className="font-mono text-[10px] opacity-80">Upper Lake Elevated Inversion • Optical Depth 0.82</span>
              </div>
            </div>

            <div className="p-5 space-y-2">
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                Urban Basin Particulate Stagnation
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Fine PM2.5 and PM10 particles trapped under 180-meter atmospheric boundary ceiling. Real optical cameras verify low horizontal visibility across city sectors.
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>NAQI Index: 142 (Moderate)</span>
                <span className="text-amber-500 font-bold">Inversion Trapped</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. CTA BAR */}
      <section className="text-center p-8 rounded-3xl bg-gradient-to-r from-emerald-600 to-forest-800 text-white shadow-eco-md space-y-4">
        <h3 className="text-2xl sm:text-3xl font-black">Ready to inspect live atmospheric telemetry?</h3>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto">
          Access the real-time CPCB AQI dial, weather indicators, and 48-hour hourly pollutant projections for Bhopal and other Indian cities.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-emerald-950 font-extrabold text-sm hover:bg-emerald-50 transition-colors shadow-lg"
        >
          <span>Launch Live Dashboard</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </section>
      </div>
    </div>
  );
};
