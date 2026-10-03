import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  Globe, 
  BarChart3, 
  Home, 
  MapPin, 
  Leaf
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { CityLocation } from '../../services/openMeteo';

interface NavbarProps {
  currentCity: CityLocation;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentCity,
  darkMode,
  toggleDarkMode,
}) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const toggleLanguage = () => {
    const nextLang = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(nextLang);
    localStorage.setItem('scg_language', nextLang);
  };

  const navLinks = [
    { to: '/', label: t('nav.landing'), icon: Home },
    { to: '/dashboard', label: t('nav.dashboard'), icon: BarChart3 },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-[#0b1311]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-emerald-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-forest-900 via-emerald-600 to-lime-500 text-white shadow-eco-sm group-hover:scale-105 transition-transform">
                {/* Custom Leaf + Shield SVG */}
                <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M12 8c2.5 0 4 1.5 4 4s-1.5 4-4 4" strokeDasharray="2 2" />
                  <path d="M8 12c0-2 2-4 4-4" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-lime-400 rounded-full border-2 border-white dark:border-[#0b1311]"></span>
              </div>
              <div>
                <span className="text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-forest-900 via-emerald-700 to-lime-600 dark:from-white dark:via-emerald-300 dark:to-lime-400 bg-clip-text text-transparent">
                  Smart Climate Guardian
                </span>
                <span className="hidden sm:block text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  CPCB NAQI & Climate Intelligence
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1.5 bg-slate-100/80 dark:bg-[#111c19] p-1 rounded-2xl border border-slate-200/80 dark:border-emerald-950/60">
              {navLinks.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.to;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Action Tools: City badge, Language, Theme */}
            <div className="flex items-center gap-2">
              {/* City Pill */}
              <Link
                to="/dashboard"
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800/50 text-xs font-bold"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                <span>{currentCity.name}</span>
                {currentCity.name === 'Bhopal' && (
                  <span className="text-[10px] px-1 py-0.2 rounded bg-emerald-200/60 dark:bg-emerald-800/60 font-mono">
                    Default Hub
                  </span>
                )}
              </Link>

              {/* Language Switcher */}
              <button
                onClick={toggleLanguage}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-[#111c19] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-emerald-950 text-xs font-bold hover:border-emerald-500/50 transition-colors"
                title="Switch Language (English / हिन्दी)"
                aria-label="Toggle Language"
              >
                <Globe className="w-3.5 h-3.5 text-emerald-500" />
                <span>{i18n.language === 'hi' ? 'EN' : 'हिन्दी'}</span>
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#111c19] text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-emerald-950 hover:border-emerald-500/50 transition-colors"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-[#0b1311]/95 backdrop-blur-md border-t border-slate-200 dark:border-emerald-950 px-6 py-2 flex items-center justify-around shadow-lg">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl text-[11px] font-bold transition-all ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                  : 'text-slate-500 dark:text-slate-400'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
};
