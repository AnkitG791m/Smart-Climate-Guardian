import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Share2, 
  Wind, 
  Thermometer, 
  Droplets, 
  Compass, 
  Gauge, 
  BarChart3, 
  Table as TableIcon, 
  Bell, 
  User, 
  Leaf, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { CityLocation, LiveEnvironmentalData } from '../../services/openMeteo';
import { soundService } from '../../services/soundService';

export interface RegionalRecordItem {
  id: string;
  flag: string;
  location: string;
  region: string;
  country: string;
  date: string;
  avgAqi: number;
  avgTemp: number;
  humidity: number;
  status: 'Good' | 'Moderate' | 'Poor' | 'Severe';
  trend: 'up' | 'steady' | 'down';
  weatherDesc: string;
  weatherIcon: 'sunny' | 'cloudy' | 'hazy';
  o3: { value: string; note: string; levelPercent: number };
  co: { value: string; note: string; levelPercent: number };
  no2: { value: string; note: string; levelPercent: number };
  pm25: { value: string; note: string; levelPercent: number };
  windDirection: string;
  windSpeed: string;
  dispersion: 'Good' | 'Moderate' | 'Restricted';
  insights: string;
  groundPhotoUrl: string;
  photoCaption: string;
  photoMetadata: string;
  trendSeries: number[];
}

const REGIONAL_RECORDS_DATA: RegionalRecordItem[] = [
  {
    id: 'solo-id',
    flag: '🇮🇩',
    location: 'Solo, Indonesia',
    region: 'Central Java',
    country: 'Indonesia',
    date: 'Mar 18, 2026',
    avgAqi: 37,
    avgTemp: 20,
    humidity: 64,
    status: 'Good',
    trend: 'up',
    weatherDesc: 'Sunny',
    weatherIcon: 'sunny',
    o3: { value: '0.064 ppm', note: 'Ozone levels are slightly rising', levelPercent: 42 },
    co: { value: '0.9 ppm', note: 'CO levels are within safe limits', levelPercent: 24 },
    no2: { value: '41 ppb', note: 'NO₂ levels are stable', levelPercent: 35 },
    pm25: { value: '18 µg/m³', note: 'PM2.5 levels are slightly decreasing', levelPercent: 28 },
    windDirection: 'WNW',
    windSpeed: '7 km/h',
    dispersion: 'Good',
    insights: 'Air quality remained stable throughout the day with good pollutant levels. Good environmental conditions for outdoor activity and recreation.',
    groundPhotoUrl: '/images/smog-haze-city.png',
    photoCaption: 'Urban Skyline Baseline • Sensor Hub Solo Station 02',
    photoMetadata: 'Solar Radiation: Normal • Visibility > 12km',
    trendSeries: [22, 28, 38, 34, 25, 29, 24, 32],
  },
  {
    id: 'bhopal-tt-nagar',
    flag: '🇮🇳',
    location: 'Bhopal (TT Nagar), India',
    region: 'Madhya Pradesh',
    country: 'India',
    date: 'Oct 03, 2026',
    avgAqi: 142,
    avgTemp: 29,
    humidity: 58,
    status: 'Moderate',
    trend: 'up',
    weatherDesc: 'Hazy Sunshine',
    weatherIcon: 'hazy',
    o3: { value: '0.078 ppm', note: 'Ozone elevated during mid-day solar peak', levelPercent: 58 },
    co: { value: '1.4 mg/m³', note: 'CO levels within acceptable CPCB limit', levelPercent: 48 },
    no2: { value: '52 µg/m³', note: 'NO₂ traffic emissions moderate', levelPercent: 52 },
    pm25: { value: '54 µg/m³', note: 'PM2.5 elevated due to local dust and boundary layer', levelPercent: 62 },
    windDirection: 'WNW',
    windSpeed: '9.4 km/h',
    dispersion: 'Moderate',
    insights: 'CPCB NAQI reads 142 (Moderate). Sensitive individuals and children should minimize outdoor exertion during peak traffic hours.',
    groundPhotoUrl: '/images/father-child-pollution.png',
    photoCaption: 'Sensitive Groups & Child Respiratory Defense • TT Nagar Core',
    photoMetadata: 'School Zone Buffer • Pediatric Inhalation Defense Active',
    trendSeries: [95, 110, 145, 158, 142, 138, 146, 142],
  },
  {
    id: 'bhopal-mandideep',
    flag: '🇮🇳',
    location: 'Bhopal (Mandideep Industrial), India',
    region: 'Madhya Pradesh',
    country: 'India',
    date: 'Oct 03, 2026',
    avgAqi: 248,
    avgTemp: 33,
    humidity: 39,
    status: 'Poor',
    trend: 'down',
    weatherDesc: 'Industrial Heavy Smoke Plume',
    weatherIcon: 'hazy',
    o3: { value: '0.091 ppm', note: 'Heavy chemical reaction in flue plumes', levelPercent: 82 },
    co: { value: '3.4 mg/m³', note: 'High carbon from manufacturing kilns', levelPercent: 88 },
    no2: { value: '84 µg/m³', note: 'Factory stack combustion products', levelPercent: 85 },
    pm25: { value: '142 µg/m³', note: 'Heavy industrial particulate matter', levelPercent: 92 },
    windDirection: 'ENE',
    windSpeed: '6.2 km/h',
    dispersion: 'Restricted',
    insights: 'Mandideep industrial sector experiencing acute stagnant smoke plume. High particulate loading recorded across factories. Mandatory N95 respirators ordered.',
    groundPhotoUrl: '/images/thermal-power-smoke.png',
    photoCaption: 'Mandideep Thermal Emission Stacks • High PM10/SO2 Flue',
    photoMetadata: 'Thermal Stack Array • Flue Velocity 14m/s',
    trendSeries: [160, 195, 230, 260, 275, 255, 248, 248],
  },
  {
    id: 'bhopal-bhanpur',
    flag: '🇮🇳',
    location: 'Bhopal (Bhanpur Landfill Dump), India',
    region: 'Madhya Pradesh',
    country: 'India',
    date: 'Oct 03, 2026',
    avgAqi: 285,
    avgTemp: 34,
    humidity: 35,
    status: 'Poor',
    trend: 'down',
    weatherDesc: 'Landfill Combustion & Heavy Toxic Smoke',
    weatherIcon: 'hazy',
    o3: { value: '0.088 ppm', note: 'Volatile organic compounds smoldering', levelPercent: 80 },
    co: { value: '4.2 mg/m³', note: 'Incomplete municipal waste combustion', levelPercent: 94 },
    no2: { value: '76 µg/m³', note: 'Elevated pyrolysis gases', levelPercent: 78 },
    pm25: { value: '178 µg/m³', note: 'Toxic particulate from open burning', levelPercent: 96 },
    windDirection: 'NNE',
    windSpeed: '5.1 km/h',
    dispersion: 'Restricted',
    insights: 'Bhanpur municipal landfill site reporting active smoldering and refuse burning. Dense black smoke billowing across nearby settlements. Municipal fire units dispatched.',
    groundPhotoUrl: '/images/landfill-smoke-crisis.png',
    photoCaption: 'Bhanpur Open Landfill Dump & Kiln Smoke Plume',
    photoMetadata: 'Waste Dump Smolder • Toxic VOCs & Black Carbon',
    trendSeries: [180, 220, 265, 310, 320, 295, 285, 285],
  },
  {
    id: 'bhopal-kolar',
    flag: '🇮🇳',
    location: 'Bhopal (Kolar Rural Bypass), India',
    region: 'Madhya Pradesh',
    country: 'India',
    date: 'Oct 03, 2026',
    avgAqi: 215,
    avgTemp: 31,
    humidity: 44,
    status: 'Poor',
    trend: 'down',
    weatherDesc: 'Dense Smoke & Scrub Haze',
    weatherIcon: 'hazy',
    o3: { value: '0.082 ppm', note: 'Photochemical smoke reacting with scrub plumes', levelPercent: 68 },
    co: { value: '2.8 mg/m³', note: 'CO spiked near agricultural parcels', levelPercent: 78 },
    no2: { value: '68 µg/m³', note: 'Elevated combustion by-products', levelPercent: 72 },
    pm25: { value: '112 µg/m³', note: 'High particulate smoke from roadside fires', levelPercent: 86 },
    windDirection: 'NE',
    windSpeed: '12 km/h',
    dispersion: 'Restricted',
    insights: 'Active stubble and brush incineration reported. Citizen brigade actively suppressed flames with water buckets. Avoid outdoor running or cycling along bypass.',
    groundPhotoUrl: '/images/wildfire-citizen-action.png',
    photoCaption: 'Citizen Fire Dousing Action • Kolar Outskirts Ground Truth',
    photoMetadata: 'GPS 23.168°N, 77.419°E • Corroborated by 28 Witnesses',
    trendSeries: [120, 150, 195, 230, 245, 220, 215, 215],
  },
  {
    id: 'london-uk',
    flag: '🇬🇧',
    location: 'London, United Kingdom',
    region: 'Greater London',
    country: 'United Kingdom',
    date: 'Mar 19, 2026',
    avgAqi: 48,
    avgTemp: 21,
    humidity: 62,
    status: 'Good',
    trend: 'up',
    weatherDesc: 'Partly Cloudy',
    weatherIcon: 'cloudy',
    o3: { value: '0.045 ppm', note: 'Ozone low across Thames estuary', levelPercent: 32 },
    co: { value: '0.5 ppm', note: 'Low carbon emissions', levelPercent: 18 },
    no2: { value: '38 ppb', note: 'ULEZ zone maintaining low roadside NO₂', levelPercent: 30 },
    pm25: { value: '14 µg/m³', note: 'PM2.5 within WHO target limits', levelPercent: 22 },
    windDirection: 'SW',
    windSpeed: '14 km/h',
    dispersion: 'Good',
    insights: 'Atmospheric dispersion remains favorable with maritime breeze. Air quality index rated clean for all public activities.',
    groundPhotoUrl: '/images/smog-haze-city.png',
    photoCaption: 'Urban Canopy Telemetry • London Central',
    photoMetadata: 'Visibility > 10km • WHO Guideline Compliant',
    trendSeries: [35, 42, 50, 48, 44, 46, 48, 48],
  },
  {
    id: 'manchester-uk',
    flag: '🇬🇧',
    location: 'Manchester, United Kingdom',
    region: 'Greater Manchester',
    country: 'United Kingdom',
    date: 'Mar 18, 2026',
    avgAqi: 58,
    avgTemp: 19,
    humidity: 71,
    status: 'Moderate',
    trend: 'steady',
    weatherDesc: 'Overcast with Mist',
    weatherIcon: 'cloudy',
    o3: { value: '0.052 ppm', note: 'Moderate ozone dispersion', levelPercent: 38 },
    co: { value: '0.7 ppm', note: 'Normal industrial activity', levelPercent: 25 },
    no2: { value: '46 ppb', note: 'Motorway ring road congestion', levelPercent: 44 },
    pm25: { value: '22 µg/m³', note: 'PM2.5 slightly elevated', levelPercent: 36 },
    windDirection: 'W',
    windSpeed: '11 km/h',
    dispersion: 'Moderate',
    insights: 'Moderate air conditions. Moisture and mist slightly retarding urban exhaust dispersion.',
    groundPhotoUrl: '/images/smog-haze-city.png',
    photoCaption: 'Regional Air Monitoring Station 04',
    photoMetadata: 'Humidity: 71% • Air flow steady',
    trendSeries: [45, 52, 60, 58, 56, 59, 58, 58],
  },
  {
    id: 'paris-fr',
    flag: '🇫🇷',
    location: 'Paris, France',
    region: 'Île-de-France',
    country: 'France',
    date: 'Mar 17, 2026',
    avgAqi: 63,
    avgTemp: 18,
    humidity: 68,
    status: 'Moderate',
    trend: 'steady',
    weatherDesc: 'Clear',
    weatherIcon: 'sunny',
    o3: { value: '0.058 ppm', note: 'Ozone concentrations steady', levelPercent: 45 },
    co: { value: '0.8 ppm', note: 'Low carbon emissions', levelPercent: 26 },
    no2: { value: '54 ppb', note: 'Boulevard Périphérique vehicular flow', levelPercent: 50 },
    pm25: { value: '26 µg/m³', note: 'Fine particles moderately elevated', levelPercent: 42 },
    windDirection: 'NE',
    windSpeed: '8 km/h',
    dispersion: 'Moderate',
    insights: 'Moderate pollution episode recorded during morning commuter peaks. Airparif advises sensitive groups to take precautions.',
    groundPhotoUrl: '/images/smog-haze-city.png',
    photoCaption: 'Paris Urban Air Observatory',
    photoMetadata: 'Boundary layer 450m • Sensor calibrated',
    trendSeries: [50, 58, 68, 65, 62, 64, 63, 63],
  },
  {
    id: 'berlin-de',
    flag: '🇩🇪',
    location: 'Berlin, Germany',
    region: 'Brandenburg',
    country: 'Germany',
    date: 'Mar 17, 2026',
    avgAqi: 71,
    avgTemp: 17,
    humidity: 66,
    status: 'Poor',
    trend: 'down',
    weatherDesc: 'Foggy Haze',
    weatherIcon: 'hazy',
    o3: { value: '0.062 ppm', note: 'Photochemical ozone build-up', levelPercent: 50 },
    co: { value: '1.1 ppm', note: 'Heating boiler emissions active', levelPercent: 38 },
    no2: { value: '62 ppb', note: 'Urban canyon trapping vehicular emissions', levelPercent: 60 },
    pm25: { value: '34 µg/m³', note: 'PM2.5 exceeding winter guidelines', levelPercent: 58 },
    windDirection: 'E',
    windSpeed: '5 km/h',
    dispersion: 'Restricted',
    insights: 'Low wind velocity creating shallow inversion pocket. Air quality categorized as Poor for sensitive persons.',
    groundPhotoUrl: '/images/smog-haze-city.png',
    photoCaption: 'Berlin Central Air Station',
    photoMetadata: 'Ground Inversion Cam • Optical depth 0.42',
    trendSeries: [55, 62, 75, 78, 72, 74, 71, 71],
  },
  {
    id: 'amsterdam-nl',
    flag: '🇳🇱',
    location: 'Amsterdam, Netherlands',
    region: 'North Holland',
    country: 'Netherlands',
    date: 'Mar 17, 2026',
    avgAqi: 55,
    avgTemp: 16,
    humidity: 74,
    status: 'Moderate',
    trend: 'steady',
    weatherDesc: 'Coastal Breeze',
    weatherIcon: 'cloudy',
    o3: { value: '0.048 ppm', note: 'North sea marine dispersion', levelPercent: 35 },
    co: { value: '0.6 ppm', note: 'Within normal limits', levelPercent: 20 },
    no2: { value: '44 ppb', note: 'Port and ring road emissions', levelPercent: 40 },
    pm25: { value: '20 µg/m³', note: 'Moderate particulate level', levelPercent: 32 },
    windDirection: 'NW',
    windSpeed: '16 km/h',
    dispersion: 'Good',
    insights: 'Steady maritime winds prevent severe stagnation. Overall conditions acceptable for general public.',
    groundPhotoUrl: '/images/smog-haze-city.png',
    photoCaption: 'Amsterdam Port & Harbor Monitor',
    photoMetadata: 'Wind Speed 16 km/h • High dispersion',
    trendSeries: [48, 50, 58, 56, 54, 55, 55, 55],
  },
  {
    id: 'madrid-es',
    flag: '🇪🇸',
    location: 'Madrid, Spain',
    region: 'Community of Madrid',
    country: 'Spain',
    date: 'Mar 16, 2026',
    avgAqi: 47,
    avgTemp: 22,
    humidity: 48,
    status: 'Good',
    trend: 'up',
    weatherDesc: 'Sunny',
    weatherIcon: 'sunny',
    o3: { value: '0.055 ppm', note: 'Ozone normal for season', levelPercent: 40 },
    co: { value: '0.5 ppm', note: 'Very low CO levels', levelPercent: 16 },
    no2: { value: '36 ppb', note: 'Central low-emission zone effective', levelPercent: 32 },
    pm25: { value: '15 µg/m³', note: 'Clean air threshold maintained', levelPercent: 24 },
    windDirection: 'N',
    windSpeed: '9 km/h',
    dispersion: 'Good',
    insights: 'Clean air mass circulating across central plateau. Outdoor exercise recommended.',
    groundPhotoUrl: '/images/smog-haze-city.png',
    photoCaption: 'Madrid Retiro Environmental Station',
    photoMetadata: 'Clean Plateau Flow • PM2.5: 15 µg/m³',
    trendSeries: [38, 42, 49, 48, 45, 46, 47, 47],
  },
  {
    id: 'rome-it',
    flag: '🇮🇹',
    location: 'Rome, Italy',
    region: 'Lazio',
    country: 'Italy',
    date: 'Mar 16, 2026',
    avgAqi: 48,
    avgTemp: 21,
    humidity: 59,
    status: 'Moderate',
    trend: 'steady',
    weatherDesc: 'Sunny with Light Haze',
    weatherIcon: 'sunny',
    o3: { value: '0.052 ppm', note: 'Mediterranean sunlight generating mild ozone', levelPercent: 38 },
    co: { value: '0.7 ppm', note: 'Safe baseline', levelPercent: 22 },
    no2: { value: '42 ppb', note: 'Moderate urban traffic', levelPercent: 38 },
    pm25: { value: '19 µg/m³', note: 'Light particulate concentration', levelPercent: 30 },
    windDirection: 'SSW',
    windSpeed: '10 km/h',
    dispersion: 'Good',
    insights: 'Favorable atmospheric conditions with sea breeze entering from Ostia coast.',
    groundPhotoUrl: '/images/smog-haze-city.png',
    photoCaption: 'Rome Urban Basin Station 01',
    photoMetadata: 'Marine Influx Active • Healthy baseline',
    trendSeries: [40, 44, 52, 50, 47, 49, 48, 48],
  },
  {
    id: 'copenhagen-dk',
    flag: '🇩🇰',
    location: 'Copenhagen, Denmark',
    region: 'Capital Region',
    country: 'Denmark',
    date: 'Mar 15, 2026',
    avgAqi: 38,
    avgTemp: 15,
    humidity: 78,
    status: 'Good',
    trend: 'up',
    weatherDesc: 'Breezy & Clean',
    weatherIcon: 'sunny',
    o3: { value: '0.040 ppm', note: 'Low ozone concentrations', levelPercent: 25 },
    co: { value: '0.4 ppm', note: 'Minimal carbon signature', levelPercent: 12 },
    no2: { value: '26 ppb', note: 'High bike transit keeping NO₂ low', levelPercent: 22 },
    pm25: { value: '11 µg/m³', note: 'Pristine particulate baseline', levelPercent: 18 },
    windDirection: 'NW',
    windSpeed: '22 km/h',
    dispersion: 'Good',
    insights: 'High wind ventilation and minimal industrial congestion yield optimal clean air indices.',
    groundPhotoUrl: '/images/smog-haze-city.png',
    photoCaption: 'Copenhagen Harbor Eco Sensor',
    photoMetadata: 'Wind 22 km/h • PM2.5: 11 µg/m³',
    trendSeries: [30, 34, 40, 39, 36, 37, 38, 38],
  },
  {
    id: 'warsaw-pl',
    flag: '🇵🇱',
    location: 'Warsaw, Poland',
    region: 'Masovian',
    country: 'Poland',
    date: 'Mar 14, 2026',
    avgAqi: 72,
    avgTemp: 16,
    humidity: 69,
    status: 'Poor',
    trend: 'down',
    weatherDesc: 'Cool & Hazy',
    weatherIcon: 'hazy',
    o3: { value: '0.061 ppm', note: 'Moderate ozone reading', levelPercent: 48 },
    co: { value: '1.2 ppm', note: 'Solid fuel heating residue', levelPercent: 42 },
    no2: { value: '64 ppb', note: 'Trapped arterial traffic exhaust', levelPercent: 64 },
    pm25: { value: '38 µg/m³', note: 'Fine particulate advisory in effect', levelPercent: 65 },
    windDirection: 'SE',
    windSpeed: '6 km/h',
    dispersion: 'Restricted',
    insights: 'Inversion and domestic heating combustion causing stagnation. Sensitive persons should avoid prolonged strenuous activity.',
    groundPhotoUrl: '/images/smog-haze-city.png',
    photoCaption: 'Warsaw Vistula Basin Cam',
    photoMetadata: 'Inversion Stagnation • PM2.5: 38 µg/m³',
    trendSeries: [58, 66, 78, 80, 75, 76, 72, 72],
  },
];

interface RegionalRecordsInspectorViewProps {
  currentCity: CityLocation;
  liveData: LiveEnvironmentalData;
  onSelectCity?: (city: CityLocation) => void;
  onOpenMap?: () => void;
  onOpenChat?: () => void;
  onOpenAlerts?: () => void;
}

export const RegionalRecordsInspectorView: React.FC<RegionalRecordsInspectorViewProps> = ({
  currentCity,
  liveData,
  onSelectCity,
  onOpenMap,
  onOpenChat,
  onOpenAlerts,
}) => {
  const [records] = useState<RegionalRecordItem[]>(REGIONAL_RECORDS_DATA);
  const [selectedRecordId, setSelectedRecordId] = useState<string>('bhopal-tt-nagar');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Good' | 'Moderate' | 'Poor'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const itemsPerPage = 8;

  const selectedRecord = records.find(r => r.id === selectedRecordId) || records[0];

  // Filtering
  const filteredRecords = records.filter(item => {
    const matchesSearch = 
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.region.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const paginatedRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleShare = () => {
    soundService.playAlertChime('info');
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Helper for segmented micro-tick bar (matches the user's reference image exactly!)
  const renderSegmentedBar = (percent: number) => {
    const totalTicks = 28;
    const filledTicks = Math.round((percent / 100) * totalTicks);
    return (
      <div className="flex items-center gap-[2px] h-3.5 my-1.5 overflow-hidden">
        {Array.from({ length: totalTicks }).map((_, idx) => {
          const isFilled = idx < filledTicks;
          let tickColor = '#cbd5e1';
          if (isFilled) {
            if (idx < totalTicks * 0.45) tickColor = '#84cc16'; // lime-500
            else if (idx < totalTicks * 0.75) tickColor = '#eab308'; // yellow-500
            else tickColor = '#f97316'; // orange-500
          }
          return (
            <div
              key={idx}
              className="w-[2.5px] h-full rounded-full transition-colors duration-300"
              style={{ backgroundColor: isFilled ? tickColor : '#e2e8f0' }}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-b from-[#EBF5FF] via-[#F4F9FF] to-[#E3F0FC] p-2 sm:p-4 md:p-6 lg:p-8 flex items-center justify-center font-sans select-none overflow-x-hidden">
      {/* Background Soft Atmospheric Radiance */}
      <div 
        className="fixed inset-0 pointer-events-none opacity-40 bg-cover bg-center transition-opacity"
        style={{
          backgroundImage: `radial-gradient(ellipse at 30% 20%, rgba(47, 128, 237, 0.12), transparent 70%), radial-gradient(ellipse at 80% 80%, rgba(147, 197, 253, 0.18), transparent 70%)`
        }}
      />

      {/* Main Glass Shell Container */}
      <div className="relative z-10 w-full max-w-[1440px] bg-white/95 backdrop-blur-2xl rounded-[32px] sm:rounded-[40px] border border-blue-100 shadow-2xl shadow-blue-500/5 overflow-hidden flex flex-col md:flex-row">
        
        {/* ======================================================== */}
        {/* 1. SLIM LEFT ICON RAIL                                   */}
        {/* ======================================================== */}
        <div className="hidden md:flex flex-col items-center justify-between py-6 px-3 border-r border-slate-200/80 bg-white/70 w-16 shrink-0">
          {/* Top Logo */}
          <div className="w-10 h-10 rounded-2xl bg-white p-1 border border-blue-200/80 shadow-md shadow-blue-500/10 flex items-center justify-center shrink-0">
            <img src="/images/earth-melting-care.png" alt="Save Earth" className="w-full h-full object-contain" />
          </div>

          {/* Navigation Icons Stack */}
          <div className="flex flex-col items-center gap-4 my-auto">
            <button
              onClick={onOpenMap}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-[#2F80ED] hover:bg-blue-50/80 transition-all"
              title="ArcGIS Satellite Map"
            >
              <Compass className="w-5 h-5" />
            </button>

            <button
              onClick={() => soundService.playClick()}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-[#2F80ED] hover:bg-blue-50/80 transition-all"
              title="Live Gauge Telemetry"
            >
              <Gauge className="w-5 h-5" />
            </button>

            <button
              onClick={() => soundService.playClick()}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-[#2F80ED] hover:bg-blue-50/80 transition-all"
              title="Atmospheric Dispersion & Wind"
            >
              <Wind className="w-5 h-5" />
            </button>

            {/* ACTIVE ICON: Historical Records / Table */}
            <button
              className="p-2.5 rounded-2xl bg-[#2F80ED] text-white shadow-md shadow-blue-500/25 transition-all scale-105"
              title="Historical Records & Regional Stations (Active)"
            >
              <TableIcon className="w-5 h-5" />
            </button>

            <button
              onClick={() => soundService.playClick()}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-[#2F80ED] hover:bg-blue-50/80 transition-all"
              title="Trend Analytics"
            >
              <BarChart3 className="w-5 h-5" />
            </button>
          </div>

          {/* Bottom Controls */}
          <div className="flex flex-col items-center gap-3">
            <button
              onClick={onOpenAlerts}
              className="relative p-2.5 rounded-2xl text-slate-400 hover:text-[#FF8A3D] hover:bg-orange-50/80 transition-all"
              title="Emergency Alerts"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
            </button>

            <button
              onClick={onOpenChat}
              className="p-2.5 rounded-2xl text-slate-400 hover:text-[#2F80ED] hover:bg-blue-50/80 transition-all"
              title="Prithvi AI Assistant"
            >
              <Sparkles className="w-5 h-5 text-[#2F80ED]" />
            </button>

            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-100 to-blue-200 flex items-center justify-center text-xs font-bold text-[#2F80ED] border border-blue-200">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* 2. DUAL MAIN PANELS: TABLE (LEFT) & INSPECTOR (RIGHT)    */}
        {/* ======================================================== */}
        <div className="flex-1 flex flex-col xl:flex-row divide-y xl:divide-y-0 xl:divide-x divide-slate-200/80 overflow-hidden">
          
          {/* ====================================================== */}
          {/* LEFT SUB-PANEL: HISTORICAL RECORDS TABLE               */}
          {/* ====================================================== */}
          <div className="w-full xl:w-[60%] p-4 sm:p-6 lg:p-7 flex flex-col justify-between space-y-5 overflow-x-auto">
            <div className="space-y-4">
              {/* Category Pill */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2F80ED] text-[11px] font-bold border border-blue-200/80">
                  <TableIcon className="w-3.5 h-3.5 text-[#2F80ED]" />
                  <span>Historical Data</span>
                </div>

                {onOpenMap && (
                  <button
                    onClick={onOpenMap}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-[#2F80ED] text-white shadow-md shadow-blue-500/20 hover:bg-[#256ec7] transition-all"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Open Satellite Map</span>
                  </button>
                )}
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Historical Records
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Track previous & live environmental conditions across regional stations
                </p>
              </div>

              {/* Search & Filter Bar */}
              <div className="flex items-center gap-2 pt-1">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search locations, countries or stations..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="w-full bg-slate-50/90 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#2F80ED] transition-colors"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  {(['All', 'Good', 'Moderate', 'Poor'] as const).map((st) => (
                    <button
                      key={st}
                      onClick={() => {
                        soundService.playClick();
                        setStatusFilter(st);
                        setCurrentPage(1);
                      }}
                      className={`px-3 py-2 rounded-2xl text-xs font-bold transition-all ${
                        statusFilter === st
                          ? 'bg-[#2F80ED] text-white shadow-md shadow-blue-500/20'
                          : 'bg-slate-100 text-slate-600 hover:text-[#2F80ED] border border-slate-200'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Records Table */}
              <div className="overflow-x-auto rounded-2xl border border-blue-100/90 bg-white/70">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200/80 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-3 px-4">Location ⇅</th>
                      <th className="py-3 px-3">Date ⇅</th>
                      <th className="py-3 px-3 text-center">Avg. AQI ⇅</th>
                      <th className="py-3 px-3 text-center">Avg. Temp ⇅</th>
                      <th className="py-3 px-3 text-center">Status ⇅</th>
                      <th className="py-3 px-3 text-center">Trend ⇅</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {paginatedRecords.map((item) => {
                      const isSelected = item.id === selectedRecord.id;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => {
                            soundService.playClick();
                            setSelectedRecordId(item.id);
                          }}
                          className={`cursor-pointer transition-all duration-200 group ${
                            isSelected
                              ? 'bg-blue-50/80 font-bold border-l-4 border-[#2F80ED]'
                              : 'hover:bg-blue-50/40'
                          }`}
                        >
                          {/* Location with Flag */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <span className="text-base shrink-0">{item.flag}</span>
                              <span className={`truncate text-xs ${isSelected ? 'text-[#2F80ED] font-black' : 'text-slate-800 font-semibold'}`}>
                                {item.location}
                              </span>
                            </div>
                          </td>

                          {/* Date */}
                          <td className="py-3.5 px-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                            {item.date}
                          </td>

                          {/* Avg. AQI */}
                          <td className="py-3.5 px-3 text-center font-mono font-bold text-slate-800">
                            {item.avgAqi}
                          </td>

                          {/* Avg. Temp */}
                          <td className="py-3.5 px-3 text-center font-mono text-slate-700">
                            {item.avgTemp}°C
                          </td>

                          {/* Status Pill */}
                          <td className="py-3.5 px-3 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                              item.status === 'Good'
                                ? 'bg-emerald-100/80 text-emerald-700'
                                : item.status === 'Moderate'
                                ? 'bg-amber-100/80 text-amber-700'
                                : 'bg-rose-100/80 text-rose-700'
                            }`}>
                              {item.status}
                            </span>
                          </td>

                          {/* Trend Icon */}
                          <td className="py-3.5 px-3 text-center">
                            {item.trend === 'up' && (
                              <span className="inline-flex items-center text-emerald-500 font-bold" title="Improving">
                                ↗
                              </span>
                            )}
                            {item.trend === 'steady' && (
                              <span className="inline-flex items-center text-amber-500 font-bold" title="Steady">
                                →
                              </span>
                            )}
                            {item.trend === 'down' && (
                              <span className="inline-flex items-center text-rose-500 font-bold" title="Deteriorating">
                                ↘
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200/80 text-xs text-slate-500">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-100 font-medium"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <div className="flex items-center gap-1 font-mono text-[11px]">
                {Array.from({ length: totalPages || 1 }).map((_, idx) => {
                  const pNum = idx + 1;
                  return (
                    <button
                      key={pNum}
                      onClick={() => setCurrentPage(pNum)}
                      className={`w-7 h-7 rounded-xl font-bold transition-all ${
                        currentPage === pNum
                          ? 'bg-[#2F80ED] text-white shadow-sm'
                          : 'hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      {pNum}
                    </button>
                  );
                })}
              </div>

              <button
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 disabled:opacity-40 hover:bg-slate-100 font-medium"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* ====================================================== */}
          {/* RIGHT SUB-PANEL: DETAILED INSPECTOR & GROUND TRUTH     */}
          {/* ====================================================== */}
          <div className="w-full xl:w-[40%] p-4 sm:p-6 lg:p-7 space-y-4 bg-blue-50/20 overflow-y-auto">
            {/* Header: Flag, Location Name, Date, Share */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{selectedRecord.flag}</span>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {selectedRecord.location}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  {selectedRecord.date} • Ground Station Verified
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#2F80ED] hover:border-[#2F80ED]/40 transition-colors shadow-sm"
                  title="Share Station Dossier"
                >
                  <Share2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => soundService.playClick()}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-[#2F80ED] hover:border-[#2F80ED]/40 transition-colors shadow-sm"
                  title="More Options"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Weather & Status Strip */}
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <span>Weather:</span>
                <span className="font-bold text-slate-800">
                  ☀️ {selectedRecord.weatherDesc}
                </span>
              </span>
              <span className="text-slate-500 font-medium flex items-center gap-1.5">
                <span>Status:</span>
                <span className={`font-black ${
                  selectedRecord.status === 'Good' ? 'text-emerald-600' :
                  selectedRecord.status === 'Moderate' ? 'text-amber-600' :
                  'text-rose-600'
                }`}>
                  {selectedRecord.status}
                </span>
              </span>
            </div>

            {/* 3 Top Stat Cards in a row */}
            <div className="grid grid-cols-3 gap-2.5">
              {/* Avg AQI */}
              <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                  Avg. AQI
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {selectedRecord.avgAqi}
                  </span>
                  <Wind className="w-4 h-4 text-[#2F80ED] shrink-0" />
                </div>
              </div>

              {/* Avg Temperature */}
              <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                  Avg. Temp
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <div className="flex items-center gap-1.5">
                    <img src="/images/climate-change-thermometer.png" alt="Climate Change" className="w-4 h-4 object-contain" />
                    <span className="text-xl font-black text-slate-900 font-mono">
                      {selectedRecord.avgTemp}<span className="text-xs">°C</span>
                    </span>
                  </div>
                  <Thermometer className="w-4 h-4 text-amber-500 shrink-0" />
                </div>
              </div>

              {/* Humidity */}
              <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-sm flex flex-col justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-sans">
                  Humidity
                </span>
                <div className="flex items-baseline justify-between mt-1">
                  <span className="text-xl font-black text-slate-900 font-mono">
                    {selectedRecord.humidity}<span className="text-xs">%</span>
                  </span>
                  <Droplets className="w-4 h-4 text-sky-500 shrink-0" />
                </div>
              </div>
            </div>

            {/* AQI Trend Section with Smooth Curved SVG Chart */}
            <div className="p-4 rounded-2xl bg-white border border-blue-100 shadow-sm space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-slate-800">AQI Trend</span>
                <span className="font-bold text-[#2F80ED] text-[11px]">
                  {selectedRecord.status === 'Good' ? 'Healthy air quality' : `${selectedRecord.status} air quality`}
                </span>
              </div>

              {/* Dynamic Curved SVG Area Chart */}
              <div className="relative h-24 w-full pt-2">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="aqiFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2F80ED" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#2F80ED" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid guide lines */}
                  <line x1="0" y1="20" x2="300" y2="20" stroke="#94a3b8" strokeOpacity="0.15" strokeDasharray="3 3" />
                  <line x1="0" y1="50" x2="300" y2="50" stroke="#94a3b8" strokeOpacity="0.15" strokeDasharray="3 3" />
                  <line x1="0" y1="75" x2="300" y2="75" stroke="#94a3b8" strokeOpacity="0.25" />

                  {/* Smooth spline curve using series */}
                  {(() => {
                    const series = selectedRecord.trendSeries;
                    const maxVal = Math.max(...series, 100);
                    const minVal = Math.min(...series, 0);
                    const range = maxVal - minVal || 1;
                    const pts = series.map((val, i) => {
                      const x = (i / (series.length - 1)) * 300;
                      const y = 70 - ((val - minVal) / range) * 55;
                      return { x, y };
                    });

                    // Build SVG path
                    let d = `M ${pts[0].x} ${pts[0].y}`;
                    for (let i = 0; i < pts.length - 1; i++) {
                      const xc = (pts[i].x + pts[i + 1].x) / 2;
                      const yc = (pts[i].y + pts[i + 1].y) / 2;
                      d += ` Q ${pts[i].x} ${pts[i].y}, ${xc} ${yc}`;
                    }
                    d += ` T ${pts[pts.length - 1].x} ${pts[pts.length - 1].y}`;

                    const areaD = `${d} L 300 75 L 0 75 Z`;

                    return (
                      <>
                        <path d={areaD} fill="url(#aqiFill)" />
                        <path d={d} fill="none" stroke="#2F80ED" strokeWidth="2.5" strokeLinecap="round" />
                        {pts.map((pt, idx) => (
                          <circle
                            key={idx}
                            cx={pt.x}
                            cy={pt.y}
                            r="3.5"
                            fill="#2F80ED"
                            stroke="#ffffff"
                            strokeWidth="1.5"
                          />
                        ))}
                      </>
                    );
                  })()}
                </svg>

                {/* Time stamps axis */}
                <div className="flex justify-between text-[9px] font-mono text-slate-400 mt-1">
                  <span>0.00</span>
                  <span>4.00</span>
                  <span>8.00</span>
                  <span>12.00</span>
                  <span>16.00</span>
                  <span>20.00</span>
                  <span>24.00</span>
                </div>
              </div>
            </div>

            {/* Segmented Micro-Bar Pollutant Meters (O3, CO, NO2, PM2.5) */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Ozone */}
              <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-sm">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-[11px] font-bold text-slate-700">Ozone (O₃)</span>
                  <span className="font-mono text-[11px] font-bold text-slate-900">
                    {selectedRecord.o3.value}
                  </span>
                </div>
                {renderSegmentedBar(selectedRecord.o3.levelPercent)}
                <p className="text-[10px] text-slate-400 line-clamp-1">{selectedRecord.o3.note}</p>
              </div>

              {/* CO */}
              <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-sm">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-[11px] font-bold text-slate-700">Carbon Monoxide</span>
                  <span className="font-mono text-[11px] font-bold text-slate-900">
                    {selectedRecord.co.value}
                  </span>
                </div>
                {renderSegmentedBar(selectedRecord.co.levelPercent)}
                <p className="text-[10px] text-slate-400 line-clamp-1">{selectedRecord.co.note}</p>
              </div>

              {/* NO2 */}
              <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-sm">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-[11px] font-bold text-slate-700">Nitrogen Dioxide</span>
                  <span className="font-mono text-[11px] font-bold text-slate-900">
                    {selectedRecord.no2.value}
                  </span>
                </div>
                {renderSegmentedBar(selectedRecord.no2.levelPercent)}
                <p className="text-[10px] text-slate-400 line-clamp-1">{selectedRecord.no2.note}</p>
              </div>

              {/* PM2.5 */}
              <div className="p-3 rounded-2xl bg-white border border-blue-100 shadow-sm">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-[11px] font-bold text-slate-700">PM2.5</span>
                  <span className="font-mono text-[11px] font-bold text-slate-900">
                    {selectedRecord.pm25.value}
                  </span>
                </div>
                {renderSegmentedBar(selectedRecord.pm25.levelPercent)}
                <p className="text-[10px] text-slate-400 line-clamp-1">{selectedRecord.pm25.note}</p>
              </div>
            </div>

            {/* Wind Direction, Speed & Dispersion Strip */}
            <div className="grid grid-cols-3 gap-2 text-center text-xs p-2.5 rounded-2xl bg-white border border-blue-100 shadow-sm font-mono">
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Wind Direction</span>
                <span className="font-black text-slate-800">{selectedRecord.windDirection}</span>
              </div>
              <div className="border-x border-slate-100">
                <span className="text-[10px] text-slate-400 font-sans block">Speed</span>
                <span className="font-black text-slate-800">{selectedRecord.windSpeed}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-sans block">Dispersion</span>
                <span className="font-black text-emerald-600">{selectedRecord.dispersion}</span>
              </div>
            </div>

            {/* ====================================================== */}
            {/* REAL USER-UPLOADED GROUND-TRUTH FIELD PHOTO EMBED      */}
            {/* ====================================================== */}
            <div className="rounded-2xl overflow-hidden border border-blue-100 bg-white shadow-sm relative group">
              <img
                src={selectedRecord.groundPhotoUrl}
                alt={selectedRecord.photoCaption}
                className="w-full h-36 object-cover object-center group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2 flex items-center gap-1.5">
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-black/75 text-emerald-400 backdrop-blur-md border border-white/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Ground-Truth Photo
                </span>
              </div>
              <div className="p-2.5 bg-white border-t border-slate-100">
                <p className="text-[11px] font-bold text-slate-800 line-clamp-1">
                  {selectedRecord.photoCaption}
                </p>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  {selectedRecord.photoMetadata}
                </p>
              </div>
            </div>

            {/* Environmental Insights Card */}
            <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-1.5">
              <div className="flex items-center gap-1.5 text-[#2F80ED] text-xs font-bold">
                <Sparkles className="w-4 h-4 text-[#2F80ED]" />
                <span>Environmental Insights</span>
              </div>
              <p className="text-[11px] text-slate-700 leading-relaxed font-normal">
                {selectedRecord.insights}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
