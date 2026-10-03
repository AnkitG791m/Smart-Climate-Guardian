import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Radio, 
  Flame, 
  Volume2, 
  VolumeX, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  PlusCircle, 
  BarChart3, 
  Globe2, 
  AlertTriangle, 
  Users, 
  Building2,
  Activity
} from 'lucide-react';
import { useClimate, NavigationTab } from '../../context/ClimateContext';

export const Header: React.FC = () => {
  const {
    stations,
    currentStation,
    selectStation,
    isStreaming,
    toggleStreaming,
    darkMode,
    toggleDarkMode,
    audioMuted,
    toggleAudioMuted,
    activeTab,
    setActiveTab,
    setIsReportModalOpen,
    setIsScenarioModalOpen,
    alerts
  } = useClimate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: NavigationTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'overview', label: 'Overview', icon: Globe2 },
    { id: 'dashboard', label: 'Live Dashboard', icon: BarChart3 },
    { id: 'map', label: 'GIS Risk Map', icon: MapPin },
    { id: 'risks', label: 'Hazard Engines', icon: Activity },
    { id: 'citizen', label: 'Citizen Hub', icon: Users },
    { id: 'alerts', label: 'Alert Center', icon: AlertTriangle },
    { id: 'authority', label: 'Authority Oversight', icon: Building2 },
  ];

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged).length;

  return (
    <header className="sticky top-0 z-50 glass-panel-elevated border-b border-emerald-900/10 dark:border-emerald-500/15">
      {/* Top micro-bar for live threats ticker */}
      <div className="bg-forest-900 text-emerald-200 text-xs px-4 py-1.5 flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 font-mono">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white uppercase tracking-wider">Planetary Defense Grid:</span>
          <span className="hidden sm:inline text-emerald-300">
            5 Stations Monitored • {unacknowledgedAlerts > 0 ? `${unacknowledgedAlerts} High-Priority Threat Broadcasts Active` : 'All Systems Nominal'}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <button 
            onClick={toggleStreaming}
            className="flex items-center gap-1.5 text-emerald-300 hover:text-white transition-colors"
            title={isStreaming ? 'Pause live simulation' : 'Resume live simulation'}
          >
            <Radio className={`w-3.5 h-3.5 ${isStreaming ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="hidden md:inline">{isStreaming ? 'Streaming Live' : 'Simulation Paused'}</span>
          </button>
          <span className="text-forest-700 hidden sm:inline">•</span>
          <span className="text-emerald-300/80 font-mono hidden md:inline">ISO 14001 / WHO Certified</span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-forest-800 text-white shadow-eco-glow">
              <ShieldCheck className="w-6 h-6 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-lime-400 rounded-full border-2 border-white dark:border-obsidian-950 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-forest-900 via-emerald-700 to-lime-600 dark:from-white dark:via-emerald-300 dark:to-lime-400 bg-clip-text text-transparent">
                  Smart Climate Guardian
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700/50">
                  PRO
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                Environmental Intelligence & Resilience
              </p>
            </div>
          </div>

          {/* Station Selector Dropdown */}
          <div className="hidden lg:flex items-center gap-2 bg-slate-100/80 dark:bg-obsidian-850 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-emerald-900/40">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <select
              value={currentStation.id}
              onChange={(e) => selectStation(e.target.value)}
              className="bg-transparent text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer pr-2"
            >
              {stations.map(st => (
                <option key={st.id} value={st.id} className="bg-white dark:bg-obsidian-900 text-slate-800 dark:text-slate-200">
                  {st.name} ({st.country})
                </option>
              ))}
            </select>
            <span className="text-[11px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
              AQI {currentStation.airQuality.aqi}
            </span>
          </div>

          {/* Desktop Navigation Tabs */}
          <nav className="hidden xl:flex items-center gap-1">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-emerald-500 text-white shadow-eco-sm'
                      : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-100 dark:hover:bg-obsidian-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                  {item.id === 'alerts' && unacknowledgedAlerts > 0 && (
                    <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-red-500 text-white font-bold animate-pulse">
                      {unacknowledgedAlerts}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Actions & Utility controls */}
          <div className="flex items-center gap-2">
            {/* Scenario Simulator Modal trigger */}
            <button
              onClick={() => setIsScenarioModalOpen(true)}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-colors"
              title="Test crisis scenarios like Wildfire Smoke or Flash Flood"
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulate Hazard</span>
            </button>

            {/* Citizen Report Button */}
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 to-forest-700 hover:from-emerald-500 hover:to-forest-600 text-white shadow-eco-sm transition-all transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Report Incident</span>
            </button>

            {/* Audio Toggle */}
            <button
              onClick={toggleAudioMuted}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
              title={audioMuted ? 'Unmute Emergency Chimes' : 'Mute Emergency Chimes'}
            >
              {audioMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
            </button>

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* Mobile Hamburger toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-obsidian-800 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass-panel-elevated border-b border-slate-200 dark:border-emerald-950 px-4 pt-2 pb-5 space-y-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Monitoring Station</label>
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-obsidian-900 p-2 rounded-xl">
              <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
              <select
                value={currentStation.id}
                onChange={(e) => {
                  selectStation(e.target.value);
                  setMobileMenuOpen(false);
                }}
                className="w-full bg-transparent text-sm font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {stations.map(st => (
                  <option key={st.id} value={st.id} className="bg-white dark:bg-obsidian-900">
                    {st.name} ({st.country})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-2">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-100 dark:bg-obsidian-900 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                setIsScenarioModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold rounded-xl bg-amber-500/15 text-amber-500 border border-amber-500/30"
            >
              <Flame className="w-4 h-4" />
              <span>Trigger Simulation Scenario</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
