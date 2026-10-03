import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Check, Loader2, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CityLocation, DEFAULT_CITY, searchCities } from '../../services/openMeteo';

interface CitySelectorProps {
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
}

const POPULAR_INDIAN_CITIES: CityLocation[] = [
  { name: 'Bhopal', state: 'Madhya Pradesh', country: 'India', countryCode: 'IN', lat: 23.2599, lon: 77.4126 },
  { name: 'Indore', state: 'Madhya Pradesh', country: 'India', countryCode: 'IN', lat: 22.7196, lon: 75.8577 },
  { name: 'Delhi', state: 'Delhi NCR', country: 'India', countryCode: 'IN', lat: 28.6139, lon: 77.2090 },
  { name: 'Mumbai', state: 'Maharashtra', country: 'India', countryCode: 'IN', lat: 19.0760, lon: 72.8777 },
  { name: 'Bengaluru', state: 'Karnataka', country: 'India', countryCode: 'IN', lat: 12.9716, lon: 77.5946 },
  { name: 'Lucknow', state: 'Uttar Pradesh', country: 'India', countryCode: 'IN', lat: 26.8467, lon: 80.9462 },
];

export const CitySelector: React.FC<CitySelectorProps> = ({
  currentCity,
  onSelectCity,
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search on Open-Meteo Geocoding API
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchCities(searchQuery);
        setSearchResults(results);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Handle browser geolocation
  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const userLoc: CityLocation = {
          name: 'My GPS Location',
          state: 'Local Area',
          country: 'India',
          countryCode: 'IN',
          lat: +pos.coords.latitude.toFixed(4),
          lon: +pos.coords.longitude.toFixed(4),
        };
        onSelectCity(userLoc);
        setIsOpen(false);
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        alert('Could not determine your GPS location. Please check browser permissions.');
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* City Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white dark:bg-[#111c19] border border-slate-200 dark:border-emerald-950/80 shadow-sm hover:border-emerald-500/50 transition-all text-xs font-semibold text-slate-800 dark:text-slate-100"
        aria-label="Select City or Location"
      >
        <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        <span className="font-bold">{currentCity.name}</span>
        {currentCity.state && (
          <span className="text-slate-400 hidden sm:inline">({currentCity.state})</span>
        )}
      </button>

      {/* Popover Modal */}
      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white dark:bg-[#0f1715] border border-slate-200 dark:border-emerald-900/60 shadow-2xl p-4 z-50 animate-fadeIn">
          {/* Geolocation Button */}
          <button
            onClick={handleGeolocation}
            disabled={isLocating}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors mb-3 disabled:opacity-60"
          >
            {isLocating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Navigation className="w-3.5 h-3.5" />}
            <span>{isLocating ? 'Detecting GPS...' : t('dashboard.useMyLocation')}</span>
          </button>

          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t('dashboard.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 dark:bg-black/40 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-8 py-2 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
              autoFocus
            />
            {isSearching && (
              <Loader2 className="w-3.5 h-3.5 text-emerald-500 animate-spin absolute right-3 top-2.5" />
            )}
          </div>

          {/* Live Search Results */}
          {searchResults.length > 0 && (
            <div className="mt-3 max-h-48 overflow-y-auto space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1">Search Results</span>
              {searchResults.map((city, idx) => (
                <button
                  key={`${city.lat}-${city.lon}-${idx}`}
                  onClick={() => {
                    onSelectCity(city);
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                  className="w-full text-left p-2 rounded-xl text-xs hover:bg-slate-100 dark:hover:bg-emerald-950/40 flex items-center justify-between transition-colors"
                >
                  <div>
                    <span className="font-bold text-slate-800 dark:text-slate-200">{city.name}</span>
                    <span className="text-[11px] text-slate-400 ml-1">
                      {city.state ? `${city.state}, ` : ''}{city.country}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                    {city.lat.toFixed(2)}°, {city.lon.toFixed(2)}°
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Popular Cities in India */}
          <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-1 mb-1 block">
              Default & Major Indian Hubs
            </span>
            <div className="grid grid-cols-2 gap-1.5 mt-1.5">
              {POPULAR_INDIAN_CITIES.map((c) => {
                const isSelected = currentCity.name === c.name;
                return (
                  <button
                    key={c.name}
                    onClick={() => {
                      onSelectCity(c);
                      setIsOpen(false);
                      setSearchQuery('');
                    }}
                    className={`text-left p-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-emerald-500 text-white font-bold'
                        : 'bg-slate-50 dark:bg-[#152320] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-emerald-950/60'
                    }`}
                  >
                    <span>{c.name}</span>
                    {c.name === 'Bhopal' && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 text-white font-mono">
                        Default
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
