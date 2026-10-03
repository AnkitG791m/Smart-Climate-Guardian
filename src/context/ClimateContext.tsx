import React, { createContext, useContext, useState, useEffect } from 'react';
import { ClimateStation, CitizenReport, EmergencyAlert, AuthorityAudit } from '../types';
import { INITIAL_STATIONS, INITIAL_CITIZEN_REPORTS, INITIAL_ALERTS, INITIAL_AUTHORITY_AUDITS } from '../data/mockData';
import { soundService } from '../services/soundService';

export type NavigationTab = 
  | 'overview' 
  | 'dashboard' 
  | 'map' 
  | 'risks' 
  | 'citizen' 
  | 'alerts' 
  | 'authority';

export type ScenarioType = 'normal' | 'wildfire' | 'flood' | 'heatwave';

interface ClimateContextType {
  stations: ClimateStation[];
  currentStation: ClimateStation;
  selectStation: (id: string) => void;
  citizenReports: CitizenReport[];
  addCitizenReport: (report: Omit<CitizenReport, 'id' | 'timestamp' | 'upvotes' | 'corroborations' | 'status'>) => void;
  upvoteReport: (id: string) => void;
  alerts: EmergencyAlert[];
  acknowledgeAlert: (id: string) => void;
  dismissAlert: (id: string) => void;
  authorityAudits: AuthorityAudit[];
  isStreaming: boolean;
  toggleStreaming: () => void;
  activeScenario: ScenarioType;
  triggerScenario: (scenario: ScenarioType) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  audioMuted: boolean;
  toggleAudioMuted: () => void;
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  isReportModalOpen: boolean;
  setIsReportModalOpen: (open: boolean) => void;
  isScenarioModalOpen: boolean;
  setIsScenarioModalOpen: (open: boolean) => void;
}

const ClimateContext = createContext<ClimateContextType | undefined>(undefined);

export const ClimateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stations, setStations] = useState<ClimateStation[]>(INITIAL_STATIONS);
  const [currentStationId, setCurrentStationId] = useState<string>('delhi-ctrl');
  const [citizenReports, setCitizenReports] = useState<CitizenReport[]>(INITIAL_CITIZEN_REPORTS);
  const [alerts, setAlerts] = useState<EmergencyAlert[]>(INITIAL_ALERTS);
  const [authorityAudits] = useState<AuthorityAudit[]>(INITIAL_AUTHORITY_AUDITS);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [activeScenario, setActiveScenario] = useState<ScenarioType>('normal');
  const [darkMode, setDarkMode] = useState<boolean>(true); // Default dark eco-mode
  const [audioMuted, setAudioMuted] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isScenarioModalOpen, setIsScenarioModalOpen] = useState<boolean>(false);

  // Sync dark class on body
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);
  const toggleAudioMuted = () => {
    setAudioMuted(prev => {
      const next = !prev;
      soundService.setMuted(next);
      return next;
    });
  };

  const currentStation = stations.find(s => s.id === currentStationId) || stations[0];

  const selectStation = (id: string) => {
    setCurrentStationId(id);
    soundService.playAlertChime('info');
  };

  // Live simulation tick (every 4.5 seconds when streaming is on)
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      setStations(prev => prev.map(station => {
        // Micro fluctuation in AQI and temperature
        const aqiDelta = (Math.random() - 0.48) * 3;
        const newAqi = Math.max(15, Math.min(480, Math.round(station.airQuality.aqi + aqiDelta)));
        
        const tempDelta = (Math.random() - 0.5) * 0.2;
        const newTemp = +(station.weather.temperature + tempDelta).toFixed(1);

        const pmDelta = (Math.random() - 0.48) * 2;
        const newPm25 = +(Math.max(4, station.airQuality.pm25 + pmDelta)).toFixed(1);

        return {
          ...station,
          airQuality: {
            ...station.airQuality,
            aqi: newAqi,
            pm25: newPm25
          },
          weather: {
            ...station.weather,
            temperature: newTemp,
            feelsLike: +(newTemp + (newTemp > 25 ? 4.2 : 0)).toFixed(1)
          },
          lastUpdated: 'Live streaming'
        };
      }));
    }, 4500);

    return () => clearInterval(interval);
  }, [isStreaming]);

  const toggleStreaming = () => {
    setIsStreaming(prev => !prev);
  };

  const addCitizenReport = (reportData: Omit<CitizenReport, 'id' | 'timestamp' | 'upvotes' | 'corroborations' | 'status'>) => {
    const newReport: CitizenReport = {
      ...reportData,
      id: `rep-${Date.now().toString().slice(-4)}`,
      timestamp: 'Just now',
      upvotes: 1,
      corroborations: 0,
      status: 'Investigating',
      hasUserUpvoted: true
    };
    setCitizenReports(prev => [newReport, ...prev]);
    soundService.playAlertChime('warning');
  };

  const upvoteReport = (id: string) => {
    setCitizenReports(prev => prev.map(rep => {
      if (rep.id === id) {
        const isUpvoted = rep.hasUserUpvoted;
        return {
          ...rep,
          upvotes: isUpvoted ? rep.upvotes - 1 : rep.upvotes + 1,
          hasUserUpvoted: !isUpvoted
        };
      }
      return rep;
    }));
    soundService.playAlertChime('info');
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
    soundService.playAlertChime('info');
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  // Scenario Simulator trigger
  const triggerScenario = (scenario: ScenarioType) => {
    setActiveScenario(scenario);

    if (scenario === 'wildfire') {
      soundService.playAlertChime('critical');
      setStations(prev => prev.map(s => {
        if (s.id === currentStationId) {
          return {
            ...s,
            airQuality: {
              ...s.airQuality,
              aqi: 345,
              category: 'Hazardous',
              pm25: 242.0,
              pm10: 380.0,
              healthAdvisory: 'CRISIS ALERT: Severe wildfire smoke plume inversion. PM2.5 levels exceed hazardous thresholds.'
            },
            airRisk: {
              ...s.airRisk,
              smokeDispersionIndex: 96,
              plumeRisk: 'Severe',
              inversionStagnation: true,
              vulnerableRiskScore: 98
            },
            weather: {
              ...s.weather,
              conditionText: 'Dense Wildfire Ash & Plume Inversion'
            }
          };
        }
        return s;
      }));

      const newAlert: EmergencyAlert = {
        id: `sim-wildfire-${Date.now()}`,
        title: 'EMERGENCY: Extreme Wildfire Smoke Plume Inversion',
        hazardType: 'wildfire',
        severity: 'critical',
        issuedAt: 'Just now (Simulated)',
        expiresIn: '6 hours',
        region: currentStation.region,
        description: 'Rapid particulate surge triggered by active wildfire perimeter. Inversion ceiling preventing vertical dispersion.',
        actionProtocol: [
          'Immediate indoor shelter with air purification active.',
          'N95/FFP2 respirators required outdoors.',
          'Close all ventilation dampers and exterior openings.'
        ],
        acknowledged: false
      };
      setAlerts(prev => [newAlert, ...prev]);
    } else if (scenario === 'flood') {
      soundService.playAlertChime('critical');
      setStations(prev => prev.map(s => {
        if (s.id === currentStationId) {
          return {
            ...s,
            floodRisk: {
              ...s.floodRisk,
              catchmentSaturation: 98,
              riverGaugeLevel: 9.8,
              riverThreshold: 8.0,
              runoffRisk: 'Flash Flood Warning',
              drainageCapacity: 18
            },
            weather: {
              ...s.weather,
              rainfallRate: 45.0,
              conditionText: 'Extreme Torrential Downpour (Flash Flood)'
            }
          };
        }
        return s;
      }));

      const newAlert: EmergencyAlert = {
        id: `sim-flood-${Date.now()}`,
        title: 'CRITICAL WARNING: Flash Flood & Catchment Breach',
        hazardType: 'flood',
        severity: 'critical',
        issuedAt: 'Just now (Simulated)',
        expiresIn: '4 hours',
        region: currentStation.region,
        description: 'Runoff capacity exceeded. River gauge is 1.8 meters above critical flood stage with rapid catchment inundation.',
        actionProtocol: [
          'Move immediately to higher ground.',
          'Never attempt to cross flooded roadways or underpasses.',
          'Follow municipal evacuation route Green-4.'
        ],
        acknowledged: false
      };
      setAlerts(prev => [newAlert, ...prev]);
    } else if (scenario === 'heatwave') {
      soundService.playAlertChime('warning');
      setStations(prev => prev.map(s => {
        if (s.id === currentStationId) {
          return {
            ...s,
            weather: {
              ...s.weather,
              temperature: 43.5,
              feelsLike: 49.0,
              wetBulbTemp: 32.5,
              uvIndex: 12,
              conditionText: 'Extreme Heatwave Advisory Level 5'
            },
            heatwaveRisk: {
              ...s.heatwaveRisk,
              wbgtIndex: 33.2,
              riskLevel: 'Extreme Danger',
              urbanHeatIslandDelta: 5.6,
              powerGridStress: 'Critical'
            }
          };
        }
        return s;
      }));

      const newAlert: EmergencyAlert = {
        id: `sim-heat-${Date.now()}`,
        title: 'RED ALERT: Extreme Heatwave & Power Grid Stress',
        hazardType: 'heat',
        severity: 'critical',
        issuedAt: 'Just now (Simulated)',
        expiresIn: '10 hours',
        region: currentStation.region,
        description: 'Ambient temperatures surpassing 43°C with wet-bulb globe temperature at extreme physiological danger threshold.',
        actionProtocol: [
          'Public cooling shelters operating at maximum emergency capacity.',
          'Curtail unnecessary electrical consumption to prevent transformer failure.',
          'Frequent hydration and check on vulnerable neighbors.'
        ],
        acknowledged: false
      };
      setAlerts(prev => [newAlert, ...prev]);
    } else {
      // Normal reset
      soundService.playAlertChime('info');
      setStations(INITIAL_STATIONS);
    }
  };

  return (
    <ClimateContext.Provider
      value={{
        stations,
        currentStation,
        selectStation,
        citizenReports,
        addCitizenReport,
        upvoteReport,
        alerts,
        acknowledgeAlert,
        dismissAlert,
        authorityAudits,
        isStreaming,
        toggleStreaming,
        activeScenario,
        triggerScenario,
        darkMode,
        toggleDarkMode,
        audioMuted,
        toggleAudioMuted,
        activeTab,
        setActiveTab,
        isReportModalOpen,
        setIsReportModalOpen,
        isScenarioModalOpen,
        setIsScenarioModalOpen,
      }}
    >
      {children}
    </ClimateContext.Provider>
  );
};

export const useClimate = () => {
  const context = useContext(ClimateContext);
  if (!context) {
    throw new Error('useClimate must be used within a ClimateProvider');
  }
  return context;
};
