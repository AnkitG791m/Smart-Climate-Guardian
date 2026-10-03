export interface DangerZoneFeature {
  id: string;
  name: string;
  type: 'toxic_plume' | 'flood_inundation' | 'extreme_heat_pocket' | 'wildfire_front';
  severity: 'Critical' | 'High' | 'Moderate';
  riskScore: number; // 0-100
  affectedRadiusKm: number;
  coordinates: [number, number]; // [lat, lng]
  polygonCoordinates?: [number, number][]; // optional polygon boundary
  reasons: string[];
  recommendations: string[];
  nearestShelterId: string;
  populationExposed: number;
}

export interface FireHotspotFeature {
  id: string;
  name: string;
  lat: number;
  lng: number;
  brightnessTempK: number;
  confidencePercent: number;
  source: string;
  acqDate: string;
  acqTime: string;
  estimatedAreaHectares: number;
  riskScore: number;
  frpMw?: number;
  daynight?: 'D' | 'N';
  satellite?: string;
  instrument?: string;
  confidenceLevel?: string;
}

export interface FloodInundationFeature {
  id: string;
  basinName: string;
  lat: number;
  lng: number;
  radiusKm: number;
  waterLevelMeters: number;
  thresholdMeters: number;
  saturationPercent: number;
  flowStatus: 'Severe Overflow' | 'Spillway Active' | 'Elevated Surge' | 'Moderate Drainage';
  riskScore: number;
}

export interface ShelterHospitalFeature {
  id: string;
  name: string;
  type: 'Hospital' | 'Civil Defense Shelter' | 'Relief Camp';
  lat: number;
  lng: number;
  address: string;
  phone: string;
  totalCapacity: number;
  availableCapacity: number;
  hasOxygenSupply: boolean;
  hasAirPurification: boolean;
  distanceKm?: number;
}

export interface CitizenIncidentPin {
  id: string;
  title: string;
  category: 'Illegal Crop Burning' | 'Chemical Odor' | 'Drainage Blockage' | 'Urban Heat Pocket' | 'Forest Flame';
  lat: number;
  lng: number;
  locationName: string;
  timestamp: string;
  reporterName: string;
  corroborations: number;
  status: 'Verified by Authority' | 'Investigating' | 'Dispatched';
  imageUrl: string;
}

// Bhopal & Central MP Geo-referenced Features (around Lat: 23.2599, Lon: 77.4126)
export const DANGER_ZONES: DangerZoneFeature[] = [
  {
    id: 'dz-bhopal-ind',
    name: 'Govindpura Industrial Particulate Stagnation Corridor',
    type: 'toxic_plume',
    severity: 'Critical',
    riskScore: 89,
    affectedRadiusKm: 6.8,
    coordinates: [23.2650, 77.4420],
    polygonCoordinates: [
      [23.2800, 77.4250],
      [23.2850, 77.4600],
      [23.2550, 77.4700],
      [23.2450, 77.4350],
    ],
    reasons: [
      'Industrial SO2 & PM10 emissions trapped under a 180m atmospheric inversion ceiling.',
      'Surface wind velocity below 4 km/h causing micro-particulate pooling in residential perimeter.',
      'PM2.5 sub-index exceeds CPCB NAQI 380 (Very Poor to Severe).'
    ],
    recommendations: [
      'Industrial processing units must throttle fossil fuel boilers by 40% immediately.',
      'Mandatory N95/FFP2 masks for residents within 6.8 km buffer.',
      'Vulnerable residents (children, asthmatics) must remain in filtered indoor shelters.'
    ],
    nearestShelterId: 'shelter-bhopal-1',
    populationExposed: 142000,
  },
  {
    id: 'dz-bhopal-lake',
    name: 'Upper Lake Watershed Runoff & Sluice Buffer',
    type: 'flood_inundation',
    severity: 'High',
    riskScore: 78,
    affectedRadiusKm: 4.5,
    coordinates: [23.2420, 77.3650],
    polygonCoordinates: [
      [23.2550, 77.3400],
      [23.2600, 77.3900],
      [23.2300, 77.3950],
      [23.2200, 77.3500],
    ],
    reasons: [
      'Catchment saturation index at 88% following sustained 18mm/h precipitation.',
      'Bhadbhada dam spillway discharge volume approaching caution thresholds.',
      'Low-lying drainage arteries experiencing 25-40cm backwater rise.'
    ],
    recommendations: [
      'Do not attempt vehicular crossings over submerged causeways.',
      'Ground-floor residents along canal flanks advised to relocate valuables above 1 meter.',
      'Emergency drainage pumps deployed at VIP Road confluence.'
    ],
    nearestShelterId: 'hospital-bhopal-1',
    populationExposed: 68000,
  },
  {
    id: 'dz-bhopal-heat',
    name: 'MP Nagar Commercial Core Urban Heat Island',
    type: 'extreme_heat_pocket',
    severity: 'High',
    riskScore: 74,
    affectedRadiusKm: 3.2,
    coordinates: [23.2320, 77.4320],
    polygonCoordinates: [
      [23.2420, 77.4200],
      [23.2450, 77.4450],
      [23.2200, 77.4480],
      [23.2180, 77.4220],
    ],
    reasons: [
      'Dense concrete and asphalt radiative absorption creating a +4.8°C thermal anomaly above rural canopy.',
      'Wet-Bulb Globe Temperature (WBGT) reading 31.4°C (OSHA Danger Level).',
      'High power transformer load due to commercial cooling demand.'
    ],
    recommendations: [
      'Outdoor laborers must observe mandatory 15-minute rest breaks every 45 minutes.',
      'Municipal misting stations activated at Jyoti Cineplex bus terminal.',
      'Public cooling shelters open with free hydration salt kiosks.'
    ],
    nearestShelterId: 'shelter-bhopal-2',
    populationExposed: 95000,
  }
];

export const FIRE_HOTSPOTS: FireHotspotFeature[] = [
  {
    id: 'fire-1',
    name: 'Berasia Agricultural Crop Burning Flare',
    lat: 23.3650,
    lng: 77.4120,
    brightnessTempK: 334.8,
    confidencePercent: 92,
    source: 'NASA FIRMS / VIIRS',
    acqDate: 'Today',
    acqTime: '11:42 UTC',
    estimatedAreaHectares: 14.5,
    riskScore: 86,
  },
  {
    id: 'fire-2',
    name: 'Kolar Road Outskirts Dry Scrub Flare',
    lat: 23.1680,
    lng: 77.4190,
    brightnessTempK: 322.4,
    confidencePercent: 78,
    source: 'NASA FIRMS / VIIRS',
    acqDate: 'Today',
    acqTime: '10:15 UTC',
    estimatedAreaHectares: 6.2,
    riskScore: 68,
  },
  {
    id: 'fire-3',
    name: 'Sehore Boundary Residue Burning',
    lat: 23.2100,
    lng: 77.2200,
    brightnessTempK: 329.1,
    confidencePercent: 88,
    source: 'NASA FIRMS / VIIRS',
    acqDate: 'Today',
    acqTime: '09:30 UTC',
    estimatedAreaHectares: 11.0,
    riskScore: 82,
  },
  {
    id: 'fire-4',
    name: 'Raisen Highway Stubble Incineration',
    lat: 23.3100,
    lng: 77.5800,
    brightnessTempK: 341.0,
    confidencePercent: 96,
    source: 'NASA FIRMS / VIIRS',
    acqDate: 'Today',
    acqTime: '12:05 UTC',
    estimatedAreaHectares: 22.0,
    riskScore: 94,
  }
];

export const FLOOD_INUNDATION_ZONES: FloodInundationFeature[] = [
  {
    id: 'flood-1',
    basinName: 'Bhadbhada Sluice Spillway Catchment',
    lat: 23.2180,
    lng: 77.3690,
    radiusKm: 3.8,
    waterLevelMeters: 504.6,
    thresholdMeters: 505.2,
    saturationPercent: 89,
    flowStatus: 'Spillway Active',
    riskScore: 82,
  },
  {
    id: 'flood-2',
    basinName: 'Patra Canal Low-lying Urban Sump',
    lat: 23.2750,
    lng: 77.4080,
    radiusKm: 2.4,
    waterLevelMeters: 3.4,
    thresholdMeters: 3.8,
    saturationPercent: 84,
    flowStatus: 'Elevated Surge',
    riskScore: 76,
  },
  {
    id: 'flood-3',
    basinName: 'Halali River Downstream Inundation Zone',
    lat: 23.4200,
    lng: 77.5100,
    radiusKm: 5.2,
    waterLevelMeters: 12.1,
    thresholdMeters: 13.0,
    saturationPercent: 78,
    flowStatus: 'Moderate Drainage',
    riskScore: 64,
  }
];

export const SHELTERS_AND_HOSPITALS: ShelterHospitalFeature[] = [
  {
    id: 'hospital-bhopal-1',
    name: 'AIIMS Bhopal Apex Emergency Center',
    type: 'Hospital',
    lat: 23.2065,
    lng: 77.4590,
    address: 'Saket Nagar, Bhopal, MP 462020',
    phone: '+91-755-2672317',
    totalCapacity: 960,
    availableCapacity: 142,
    hasOxygenSupply: true,
    hasAirPurification: true,
    distanceKm: 3.8,
  },
  {
    id: 'hospital-bhopal-2',
    name: 'Hamidia Hospital & Gandhi Medical College',
    type: 'Hospital',
    lat: 23.2580,
    lng: 77.3910,
    address: 'Royal Market, Sultania Rd, Bhopal',
    phone: '+91-755-2540222',
    totalCapacity: 750,
    availableCapacity: 88,
    hasOxygenSupply: true,
    hasAirPurification: true,
    distanceKm: 2.1,
  },
  {
    id: 'shelter-bhopal-1',
    name: 'Govindpura Civil Defense Relief Shelter',
    type: 'Civil Defense Shelter',
    lat: 23.2620,
    lng: 77.4520,
    address: 'BHEL Sector B Community Complex, Bhopal',
    phone: '112 / +91-755-2588100',
    totalCapacity: 1200,
    availableCapacity: 780,
    hasOxygenSupply: true,
    hasAirPurification: true,
    distanceKm: 4.2,
  },
  {
    id: 'shelter-bhopal-2',
    name: 'MP Nagar Red Cross Emergency Cooling Shelter',
    type: 'Relief Camp',
    lat: 23.2340,
    lng: 77.4280,
    address: 'Zone-I, Maharana Pratap Nagar, Bhopal',
    phone: '+91-755-2551400',
    totalCapacity: 450,
    availableCapacity: 210,
    hasOxygenSupply: false,
    hasAirPurification: true,
    distanceKm: 1.6,
  }
];

export const CITIZEN_REPORTS_GEO: CitizenIncidentPin[] = [
  {
    id: 'cit-1',
    title: 'Severe stubble burning near Sukhi Sewania highway - Citizen Water Dousing Underway',
    category: 'Illegal Crop Burning',
    lat: 23.1680,
    lng: 77.4190,
    locationName: 'Kolar Road / Sukhi Sewania Rural Flank',
    timestamp: '14 mins ago',
    reporterName: 'Vikram Patel & Community Brigade',
    corroborations: 28,
    status: 'Dispatched',
    imageUrl: '/images/wildfire-citizen-action.png',
  },
  {
    id: 'cit-smog',
    title: 'Severe atmospheric particulate smog capping Upper Lake basin',
    category: 'Forest Flame',
    lat: 23.2550,
    lng: 77.4120,
    locationName: 'Upper Lake Elevated Ridge, Bhopal',
    timestamp: '26 mins ago',
    reporterName: 'Sunita Meena (AirWatch)',
    corroborations: 42,
    status: 'Verified by Authority',
    imageUrl: '/images/smog-haze-city.png',
  },
  {
    id: 'cit-2',
    title: 'Acrid chemical vapor plume escaping near Mandideep flank',
    category: 'Chemical Odor',
    lat: 23.1450,
    lng: 77.5180,
    locationName: 'Mandideep Industrial Sector 3',
    timestamp: '48 mins ago',
    reporterName: 'Dr. Anita Joshi',
    corroborations: 34,
    status: 'Verified by Authority',
    imageUrl: '/images/smog-haze-city.png',
  },
  {
    id: 'cit-3',
    title: 'Storm sewer culvert choked with plastic; water flooding lane',
    category: 'Drainage Blockage',
    lat: 23.2680,
    lng: 77.3820,
    locationName: 'Old City, Peer Gate Outflow',
    timestamp: '1 hour ago',
    reporterName: 'Mohammad Farooq',
    corroborations: 12,
    status: 'Investigating',
    imageUrl: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80',
  }
];

// 5x5 Grid around Bhopal (Lat: 23.2599, Lon: 77.4126) for simulated spatial heatmap
// Comprehensive 20km - 30km Regional Grid covering Bhopal Metropolitan Area & Surrounding Belt
export const BHOPAL_GRID_CELLS = [
  // --- South Region (20 - 30 km: Mandideep, Obaidullaganj, Kerwa & Kolar Dam buffer) ---
  { lat: 23.05, lng: 77.24, aqi: 62,  category: 'Good',         temp: 29.5, floodRisk: 25 },
  { lat: 23.05, lng: 77.32, aqi: 68,  category: 'Good',         temp: 29.8, floodRisk: 30 },
  { lat: 23.05, lng: 77.40, aqi: 110, category: 'Moderate',     temp: 31.0, floodRisk: 28 },
  { lat: 23.05, lng: 77.48, aqi: 195, category: 'Moderate',     temp: 33.2, floodRisk: 32 },
  { lat: 23.05, lng: 77.54, aqi: 240, category: 'Poor',         temp: 34.5, floodRisk: 30 },
  { lat: 23.05, lng: 77.62, aqi: 145, category: 'Moderate',     temp: 32.0, floodRisk: 22 },

  { lat: 23.10, lng: 77.20, aqi: 72,  category: 'Satisfactory', temp: 30.0, floodRisk: 28 },
  { lat: 23.10, lng: 77.28, aqi: 65,  category: 'Good',         temp: 29.6, floodRisk: 35 },
  { lat: 23.10, lng: 77.36, aqi: 78,  category: 'Satisfactory', temp: 30.2, floodRisk: 42 },
  { lat: 23.10, lng: 77.44, aqi: 155, category: 'Moderate',     temp: 32.5, floodRisk: 30 },
  { lat: 23.10, lng: 77.52, aqi: 255, category: 'Poor',         temp: 34.8, floodRisk: 35 },
  { lat: 23.10, lng: 77.60, aqi: 175, category: 'Moderate',     temp: 33.0, floodRisk: 26 },

  // --- South-Central & Suburbs (10 - 20 km: Misrod, Ratibad, Kolar Road, Shahpura) ---
  { lat: 23.15, lng: 77.22, aqi: 82,  category: 'Satisfactory', temp: 30.4, floodRisk: 32 },
  { lat: 23.15, lng: 77.30, aqi: 75,  category: 'Satisfactory', temp: 30.1, floodRisk: 40 },
  { lat: 23.15, lng: 77.38, aqi: 98,  category: 'Satisfactory', temp: 31.0, floodRisk: 48 },
  { lat: 23.15, lng: 77.44, aqi: 165, category: 'Moderate',     temp: 32.8, floodRisk: 36 },
  { lat: 23.15, lng: 77.50, aqi: 190, category: 'Moderate',     temp: 33.5, floodRisk: 34 },
  { lat: 23.15, lng: 77.58, aqi: 185, category: 'Moderate',     temp: 33.1, floodRisk: 28 },

  { lat: 23.20, lng: 77.22, aqi: 95,  category: 'Satisfactory', temp: 30.8, floodRisk: 35 },
  { lat: 23.20, lng: 77.28, aqi: 88,  category: 'Satisfactory', temp: 30.5, floodRisk: 45 },
  { lat: 23.20, lng: 77.35, aqi: 112, category: 'Moderate',     temp: 31.2, floodRisk: 34 },
  { lat: 23.20, lng: 77.41, aqi: 168, category: 'Moderate',     temp: 33.1, floodRisk: 30 },
  { lat: 23.20, lng: 77.47, aqi: 180, category: 'Moderate',     temp: 32.8, floodRisk: 25 },
  { lat: 23.20, lng: 77.56, aqi: 215, category: 'Poor',         temp: 34.2, floodRisk: 28 },

  // --- Central Urban Core (0 - 10 km: MP Nagar, TT Nagar, Upper Lake, Govindpura) ---
  { lat: 23.24, lng: 77.20, aqi: 118, category: 'Moderate',     temp: 31.2, floodRisk: 30 },
  { lat: 23.24, lng: 77.28, aqi: 92,  category: 'Satisfactory', temp: 30.6, floodRisk: 48 },
  { lat: 23.24, lng: 77.35, aqi: 86,  category: 'Satisfactory', temp: 30.2, floodRisk: 55 },
  { lat: 23.24, lng: 77.41, aqi: 178, category: 'Moderate',     temp: 33.8, floodRisk: 65 },
  { lat: 23.24, lng: 77.46, aqi: 245, category: 'Poor',         temp: 35.2, floodRisk: 40 },
  { lat: 23.24, lng: 77.55, aqi: 230, category: 'Poor',         temp: 34.6, floodRisk: 32 },

  { lat: 23.27, lng: 77.22, aqi: 115, category: 'Moderate',     temp: 31.0, floodRisk: 30 },
  { lat: 23.27, lng: 77.30, aqi: 98,  category: 'Satisfactory', temp: 30.5, floodRisk: 44 },
  { lat: 23.27, lng: 77.37, aqi: 94,  category: 'Satisfactory', temp: 30.4, floodRisk: 60 },
  { lat: 23.27, lng: 77.43, aqi: 188, category: 'Moderate',     temp: 33.6, floodRisk: 52 },
  { lat: 23.27, lng: 77.49, aqi: 265, category: 'Poor',         temp: 35.0, floodRisk: 38 },
  { lat: 23.27, lng: 77.58, aqi: 225, category: 'Poor',         temp: 34.2, floodRisk: 28 },

  // --- North-Central (10 - 20 km: Airport, Karond, Bhanpur, Sukhi Sewaniya) ---
  { lat: 23.32, lng: 77.22, aqi: 105, category: 'Moderate',     temp: 30.8, floodRisk: 28 },
  { lat: 23.32, lng: 77.30, aqi: 120, category: 'Moderate',     temp: 31.1, floodRisk: 35 },
  { lat: 23.32, lng: 77.38, aqi: 145, category: 'Moderate',     temp: 32.0, floodRisk: 42 },
  { lat: 23.32, lng: 77.44, aqi: 275, category: 'Poor',         temp: 35.4, floodRisk: 35 },
  { lat: 23.32, lng: 77.52, aqi: 180, category: 'Moderate',     temp: 33.2, floodRisk: 30 },
  { lat: 23.32, lng: 77.62, aqi: 125, category: 'Moderate',     temp: 31.8, floodRisk: 24 },

  { lat: 23.37, lng: 77.24, aqi: 96,  category: 'Satisfactory', temp: 30.2, floodRisk: 26 },
  { lat: 23.37, lng: 77.32, aqi: 110, category: 'Moderate',     temp: 30.8, floodRisk: 30 },
  { lat: 23.37, lng: 77.40, aqi: 165, category: 'Moderate',     temp: 32.4, floodRisk: 34 },
  { lat: 23.37, lng: 77.48, aqi: 195, category: 'Moderate',     temp: 33.5, floodRisk: 30 },
  { lat: 23.37, lng: 77.56, aqi: 155, category: 'Moderate',     temp: 32.2, floodRisk: 25 },
  { lat: 23.37, lng: 77.64, aqi: 85,  category: 'Satisfactory', temp: 29.8, floodRisk: 20 },

  // --- North Region (20 - 30 km: Berasia, Gunga, Northern Stubble & Farmland Plains) ---
  { lat: 23.44, lng: 77.24, aqi: 88,  category: 'Satisfactory', temp: 29.6, floodRisk: 22 },
  { lat: 23.44, lng: 77.32, aqi: 102, category: 'Moderate',     temp: 30.4, floodRisk: 25 },
  { lat: 23.44, lng: 77.40, aqi: 185, category: 'Moderate',     temp: 32.8, floodRisk: 28 },
  { lat: 23.44, lng: 77.48, aqi: 205, category: 'Poor',         temp: 33.8, floodRisk: 26 },
  { lat: 23.44, lng: 77.56, aqi: 140, category: 'Moderate',     temp: 31.6, floodRisk: 22 },
  { lat: 23.44, lng: 77.64, aqi: 78,  category: 'Satisfactory', temp: 29.4, floodRisk: 20 },

  { lat: 23.48, lng: 77.30, aqi: 92,  category: 'Satisfactory', temp: 29.8, floodRisk: 20 },
  { lat: 23.48, lng: 77.38, aqi: 155, category: 'Moderate',     temp: 31.5, floodRisk: 24 },
  { lat: 23.48, lng: 77.44, aqi: 198, category: 'Moderate',     temp: 33.0, floodRisk: 25 },
  { lat: 23.48, lng: 77.52, aqi: 165, category: 'Moderate',     temp: 32.1, floodRisk: 22 },
  { lat: 23.48, lng: 77.60, aqi: 82,  category: 'Satisfactory', temp: 29.5, floodRisk: 18 },
];

export interface BhopalNeighborhood {
  id: string;
  name: string;
  hindiName: string;
  category: 'Commercial Hub' | 'Residential Colony' | 'Industrial Zone' | 'Ecological Lake' | 'Transit Hub';
  lat: number;
  lng: number;
  description: string;
  aqiBaseline: number;
  dominantSource: string;
}

export const BHOPAL_NEIGHBORHOODS: BhopalNeighborhood[] = [
  // --- Central Urban Core ---
  {
    id: 'mp-nagar',
    name: 'MP Nagar (Zone I & II)',
    hindiName: 'एमपी नगर',
    category: 'Commercial Hub',
    lat: 23.2330,
    lng: 77.4325,
    description: 'Bhopal central commercial district, DB City Mall, press complex & coaching zone.',
    aqiBaseline: 188,
    dominantSource: 'Dense vehicular exhaust and commercial activity'
  },
  {
    id: 'tt-nagar',
    name: 'TT Nagar (New Market)',
    hindiName: 'टीटी नगर',
    category: 'Commercial Hub',
    lat: 23.2370,
    lng: 77.4010,
    description: 'Civic hub, New Market, TT Nagar Stadium, and state administrative offices.',
    aqiBaseline: 142,
    dominantSource: 'Commercial traffic & micro-particulate road dust'
  },
  {
    id: 'arera-colony',
    name: 'Arera Colony (E-1 to E-7)',
    hindiName: 'अरेरा कॉलोनी',
    category: 'Residential Colony',
    lat: 23.2120,
    lng: 77.4350,
    description: 'Premier green canopy residential sector, 10 Number Market & Bittan Market.',
    aqiBaseline: 110,
    dominantSource: 'Moderate localized traffic, dense green foliage'
  },
  {
    id: 'kolar-road',
    name: 'Kolar Road & Sarvadharma',
    hindiName: 'कोलार रोड',
    category: 'Residential Colony',
    lat: 23.1850,
    lng: 77.4210,
    description: 'Rapidly growing residential corridor along Kolar river basin.',
    aqiBaseline: 165,
    dominantSource: 'Road widening construction dust & suburban traffic'
  },
  {
    id: 'shahpura',
    name: 'Shahpura & Shahpura Lake',
    hindiName: 'शाहपुरा झील',
    category: 'Ecological Lake',
    lat: 23.2050,
    lng: 77.4240,
    description: 'Urban wetland basin, jogging track, and multi-sector colonies.',
    aqiBaseline: 118,
    dominantSource: 'Lake breeze dispersion, moderate vehicular flow'
  },
  {
    id: 'bhel-township',
    name: 'BHEL Township & Habibganj',
    hindiName: 'भेल टाउनशिप',
    category: 'Residential Colony',
    lat: 23.2510,
    lng: 77.4850,
    description: 'Planned industrial township with wide tree-lined avenues and sports complexes.',
    aqiBaseline: 135,
    dominantSource: 'Moderate industrial peripheral emissions'
  },
  {
    id: 'govindpura',
    name: 'Govindpura Industrial Hub',
    hindiName: 'गोविंदपुरा',
    category: 'Industrial Zone',
    lat: 23.2650,
    lng: 77.4520,
    description: 'Major engineering, fabrication, and manufacturing belt of Bhopal.',
    aqiBaseline: 245,
    dominantSource: 'Industrial fabrication fumes & diesel freight traffic'
  },
  {
    id: 'upper-lake',
    name: 'Upper Lake & VIP Road',
    hindiName: 'बड़ा तालाब (वीआईपी रोड)',
    category: 'Ecological Lake',
    lat: 23.2510,
    lng: 77.3820,
    description: 'Ramsar wetland site, Raja Bhoj Statue, and waterfront promenade.',
    aqiBaseline: 92,
    dominantSource: 'Clean lake water surface convection'
  },
  {
    id: 'rani-kamlapati',
    name: 'Rani Kamlapati Station',
    hindiName: 'रानी कमलापति स्टेशन',
    category: 'Transit Hub',
    lat: 23.2215,
    lng: 77.4410,
    description: 'World-class redeveloped transit terminus connecting Bhopal to all metros.',
    aqiBaseline: 165,
    dominantSource: 'Locomotive diesel, passenger taxis, and station concourse'
  },
  {
    id: 'lalghati',
    name: 'Lalghati & Airport Link',
    hindiName: 'लालघाटी',
    category: 'Transit Hub',
    lat: 23.2820,
    lng: 77.3680,
    description: 'Gateway to Raja Bhoj Airport and Indore-Jaipur highway junction.',
    aqiBaseline: 155,
    dominantSource: 'Highway truck transit & airport link traffic'
  },
  {
    id: 'ayodhya-bypass',
    name: 'Ayodhya Bypass & Karond',
    hindiName: 'अयोध्या बायपास',
    category: 'Residential Colony',
    lat: 23.3050,
    lng: 77.4420,
    description: 'Northern logistics ring, agricultural wholesale mandi, and bypass colonies.',
    aqiBaseline: 210,
    dominantSource: 'Heavy truck diesel particulate & agricultural mandi dust'
  },
  {
    id: 'old-bhopal',
    name: 'Old City (Chowk & Moti Masjid)',
    hindiName: 'पुराना भोपाल (चौक)',
    category: 'Commercial Hub',
    lat: 23.2620,
    lng: 77.4020,
    description: 'Historic walled city markets, dense heritage alleys, and bazaar trade.',
    aqiBaseline: 178,
    dominantSource: 'Dense narrow-lane scooter exhaust & bazaar stalls'
  },

  // --- South & South-East (15 - 25 km: Mandideep, Misrod, Kerwa/Kolar Dam) ---
  {
    id: 'mandideep-industrial',
    name: 'Mandideep Industrial Growth Center',
    hindiName: 'मंडीदीप औद्योगिक क्षेत्र',
    category: 'Industrial Zone',
    lat: 23.0880,
    lng: 77.5180,
    description: 'Major national manufacturing hub with pharmaceutical, electro-chemical, and engineering factories (22 km South).',
    aqiBaseline: 248,
    dominantSource: 'Heavy manufacturing emissions & chemical processing'
  },
  {
    id: 'misrod-corridor',
    name: 'Misrod & Ratanpur Highway Belt',
    hindiName: 'मिसरोद एवं रतनपुर',
    category: 'Commercial Hub',
    lat: 23.1550,
    lng: 77.4780,
    description: 'Fast-expanding southern logistics and educational belt on NH-46 (16 km South-East).',
    aqiBaseline: 182,
    dominantSource: 'High-density highway freight traffic & infrastructure expansion'
  },
  {
    id: 'kerwa-dam',
    name: 'Kerwa & Kolar Dam Catchment Reserve',
    hindiName: 'केरवा एवं कोलार डैम अभयारण्य',
    category: 'Ecological Lake',
    lat: 23.1180,
    lng: 77.3750,
    description: 'Pristine forested reservoir basin and eco-tourism catchment zone (20 km South-West).',
    aqiBaseline: 62,
    dominantSource: 'Dense teak forest canopy & zero industrial contamination'
  },

  // --- West & South-West (15 - 28 km: Ratibad, Phanda, Barkhera) ---
  {
    id: 'ratibad-educational',
    name: 'Ratibad & Neelbad Eco Campus Belt',
    hindiName: 'रातीबड़ एवं नीलबड़',
    category: 'Residential Colony',
    lat: 23.1680,
    lng: 77.3180,
    description: 'Sprawling green university campuses and low-density organic farming belt (16 km South-West).',
    aqiBaseline: 76,
    dominantSource: 'Green canopy filtering, light educational vehicle flow'
  },
  {
    id: 'phanda-sehore',
    name: 'Phanda Toll & Sehore Highway Junction',
    hindiName: 'फंदा टोल / सीहोर हाईवे जंक्शन',
    category: 'Transit Hub',
    lat: 23.2120,
    lng: 77.2050,
    description: 'Western industrial logistics gateway connecting Bhopal to Indore corridor (24 km West).',
    aqiBaseline: 135,
    dominantSource: 'Intercity commercial buses & freight highway emission'
  },
  {
    id: 'barkhera-salaam',
    name: 'Barkhera Salaam & Western Farmlands',
    hindiName: 'बरखेड़ा सलाम ग्रामीण अंचल',
    category: 'Residential Colony',
    lat: 23.2850,
    lng: 77.1950,
    description: 'Western rural outskirts with undulating scrub groves and fresh westerly air (22 km West).',
    aqiBaseline: 88,
    dominantSource: 'Seasonal agricultural tillage dust'
  },

  // --- North & North-East (15 - 30 km: Bhanpur, Sukhi Sewaniya, Berasia) ---
  {
    id: 'bhanpur-landfill',
    name: 'Bhanpur & Karond Waste Facility Buffer',
    hindiName: 'भानपुर खंती एवं करोंद मंडी',
    category: 'Industrial Zone',
    lat: 23.3150,
    lng: 77.4300,
    description: 'Regional municipal remediation landfill and major wholesale grain logistics hub (14 km North).',
    aqiBaseline: 268,
    dominantSource: 'Methane decomposition flares & heavy diesel tractor queues'
  },
  {
    id: 'sukhi-sewaniya',
    name: 'Sukhi Sewaniya Agro-Logistics Center',
    hindiName: 'सूखी सेवनिया रेलवे जंक्शन',
    category: 'Transit Hub',
    lat: 23.3550,
    lng: 77.5100,
    description: 'Freight railway transshipment depot and food grain storage facilities (18 km North-East).',
    aqiBaseline: 172,
    dominantSource: 'Diesel locomotive shunting & grain warehouse dust'
  },
  {
    id: 'berasia-agricultural',
    name: 'Berasia Agricultural Stubble & Scrub Plains',
    hindiName: 'बैरसिया कृषि एवं पराली क्षेत्र',
    category: 'Residential Colony',
    lat: 23.4750,
    lng: 77.4200,
    description: 'Broad northern agricultural heartland known for extensive wheat cultivation (28 km North).',
    aqiBaseline: 198,
    dominantSource: 'Biomass crop residue burning & unpaved farm access roads'
  },

  // --- East (15 - 25 km: Bilkhiriya, Salamatpur) ---
  {
    id: 'bilkhiriya-industrial',
    name: 'Bilkhiriya & Raisen Highway Industrial Corridor',
    hindiName: 'बिलखिरिया / रायसेन रोड औद्योगिक बेल्ट',
    category: 'Industrial Zone',
    lat: 23.2850,
    lng: 77.5950,
    description: 'Heavy engineering, packaging units, and brick kiln clusters along NH-146 (22 km East).',
    aqiBaseline: 228,
    dominantSource: 'Brick kiln chimneys & asphalt road heating emissions'
  }
];

