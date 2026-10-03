export type SeverityLevel = 'low' | 'moderate' | 'high' | 'very_high' | 'critical' | 'emergency';

export type AQICategory = 
  | 'Good' 
  | 'Moderate' 
  | 'Unhealthy for Sensitive Groups' 
  | 'Unhealthy' 
  | 'Very Unhealthy' 
  | 'Hazardous';

export interface AirQualityData {
  aqi: number;
  category: AQICategory;
  pm25: number;      // µg/m³
  pm10: number;      // µg/m³
  o3: number;        // ppb
  no2: number;       // ppb
  so2: number;       // ppb
  co: number;        // ppm
  dominantPollutant: 'PM2.5' | 'PM10' | 'O3' | 'NO2';
  healthAdvisory: string;
}

export interface WeatherData {
  temperature: number;      // °C
  feelsLike: number;        // °C
  humidity: number;         // %
  pressure: number;         // hPa
  windSpeed: number;        // km/h
  windDirection: string;    // e.g. "NW", "SSW"
  uvIndex: number;          // 0 - 12
  rainfallRate: number;     // mm/h
  wetBulbTemp: number;      // °C
  soilMoisture: number;     // %
  cloudCover: number;       // %
  conditionText: string;
}

export interface ClimateStation {
  id: string;
  name: string;
  region: string;
  country: string;
  lat: number;
  lng: number;
  populationCovered: number;
  airQuality: AirQualityData;
  weather: WeatherData;
  airRisk: {
    smokeDispersionIndex: number; // 0-100
    plumeRisk: 'Minimal' | 'Moderate' | 'High' | 'Severe';
    inversionStagnation: boolean;
    vulnerableRiskScore: number;  // 0-100
  };
  heatwaveRisk: {
    urbanHeatIslandDelta: number; // +°C above rural
    wbgtIndex: number;            // °C Wet Bulb Globe
    riskLevel: 'Normal' | 'Caution' | 'Extreme Caution' | 'Danger' | 'Extreme Danger';
    coolingSheltersAvailable: number;
    powerGridStress: 'Low' | 'Moderate' | 'High' | 'Critical';
  };
  floodRisk: {
    catchmentSaturation: number;  // %
    riverGaugeLevel: number;      // meters (alert at 4.5m)
    riverThreshold: number;       // meters
    runoffRisk: 'Low' | 'Elevated' | 'Severe' | 'Flash Flood Warning';
    drainageCapacity: number;     // %
  };
  history24h: {
    hour: string;
    aqi: number;
    pm25: number;
    temp: number;
    rainfall: number;
  }[];
  forecast7d: {
    day: string;
    date: string;
    aqi: number;
    category: AQICategory;
    tempMax: number;
    tempMin: number;
    rainProb: number;
    hazardType?: 'Heat' | 'Smog' | 'Flood' | 'Normal';
  }[];
  lastUpdated: string;
}

export interface CitizenReport {
  id: string;
  title: string;
  category: 'Illegal Burning' | 'Chemical Odor' | 'Flash Flooding' | 'Urban Heat Pocket' | 'Industrial Smoke' | 'Drainage Blockage' | 'Wildfire Smoke';
  description: string;
  severity: 'low' | 'moderate' | 'high' | 'critical';
  lat: number;
  lng: number;
  locationName: string;
  timestamp: string;
  reporterName: string;
  reporterType: 'Citizen Guardian' | 'Community Leader' | 'Ecologist Volunteer' | 'Anonymous';
  upvotes: number;
  corroborations: number;
  hasUserUpvoted?: boolean;
  status: 'Investigating' | 'Verified by Authority' | 'Response Dispatched' | 'Resolved';
  imageUrl: string;
}

export interface EmergencyAlert {
  id: string;
  title: string;
  hazardType: 'air' | 'heat' | 'flood' | 'wildfire';
  severity: 'advisory' | 'warning' | 'critical';
  issuedAt: string;
  expiresIn: string;
  region: string;
  description: string;
  actionProtocol: string[];
  acknowledged: boolean;
}

export interface AuthorityAudit {
  stationId: string;
  stationName: string;
  complianceRate: number;      // %
  exceedanceEvents24h: number; // times limits were breached
  uptimeRate: number;          // %
  sensorHealth: 'Optimal' | 'Needs Calibration' | 'Offline Backup';
  activeDispatches: number;
  legalStandard: 'WHO 2021 Global Guidelines' | 'EPA NAAQS' | 'EU Air Directive';
}
