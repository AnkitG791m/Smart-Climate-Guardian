import { ClimateStation, CitizenReport, EmergencyAlert, AuthorityAudit } from '../types';

export const INITIAL_STATIONS: ClimateStation[] = [
  {
    id: 'delhi-ctrl',
    name: 'New Delhi National Capital',
    region: 'Delhi NCR',
    country: 'India',
    lat: 28.6139,
    lng: 77.2090,
    populationCovered: 18900000,
    airQuality: {
      aqi: 288,
      category: 'Very Unhealthy',
      pm25: 184.5,
      pm10: 295.2,
      o3: 42.1,
      no2: 89.4,
      so2: 34.2,
      co: 3.4,
      dominantPollutant: 'PM2.5',
      healthAdvisory: 'Health warnings of emergency conditions. The entire population is likely to be affected. Avoid all outdoor physical activity.'
    },
    weather: {
      temperature: 34.2,
      feelsLike: 39.8,
      humidity: 58,
      pressure: 1008,
      windSpeed: 6.4,
      windDirection: 'WNW',
      uvIndex: 7,
      rainfallRate: 0.0,
      wetBulbTemp: 27.5,
      soilMoisture: 32,
      cloudCover: 20,
      conditionText: 'Dense Haze & Smoke Stagnation'
    },
    airRisk: {
      smokeDispersionIndex: 88,
      plumeRisk: 'Severe',
      inversionStagnation: true,
      vulnerableRiskScore: 92
    },
    heatwaveRisk: {
      urbanHeatIslandDelta: 4.8,
      wbgtIndex: 30.1,
      riskLevel: 'Danger',
      coolingSheltersAvailable: 42,
      powerGridStress: 'High'
    },
    floodRisk: {
      catchmentSaturation: 45,
      riverGaugeLevel: 204.2,
      riverThreshold: 205.3,
      runoffRisk: 'Elevated',
      drainageCapacity: 52
    },
    history24h: [
      { hour: '00:00', aqi: 240, pm25: 150, temp: 28, rainfall: 0 },
      { hour: '04:00', aqi: 270, pm25: 175, temp: 26, rainfall: 0 },
      { hour: '08:00', aqi: 310, pm25: 205, temp: 29, rainfall: 0 },
      { hour: '12:00', aqi: 288, pm25: 184, temp: 34, rainfall: 0 },
      { hour: '16:00', aqi: 265, pm25: 170, temp: 35, rainfall: 0 },
      { hour: '20:00', aqi: 295, pm25: 190, temp: 31, rainfall: 0 }
    ],
    forecast7d: [
      { day: 'Mon', date: 'Oct 05', aqi: 290, category: 'Very Unhealthy', tempMax: 35, tempMin: 25, rainProb: 5, hazardType: 'Smog' },
      { day: 'Tue', date: 'Oct 06', aqi: 275, category: 'Very Unhealthy', tempMax: 36, tempMin: 26, rainProb: 10, hazardType: 'Smog' },
      { day: 'Wed', date: 'Oct 07', aqi: 240, category: 'Very Unhealthy', tempMax: 34, tempMin: 24, rainProb: 20, hazardType: 'Smog' },
      { day: 'Thu', date: 'Oct 08', aqi: 195, category: 'Unhealthy', tempMax: 33, tempMin: 23, rainProb: 40, hazardType: 'Smog' },
      { day: 'Fri', date: 'Oct 09', aqi: 155, category: 'Unhealthy', tempMax: 31, tempMin: 22, rainProb: 65, hazardType: 'Normal' },
      { day: 'Sat', date: 'Oct 10', aqi: 120, category: 'Unhealthy for Sensitive Groups', tempMax: 30, tempMin: 21, rainProb: 30, hazardType: 'Normal' },
      { day: 'Sun', date: 'Oct 11', aqi: 160, category: 'Unhealthy', tempMax: 32, tempMin: 23, rainProb: 15, hazardType: 'Smog' }
    ],
    lastUpdated: 'Just now'
  },
  {
    id: 'fresno-val',
    name: 'Central Valley Biosphere',
    region: 'California',
    country: 'United States',
    lat: 36.7468,
    lng: -119.7726,
    populationCovered: 1200000,
    airQuality: {
      aqi: 172,
      category: 'Unhealthy',
      pm25: 96.2,
      pm10: 142.0,
      o3: 74.5,
      no2: 41.2,
      so2: 12.1,
      co: 1.8,
      dominantPollutant: 'PM2.5',
      healthAdvisory: 'Active Sierra wildfire smoke drift. Active children and adults, and people with respiratory disease, should avoid prolonged outdoor exertion.'
    },
    weather: {
      temperature: 37.8,
      feelsLike: 39.1,
      humidity: 22,
      pressure: 1012,
      windSpeed: 19.3,
      windDirection: 'NE',
      uvIndex: 9,
      rainfallRate: 0.0,
      wetBulbTemp: 21.2,
      soilMoisture: 14,
      cloudCover: 10,
      conditionText: 'High Fire Weather & Gusts'
    },
    airRisk: {
      smokeDispersionIndex: 79,
      plumeRisk: 'High',
      inversionStagnation: true,
      vulnerableRiskScore: 78
    },
    heatwaveRisk: {
      urbanHeatIslandDelta: 3.2,
      wbgtIndex: 28.5,
      riskLevel: 'Extreme Caution',
      coolingSheltersAvailable: 18,
      powerGridStress: 'High'
    },
    floodRisk: {
      catchmentSaturation: 18,
      riverGaugeLevel: 1.8,
      riverThreshold: 6.0,
      runoffRisk: 'Low',
      drainageCapacity: 92
    },
    history24h: [
      { hour: '00:00', aqi: 130, pm25: 65, temp: 24, rainfall: 0 },
      { hour: '04:00', aqi: 145, pm25: 78, temp: 22, rainfall: 0 },
      { hour: '08:00', aqi: 165, pm25: 88, temp: 28, rainfall: 0 },
      { hour: '12:00', aqi: 182, pm25: 105, temp: 36, rainfall: 0 },
      { hour: '16:00', aqi: 172, pm25: 96, temp: 38, rainfall: 0 },
      { hour: '20:00', aqi: 158, pm25: 85, temp: 31, rainfall: 0 }
    ],
    forecast7d: [
      { day: 'Mon', date: 'Oct 05', aqi: 175, category: 'Unhealthy', tempMax: 38, tempMin: 21, rainProb: 0, hazardType: 'Heat' },
      { day: 'Tue', date: 'Oct 06', aqi: 180, category: 'Unhealthy', tempMax: 39, tempMin: 22, rainProb: 0, hazardType: 'Heat' },
      { day: 'Wed', date: 'Oct 07', aqi: 165, category: 'Unhealthy', tempMax: 37, tempMin: 20, rainProb: 0, hazardType: 'Smog' },
      { day: 'Thu', date: 'Oct 08', aqi: 140, category: 'Unhealthy for Sensitive Groups', tempMax: 34, tempMin: 18, rainProb: 5, hazardType: 'Normal' },
      { day: 'Fri', date: 'Oct 09', aqi: 110, category: 'Unhealthy for Sensitive Groups', tempMax: 32, tempMin: 17, rainProb: 10, hazardType: 'Normal' },
      { day: 'Sat', date: 'Oct 10', aqi: 85, category: 'Moderate', tempMax: 29, tempMin: 16, rainProb: 15, hazardType: 'Normal' },
      { day: 'Sun', date: 'Oct 11', aqi: 75, category: 'Moderate', tempMax: 28, tempMin: 15, rainProb: 20, hazardType: 'Normal' }
    ],
    lastUpdated: '1 min ago'
  },
  {
    id: 'manaus-basin',
    name: 'Amazon Rainforest Catchment',
    region: 'Amazonas',
    country: 'Brazil',
    lat: -3.1190,
    lng: -60.0217,
    populationCovered: 2400000,
    airQuality: {
      aqi: 38,
      category: 'Good',
      pm25: 8.4,
      pm10: 16.2,
      o3: 21.0,
      no2: 12.3,
      so2: 4.1,
      co: 0.4,
      dominantPollutant: 'O3',
      healthAdvisory: 'Air quality is considered satisfactory, and air pollution poses little or no risk.'
    },
    weather: {
      temperature: 30.5,
      feelsLike: 37.4,
      humidity: 88,
      pressure: 1009,
      windSpeed: 8.2,
      windDirection: 'ESE',
      uvIndex: 11,
      rainfallRate: 18.5,
      wetBulbTemp: 28.8,
      soilMoisture: 91,
      cloudCover: 75,
      conditionText: 'Tropical Monsoon Downpour'
    },
    airRisk: {
      smokeDispersionIndex: 15,
      plumeRisk: 'Minimal',
      inversionStagnation: false,
      vulnerableRiskScore: 18
    },
    heatwaveRisk: {
      urbanHeatIslandDelta: 1.8,
      wbgtIndex: 30.2,
      riskLevel: 'Danger',
      coolingSheltersAvailable: 12,
      powerGridStress: 'Moderate'
    },
    floodRisk: {
      catchmentSaturation: 94,
      riverGaugeLevel: 28.4,
      riverThreshold: 29.0,
      runoffRisk: 'Flash Flood Warning',
      drainageCapacity: 34
    },
    history24h: [
      { hour: '00:00', aqi: 32, pm25: 7, temp: 25, rainfall: 4.2 },
      { hour: '04:00', aqi: 28, pm25: 6, temp: 24, rainfall: 8.0 },
      { hour: '08:00', aqi: 35, pm25: 8, temp: 27, rainfall: 2.1 },
      { hour: '12:00', aqi: 42, pm25: 9, temp: 31, rainfall: 0.5 },
      { hour: '16:00', aqi: 38, pm25: 8, temp: 30, rainfall: 18.5 },
      { hour: '20:00', aqi: 34, pm25: 7, temp: 26, rainfall: 12.0 }
    ],
    forecast7d: [
      { day: 'Mon', date: 'Oct 05', aqi: 35, category: 'Good', tempMax: 31, tempMin: 24, rainProb: 90, hazardType: 'Flood' },
      { day: 'Tue', date: 'Oct 06', aqi: 38, category: 'Good', tempMax: 32, tempMin: 24, rainProb: 85, hazardType: 'Flood' },
      { day: 'Wed', date: 'Oct 07', aqi: 40, category: 'Good', tempMax: 32, tempMin: 25, rainProb: 75, hazardType: 'Flood' },
      { day: 'Thu', date: 'Oct 08', aqi: 34, category: 'Good', tempMax: 30, tempMin: 23, rainProb: 80, hazardType: 'Flood' },
      { day: 'Fri', date: 'Oct 09', aqi: 30, category: 'Good', tempMax: 29, tempMin: 23, rainProb: 95, hazardType: 'Flood' },
      { day: 'Sat', date: 'Oct 10', aqi: 32, category: 'Good', tempMax: 31, tempMin: 24, rainProb: 70, hazardType: 'Normal' },
      { day: 'Sun', date: 'Oct 11', aqi: 36, category: 'Good', tempMax: 32, tempMin: 24, rainProb: 65, hazardType: 'Normal' }
    ],
    lastUpdated: '2 mins ago'
  },
  {
    id: 'rhine-ind',
    name: 'Rhine-Ruhr Clean Water & Industrial Grid',
    region: 'North Rhine-Westphalia',
    country: 'Germany',
    lat: 51.4344,
    lng: 6.7623,
    populationCovered: 5300000,
    airQuality: {
      aqi: 68,
      category: 'Moderate',
      pm25: 20.4,
      pm10: 38.2,
      o3: 45.1,
      no2: 44.8,
      so2: 15.0,
      co: 0.9,
      dominantPollutant: 'NO2',
      healthAdvisory: 'Air quality is acceptable; however, sensitive individuals may experience mild throat irritation.'
    },
    weather: {
      temperature: 18.2,
      feelsLike: 17.5,
      humidity: 78,
      pressure: 1016,
      windSpeed: 21.4,
      windDirection: 'SW',
      uvIndex: 4,
      rainfallRate: 3.8,
      wetBulbTemp: 15.6,
      soilMoisture: 72,
      cloudCover: 85,
      conditionText: 'Overcast with Intermittent Squalls'
    },
    airRisk: {
      smokeDispersionIndex: 32,
      plumeRisk: 'Moderate',
      inversionStagnation: false,
      vulnerableRiskScore: 35
    },
    heatwaveRisk: {
      urbanHeatIslandDelta: 2.1,
      wbgtIndex: 18.2,
      riskLevel: 'Normal',
      coolingSheltersAvailable: 8,
      powerGridStress: 'Low'
    },
    floodRisk: {
      catchmentSaturation: 78,
      riverGaugeLevel: 7.2,
      riverThreshold: 8.5,
      runoffRisk: 'Elevated',
      drainageCapacity: 74
    },
    history24h: [
      { hour: '00:00', aqi: 55, pm25: 16, temp: 15, rainfall: 1.0 },
      { hour: '04:00', aqi: 52, pm25: 15, temp: 14, rainfall: 2.5 },
      { hour: '08:00', aqi: 74, pm25: 23, temp: 16, rainfall: 4.0 },
      { hour: '12:00', aqi: 68, pm25: 20, temp: 19, rainfall: 2.0 },
      { hour: '16:00', aqi: 64, pm25: 19, temp: 18, rainfall: 3.8 },
      { hour: '20:00', aqi: 58, pm25: 17, temp: 16, rainfall: 1.5 }
    ],
    forecast7d: [
      { day: 'Mon', date: 'Oct 05', aqi: 65, category: 'Moderate', tempMax: 19, tempMin: 12, rainProb: 60, hazardType: 'Normal' },
      { day: 'Tue', date: 'Oct 06', aqi: 70, category: 'Moderate', tempMax: 20, tempMin: 13, rainProb: 40, hazardType: 'Normal' },
      { day: 'Wed', date: 'Oct 07', aqi: 60, category: 'Moderate', tempMax: 18, tempMin: 11, rainProb: 55, hazardType: 'Normal' },
      { day: 'Thu', date: 'Oct 08', aqi: 52, category: 'Moderate', tempMax: 17, tempMin: 10, rainProb: 70, hazardType: 'Flood' },
      { day: 'Fri', date: 'Oct 09', aqi: 48, category: 'Good', tempMax: 16, tempMin: 9, rainProb: 80, hazardType: 'Flood' },
      { day: 'Sat', date: 'Oct 10', aqi: 55, category: 'Moderate', tempMax: 18, tempMin: 11, rainProb: 30, hazardType: 'Normal' },
      { day: 'Sun', date: 'Oct 11', aqi: 58, category: 'Moderate', tempMax: 19, tempMin: 12, rainProb: 25, hazardType: 'Normal' }
    ],
    lastUpdated: '3 mins ago'
  },
  {
    id: 'tokyo-shinjuku',
    name: 'Greater Tokyo Urban Resilience Dome',
    region: 'Kanto',
    country: 'Japan',
    lat: 35.6895,
    lng: 139.6917,
    populationCovered: 14100000,
    airQuality: {
      aqi: 48,
      category: 'Good',
      pm25: 11.2,
      pm10: 22.4,
      o3: 38.0,
      no2: 28.5,
      so2: 5.2,
      co: 0.6,
      dominantPollutant: 'PM2.5',
      healthAdvisory: 'Air conditions optimal for all public outdoor activities.'
    },
    weather: {
      temperature: 25.4,
      feelsLike: 27.2,
      humidity: 65,
      pressure: 1014,
      windSpeed: 14.2,
      windDirection: 'SSE',
      uvIndex: 6,
      rainfallRate: 0.2,
      wetBulbTemp: 21.0,
      soilMoisture: 45,
      cloudCover: 40,
      conditionText: 'Clear with Coastal Breeze'
    },
    airRisk: {
      smokeDispersionIndex: 20,
      plumeRisk: 'Minimal',
      inversionStagnation: false,
      vulnerableRiskScore: 22
    },
    heatwaveRisk: {
      urbanHeatIslandDelta: 4.4,
      wbgtIndex: 25.1,
      riskLevel: 'Caution',
      coolingSheltersAvailable: 64,
      powerGridStress: 'Moderate'
    },
    floodRisk: {
      catchmentSaturation: 52,
      riverGaugeLevel: 3.1,
      riverThreshold: 7.0,
      runoffRisk: 'Low',
      drainageCapacity: 88
    },
    history24h: [
      { hour: '00:00', aqi: 42, pm25: 9, temp: 20, rainfall: 0 },
      { hour: '04:00', aqi: 38, pm25: 8, temp: 19, rainfall: 0 },
      { hour: '08:00', aqi: 52, pm25: 12, temp: 22, rainfall: 0 },
      { hour: '12:00', aqi: 48, pm25: 11, temp: 26, rainfall: 0.2 },
      { hour: '16:00', aqi: 45, pm25: 10, temp: 25, rainfall: 0 },
      { hour: '20:00', aqi: 40, pm25: 9, temp: 22, rainfall: 0 }
    ],
    forecast7d: [
      { day: 'Mon', date: 'Oct 05', aqi: 45, category: 'Good', tempMax: 26, tempMin: 18, rainProb: 15, hazardType: 'Normal' },
      { day: 'Tue', date: 'Oct 06', aqi: 50, category: 'Good', tempMax: 27, tempMin: 19, rainProb: 20, hazardType: 'Normal' },
      { day: 'Wed', date: 'Oct 07', aqi: 62, category: 'Moderate', tempMax: 28, tempMin: 20, rainProb: 10, hazardType: 'Heat' },
      { day: 'Thu', date: 'Oct 08', aqi: 55, category: 'Moderate', tempMax: 25, tempMin: 18, rainProb: 40, hazardType: 'Normal' },
      { day: 'Fri', date: 'Oct 09', aqi: 42, category: 'Good', tempMax: 23, tempMin: 17, rainProb: 60, hazardType: 'Normal' },
      { day: 'Sat', date: 'Oct 10', aqi: 39, category: 'Good', tempMax: 22, tempMin: 16, rainProb: 20, hazardType: 'Normal' },
      { day: 'Sun', date: 'Oct 11', aqi: 44, category: 'Good', tempMax: 24, tempMin: 17, rainProb: 10, hazardType: 'Normal' }
    ],
    lastUpdated: 'Just now'
  }
];

export const INITIAL_CITIZEN_REPORTS: CitizenReport[] = [
  {
    id: 'rep-101',
    title: 'Excessive Agricultural Residue Burning along Bypass - Community Suppression Underway',
    category: 'Illegal Burning',
    description: 'Thick acrid smoke billowing across 4 lanes of rural highway. Local citizen brigade actively dousing brush fires with water buckets before arrival of municipal fire trucks.',
    severity: 'critical',
    lat: 23.1680,
    lng: 77.4190,
    locationName: 'Kolar Road Outskirts, Bhopal MP',
    timestamp: '14 minutes ago',
    reporterName: 'Vikram Patel',
    reporterType: 'Community Leader',
    upvotes: 62,
    corroborations: 18,
    status: 'Response Dispatched',
    imageUrl: '/images/wildfire-citizen-action.png'
  },
  {
    id: 'rep-102',
    title: 'Severe Urban Atmospheric Smog Inversion Capping Residential Basin',
    category: 'Urban Heat Pocket',
    description: 'Dense grey particulate smog ceiling trapped under low boundary layer. Ground visibility 120m. Inversion trapping vehicle exhaust and factory particulate.',
    severity: 'high',
    lat: 23.2550,
    lng: 77.4120,
    locationName: 'Upper Lake Elevated Ridge, Bhopal MP',
    timestamp: '32 minutes ago',
    reporterName: 'Marcus Vance & AirWatch',
    reporterType: 'Citizen Guardian',
    upvotes: 45,
    corroborations: 14,
    status: 'Verified by Authority',
    imageUrl: '/images/smog-haze-city.png'
  },
  {
    id: 'rep-103',
    title: 'Storm Culvert Blockage Causing Rapid Street Inundation',
    category: 'Drainage Blockage',
    description: 'Debris and plastic build-up have completely jammed the main stormwater overflow culvert. Water has rose 35cm onto residential sidewalks.',
    severity: 'high',
    lat: -3.1250,
    lng: -60.0150,
    locationName: 'Bairro Da Paz Canal Outfall, Manaus',
    timestamp: '1 hour ago',
    reporterName: 'Luiz Costa',
    reporterType: 'Ecologist Volunteer',
    upvotes: 29,
    corroborations: 6,
    status: 'Investigating',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=700&q=80'
  },
  {
    id: 'rep-104',
    title: 'Chemical Solvent Odor Venting Near School Zone',
    category: 'Chemical Odor',
    description: 'Strong pungent sulfurous vapor detected within 200m of community kindergarten. Several children complaining of eye irritation.',
    severity: 'critical',
    lat: 51.4420,
    lng: 6.7710,
    locationName: 'Ruhrpark East Industrial Border',
    timestamp: '2 hours ago',
    reporterName: 'Dr. Helene Weber',
    reporterType: 'Community Leader',
    upvotes: 84,
    corroborations: 24,
    status: 'Response Dispatched',
    imageUrl: '/images/smog-haze-city.png'
  },
  {
    id: 'rep-105',
    title: 'Dense Sierra Wildfire Drift Settling in Lower Foothills',
    category: 'Wildfire Smoke',
    description: 'Ash falling on vehicles and solar panels. Orange twilight hue observed since 11:00 AM. Sensitive group alert recommended.',
    severity: 'moderate',
    lat: 36.8100,
    lng: -119.7200,
    locationName: 'Clovis Foothill Ridge',
    timestamp: '3 hours ago',
    reporterName: 'Sarah Jenkins',
    reporterType: 'Citizen Guardian',
    upvotes: 19,
    corroborations: 4,
    status: 'Resolved',
    imageUrl: 'https://images.unsplash.com/photo-1527482797697-8795b05a13fe?auto=format&fit=crop&w=700&q=80'
  }
];

export const INITIAL_ALERTS: EmergencyAlert[] = [
  {
    id: 'alt-001',
    title: 'CRITICAL SMOG EMERGENCY: Stagnation Red Advisory',
    hazardType: 'air',
    severity: 'critical',
    issuedAt: '35 mins ago',
    expiresIn: '14 hours',
    region: 'Delhi NCR Metropolitan Region',
    description: 'Atmospheric thermal inversion has trapped dense PM2.5 particulates within the boundary layer. Severe health impact for all age groups.',
    actionProtocol: [
      'Industrial units on non-clean fuels ordered to halt operations immediately.',
      'Mandatory N95 mask usage when outdoors.',
      'Schools advised to switch to hybrid/virtual sessions.',
      'Municipal water mist cannons activated along arterial corridors.'
    ],
    acknowledged: false
  },
  {
    id: 'alt-002',
    title: 'HEATWAVE WARNING: Wet-Bulb Hazard Level 4',
    hazardType: 'heat',
    severity: 'warning',
    issuedAt: '1 hour ago',
    expiresIn: '8 hours',
    region: 'Central Valley District, CA',
    description: 'WBGT exceeds 29.5°C with peak temperatures reaching 39°C. Extreme risk of heat syncope and hyperthermia for outdoor laborers.',
    actionProtocol: [
      'Employers must enforce 15-minute mandatory shade breaks every 45 minutes.',
      'Public cooling shelters opened at Civic Library and Community Gyms.',
      'Free hydration kiosks activated at high-traffic bus terminals.'
    ],
    acknowledged: false
  },
  {
    id: 'alt-003',
    title: 'FLASH FLOOD WATCH: Rio Negro Basin Surge',
    hazardType: 'flood',
    severity: 'warning',
    issuedAt: '2 hours ago',
    expiresIn: '18 hours',
    region: 'Manaus Waterfront Zone 2',
    description: 'Intense convective precipitation (18.5 mm/h) coupled with 94% soil saturation has initiated rapid runoff into low-elevation dwellings.',
    actionProtocol: [
      'Evacuate ground-floor dwellings within 50 meters of drainage arteries.',
      'Avoid driving or walking through moving water currents.',
      'Emergency rescue teams on standby on VHF Frequency 156.8 MHz.'
    ],
    acknowledged: true
  }
];

export const INITIAL_AUTHORITY_AUDITS: AuthorityAudit[] = [
  {
    stationId: 'delhi-ctrl',
    stationName: 'New Delhi National Capital',
    complianceRate: 58.4,
    exceedanceEvents24h: 18,
    uptimeRate: 99.8,
    sensorHealth: 'Optimal',
    activeDispatches: 6,
    legalStandard: 'WHO 2021 Global Guidelines'
  },
  {
    stationId: 'fresno-val',
    stationName: 'Central Valley Biosphere',
    complianceRate: 74.2,
    exceedanceEvents24h: 8,
    uptimeRate: 99.1,
    sensorHealth: 'Optimal',
    activeDispatches: 3,
    legalStandard: 'EPA NAAQS'
  },
  {
    stationId: 'manaus-basin',
    stationName: 'Amazon Rainforest Catchment',
    complianceRate: 98.6,
    exceedanceEvents24h: 1,
    uptimeRate: 96.4,
    sensorHealth: 'Needs Calibration',
    activeDispatches: 2,
    legalStandard: 'WHO 2021 Global Guidelines'
  },
  {
    stationId: 'rhine-ind',
    stationName: 'Rhine-Ruhr Clean Water & Industrial Grid',
    complianceRate: 89.2,
    exceedanceEvents24h: 3,
    uptimeRate: 99.9,
    sensorHealth: 'Optimal',
    activeDispatches: 1,
    legalStandard: 'EU Air Directive'
  },
  {
    stationId: 'tokyo-shinjuku',
    stationName: 'Greater Tokyo Urban Resilience Dome',
    complianceRate: 97.4,
    exceedanceEvents24h: 0,
    uptimeRate: 100.0,
    sensorHealth: 'Optimal',
    activeDispatches: 0,
    legalStandard: 'WHO 2021 Global Guidelines'
  }
];
