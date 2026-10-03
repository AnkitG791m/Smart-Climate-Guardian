import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Navigation, 
  X, 
  Loader2, 
  ShieldCheck, 
  Sparkles, 
  SlidersHorizontal 
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CityLocation, searchCities } from '../../services/openMeteo';
import { soundService } from '../../services/soundService';

interface FloatingSearchBarProps {
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  onLocateMe: () => void;
  isLocating: boolean;
  onOpenAlerts: () => void;
  activeAlertsCount: number;
}

const QUICK_CITIES: CityLocation[] = [
  { id: 9001, name: 'MP Nagar', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2330, lon: 77.4325 },
  { id: 9002, name: 'TT Nagar', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2370, lon: 77.4010 },
  { id: 9003, name: 'Arera Colony', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2120, lon: 77.4350 },
  { id: 9004, name: 'Kolar Road', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.1850, lon: 77.4210 },
  { id: 9005, name: 'Shahpura Lake', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2050, lon: 77.4240 },
  { name: 'Bhopal Central', state: 'Madhya Pradesh', country: 'India', countryCode: 'IN', lat: 23.2599, lon: 77.4126 },
  { name: 'Indore', state: 'Madhya Pradesh', country: 'India', countryCode: 'IN', lat: 22.7196, lon: 75.8577 },
  { name: 'Delhi', state: 'Delhi NCR', country: 'India', countryCode: 'IN', lat: 28.6139, lon: 77.2090 },
];

export const FloatingSearchBar: React.FC<FloatingSearchBarProps> = ({
  currentCity,
  onSelectCity,
  onLocateMe,
  isLocating,
  onOpenAlerts,
  activeAlertsCount,
}) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CityLocation[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global keyboard shortcut to focus search: '/' or 'Cmd+K' / 'Ctrl+K'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in another input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        if (e.key === 'Escape') {
          setIsOpen(false);
          inputRef.current?.blur();
        }
        return;
      }

      if (e.key === '/' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        inputRef.current?.focus();
        inputRef.current?.select();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchCities(query);
        setResults(res);
        setIsOpen(true);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="absolute top-4 left-4 z-30 max-w-sm sm:max-w-md w-[calc(100vw-2rem)]" ref={searchRef}>
      {/* Primary Google Maps-style Search Pill */}
      <div className="glass-panel rounded-2xl shadow-2xl p-1.5 flex items-center gap-2 border border-slate-200/90 dark:border-blue-900/60 transition-all duration-300 hover:border-[#2F80ED]/60">
        {/* Brand Shield Logo */}
        <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-[#2F80ED] to-blue-700 text-white shadow-sky-sm shrink-0">
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8c2.5 0 4 1.5 4 4s-1.5 4-4 4" strokeDasharray="2 2" />
            <path d="M8 12c0-2 2-4 4-4" />
          </svg>
        </div>

        {/* Input Field */}
        <div className="flex-1 relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search MP Nagar, TT Nagar, Arera Colony, local area..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true);
              if (results.length > 0) setIsOpen(true);
            }}
            onBlur={() => setIsFocused(false)}
            className="w-full bg-transparent px-2 py-1.5 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          {isSearching && (
            <Loader2 className="w-4 h-4 text-emerald-500 animate-spin mr-1 shrink-0" />
          )}
          {!query && !isFocused && (
            <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono font-medium text-slate-400 border border-slate-300 dark:border-emerald-900/60 mr-1.5 select-none shrink-0">
              ⌘K
            </span>
          )}
          {query && (
            <button
              onClick={() => { setQuery(''); setResults([]); setIsOpen(false); inputRef.current?.focus(); }}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* GPS Locate Me Button */}
        <button
          onClick={onLocateMe}
          disabled={isLocating}
          title="Detect Current GPS Location"
          className="p-2 rounded-xl bg-slate-100 dark:bg-[#111c19] text-slate-700 dark:text-slate-200 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 transition-colors shrink-0 disabled:opacity-50"
        >
          {isLocating ? (
            <Loader2 className="w-4 h-4 text-emerald-500 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          )}
        </button>

        {/* Alert Bell Button */}
        <button
          onClick={onOpenAlerts}
          title="Emergency Alert Center"
          className="relative p-2 rounded-xl bg-slate-100 dark:bg-[#111c19] text-slate-700 dark:text-slate-200 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors shrink-0"
        >
          <span className="text-base">🚨</span>
          {activeAlertsCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-black flex items-center justify-center animate-pulse">
              {activeAlertsCount}
            </span>
          )}
        </button>
      </div>

      {/* Autocomplete Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="mt-2 glass-panel rounded-2xl shadow-2xl p-2 border border-slate-200 dark:border-emerald-800/80 max-h-56 overflow-y-auto animate-fadeIn">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1 block">
            Locations Found
          </span>
          {results.map((loc, idx) => (
            <button
              key={`${loc.lat}-${loc.lon}-${idx}`}
              onClick={() => {
                soundService.playClick();
                onSelectCity(loc);
                setIsOpen(false);
                setQuery('');
              }}
              className="w-full text-left p-2 rounded-xl hover:bg-slate-100/90 dark:hover:bg-emerald-950/50 flex items-center justify-between text-xs transition-colors"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-bold text-slate-900 dark:text-white">{loc.name}</span>
                  <span className="text-[11px] text-slate-400 ml-1">
                    {loc.state ? `${loc.state}, ` : ''}{loc.country}
                  </span>
                </div>
              </div>
              {loc.id && Number(loc.id) >= 9000 ? (
                <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                  Local Sector
                </span>
              ) : (
                <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  {loc.lat.toFixed(2)}°, {loc.lon.toFixed(2)}°
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Quick City Navigation Chips */}
      <div className="flex items-center gap-1.5 mt-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_CITIES.map((c) => {
          const isSelected = currentCity.name === c.name;
          return (
            <button
              key={c.name}
              onClick={() => {
                soundService.playClick();
                onSelectCity(c);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all shadow-sm backdrop-blur-md shrink-0 flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-[#2F80ED] text-white shadow-md'
                  : 'bg-white/90 dark:bg-[#131d2e]/90 text-slate-700 dark:text-slate-200 hover:text-[#2F80ED] border border-slate-200/80 dark:border-blue-900/40'
              }`}
            >
              <MapPin className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#2F80ED]'}`} />
              <span>{c.name}</span>
              {c.name === 'Bhopal' && (
                <span className="text-[9px] px-1 py-0.2 rounded bg-black/20 text-white font-mono">
                  Hub
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
