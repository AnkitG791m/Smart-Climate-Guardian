import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { LandingPage } from './pages/LandingPage';
import { GoogleMapsDashboard } from './components/map/GoogleMapsDashboard';
import { CityLocation, DEFAULT_CITY, fetchLiveEnvironmentalData } from './services/openMeteo';
import { DashboardSkeleton } from './components/common/Skeleton';
import './i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function MainApp() {
  // Current active city (Default: Bhopal, MP)
  const [currentCity, setCurrentCity] = useState<CityLocation>(() => {
    try {
      const saved = localStorage.getItem('scg_current_city');
      return saved ? JSON.parse(saved) : DEFAULT_CITY;
    } catch {
      return DEFAULT_CITY;
    }
  });

  // Theme state: Clean Sky Blue & Crisp White aesthetic matching user image
  const [darkMode, setDarkMode] = useState<boolean>(false);

  useEffect(() => {
    // Default to clean Sky Blue & Crisp White theme requested by user
    document.documentElement.classList.remove('dark');
    localStorage.setItem('scg_theme', 'light');
  }, []);

  const handleSelectCity = (city: CityLocation) => {
    setCurrentCity(city);
    try {
      localStorage.setItem('scg_current_city', JSON.stringify(city));
    } catch {
      // ignore storage error
    }
  };

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Live environmental data query from Open-Meteo
  const { data: liveData, isLoading } = useQuery({
    queryKey: ['liveEnvironmentalData', currentCity.lat, currentCity.lon],
    queryFn: () => fetchLiveEnvironmentalData(currentCity),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return (
    <BrowserRouter>
      <Routes>
        {/* Primary Screen: Google Maps-Inspired Fullscreen Environmental Intelligence Dashboard */}
        <Route
          path="/"
          element={
            isLoading || !liveData ? (
              <div className="w-screen h-screen flex items-center justify-center bg-[#0d1615] text-white">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-600/30 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center animate-pulse">
                    <svg className="w-6 h-6 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <circle cx="12" cy="12" r="10" strokeWidth="4" strokeDasharray="30 60" />
                    </svg>
                  </div>
                  <p className="text-xs font-mono text-emerald-400 tracking-wider uppercase">
                    Initializing Bhopal Environmental Defense Grid...
                  </p>
                </div>
              </div>
            ) : (
              <GoogleMapsDashboard
                currentCity={currentCity}
                onSelectCity={handleSelectCity}
                liveData={liveData}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
              />
            )
          }
        />

        {/* Overview & Documentation Landing Page */}
        <Route
          path="/overview"
          element={<LandingPage currentCity={currentCity} />}
        />

        {/* Redirect /dashboard to primary map dashboard */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MainApp />
    </QueryClientProvider>
  );
}
