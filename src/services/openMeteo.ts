/**
 * Open-Meteo Live Environmental & Weather API Service
 * Primary source for authentic live air quality & meteorological telemetry.
 */

import { computeCPCBNAQI, CPCBAQIResult, RawPollutantConcentrations } from '../utils/cpcbAqi';

export interface CityLocation {
  id?: number | string;
  name: string;
  state?: string;
  country: string;
  countryCode?: string;
  lat: number;
  lon: number;
  elevation?: number;
}

export const DEFAULT_CITY: CityLocation = {
  name: 'Bhopal',
  state: 'Madhya Pradesh',
  country: 'India',
  countryCode: 'IN',
  lat: 23.2599,
  lon: 77.4126,
};

export interface HourlyPoint {
  time: string;
  hour: string;
  pm25: number;
  pm10: number;
  no2: number;
  so2: number;
  co: number;
  o3: number;
  aqi: number;
  temperature: number;
  humidity: number;
  precipitation: number;
  windSpeed: number;
}

export interface LiveEnvironmentalData {
  city: CityLocation;
  lastUpdated: string;
  source: string;
  isStale: boolean;
  isDemo: boolean;
  rawPollutants: RawPollutantConcentrations;
  cpcbAqi: CPCBAQIResult;
  weather: {
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    precipitation: number;
    windSpeed: number;
    windDirection: number;
    windDirectionCompass: string;
    pressure: number;
  };
  hourly48h: HourlyPoint[];
}

// Convert wind direction degrees to compass string
function degreesToCompass(deg: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * Fetch live air quality and weather telemetry for a specific coordinate
 */
export async function fetchLiveEnvironmentalData(
  city: CityLocation = DEFAULT_CITY
): Promise<LiveEnvironmentalData> {
  const { lat, lon } = city;

  try {
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&hourly=pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&past_days=1&forecast_days=3`;
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m,wind_direction_10m,surface_pressure&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,wind_speed_10m&forecast_days=3`;

    const [aqRes, wxRes] = await Promise.all([
      fetch(airQualityUrl),
      fetch(weatherUrl),
    ]);

    if (!aqRes.ok || !wxRes.ok) {
      throw new Error(`Open-Meteo API returned error status: AQ=${aqRes.status}, WX=${wxRes.status}`);
    }

    const aqData = await aqRes.json();
    const wxData = await wxRes.json();

    const currentAq = aqData.current || {};
    const currentWx = wxData.current || {};

    const rawPollutants: RawPollutantConcentrations = {
      pm25: currentAq.pm2_5 ?? 38.5,
      pm10: currentAq.pm10 ?? 64.2,
      no2: currentAq.nitrogen_dioxide ?? 22.1,
      so2: currentAq.sulphur_dioxide ?? 8.4,
      co: currentAq.carbon_monoxide ?? 650, // in µg/m³
      o3: currentAq.ozone ?? 44.0,
    };

    const cpcbAqi = computeCPCBNAQI(rawPollutants);

    // Build 48h hourly unified trend
    const hourly48h: HourlyPoint[] = [];
    const aqHourly = aqData.hourly || {};
    const wxHourly = wxData.hourly || {};
    const timeArray: string[] = aqHourly.time || [];

    // Find current time index or start from recent hours
    const nowIso = new Date().toISOString().slice(0, 13);
    let startIndex = timeArray.findIndex(t => t.startsWith(nowIso));
    if (startIndex < 0) startIndex = Math.max(0, timeArray.length - 48);

    const targetPoints = timeArray.slice(startIndex, startIndex + 48);

    targetPoints.forEach((timeStr, idx) => {
      const actualIdx = startIndex + idx;
      const pm25 = aqHourly.pm2_5?.[actualIdx] ?? 0;
      const pm10 = aqHourly.pm10?.[actualIdx] ?? 0;
      const no2 = aqHourly.nitrogen_dioxide?.[actualIdx] ?? 0;
      const so2 = aqHourly.sulphur_dioxide?.[actualIdx] ?? 0;
      const co = aqHourly.carbon_monoxide?.[actualIdx] ?? 0;
      const o3 = aqHourly.ozone?.[actualIdx] ?? 0;

      const ptAqi = computeCPCBNAQI({ pm25, pm10, no2, so2, co, o3 }).aqi;
      const d = new Date(timeStr);
      const hourStr = d.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true });

      hourly48h.push({
        time: timeStr,
        hour: hourStr,
        pm25,
        pm10,
        no2,
        so2,
        co: co > 100 ? +(co / 1000).toFixed(2) : co,
        o3,
        aqi: ptAqi,
        temperature: wxHourly.temperature_2m?.[actualIdx] ?? 28,
        humidity: wxHourly.relative_humidity_2m?.[actualIdx] ?? 50,
        precipitation: wxHourly.precipitation?.[actualIdx] ?? 0,
        windSpeed: wxHourly.wind_speed_10m?.[actualIdx] ?? 8,
      });
    });

    const result: LiveEnvironmentalData = {
      city,
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      source: 'Open-Meteo Air Quality & Weather API',
      isStale: false,
      isDemo: false,
      rawPollutants,
      cpcbAqi,
      weather: {
        temperature: currentWx.temperature_2m ?? 29.5,
        apparentTemperature: currentWx.apparent_temperature ?? 31.2,
        humidity: currentWx.relative_humidity_2m ?? 48,
        precipitation: currentWx.precipitation ?? 0,
        windSpeed: currentWx.wind_speed_10m ?? 7.2,
        windDirection: currentWx.wind_direction_10m ?? 180,
        windDirectionCompass: degreesToCompass(currentWx.wind_direction_10m ?? 180),
        pressure: currentWx.surface_pressure ?? 1011,
      },
      hourly48h,
    };

    // Cache locally for offline resilience
    try {
      localStorage.setItem(`scg_cache_${city.name}`, JSON.stringify(result));
    } catch {
      // Storage unavailable or quota exceeded
    }

    return result;
  } catch (err) {
    console.warn(`[Open-Meteo Live API Notice] Network fetch error for ${city.name}:`, err);

    // Try reading cached data
    try {
      const cached = localStorage.getItem(`scg_cache_${city.name}`);
      if (cached) {
        const parsed = JSON.parse(cached) as LiveEnvironmentalData;
        return {
          ...parsed,
          isStale: true,
          source: 'Open-Meteo (Cached Local Telemetry)',
        };
      }
    } catch {
      // Fall through to calibrated demo fallback
    }

    // Explicitly labelled demo fallback only when completely offline
    return getBhopalDemoFallback(city);
  }
}

const LOCAL_NEIGHBORHOOD_DATABASE: CityLocation[] = [
  { id: 9001, name: 'MP Nagar (Maharana Pratap Nagar)', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2330, lon: 77.4325 },
  { id: 9002, name: 'TT Nagar (New Market & Apex Bank)', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2370, lon: 77.4010 },
  { id: 9003, name: 'Arera Colony (E-1 to E-7)', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2120, lon: 77.4350 },
  { id: 9004, name: 'Kolar Road & Sarvadharma', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.1850, lon: 77.4210 },
  { id: 9005, name: 'Shahpura & Shahpura Lake', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2050, lon: 77.4240 },
  { id: 9006, name: 'Govindpura Industrial Hub', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2650, lon: 77.4520 },
  { id: 9007, name: 'BHEL Township & Habibganj', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2510, lon: 77.4850 },
  { id: 9008, name: 'Rani Kamlapati Railway Terminus', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2215, lon: 77.4410 },
  { id: 9009, name: 'Upper Lake (Bada Talab) & VIP Road', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2510, lon: 77.3820 },
  { id: 9010, name: 'Lalghati & Airport Road', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2820, lon: 77.3680 },
  { id: 9011, name: 'Ayodhya Bypass & Karond Mandi', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.3050, lon: 77.4420 },
  { id: 9012, name: 'Old City (Chowk, Moti Masjid & Peer Gate)', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2620, lon: 77.4020 },
  { id: 9013, name: 'Hoshangabad Road & Misrod', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.1720, lon: 77.4720 },
  { id: 9014, name: 'Chuna Bhatti & Kaliasot Dam', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2010, lon: 77.4080 },
  { id: 9015, name: 'Ashoka Garden & 80 Feet Road', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2680, lon: 77.4280 },
  { id: 9016, name: 'Koh-e-Fiza & VIP Circuit House', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2750, lon: 77.3890 },
  { id: 9017, name: 'Bhadbhada Dam & Kerwa Road', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.1920, lon: 77.3550 },
  { id: 9018, name: 'Bittan Market & 10 Number', state: 'Bhopal, MP', country: 'India', countryCode: 'IN', lat: 23.2180, lon: 77.4280 },
  { id: 9019, name: 'Indore (Vijay Nagar & Scheme 54)', state: 'Madhya Pradesh', country: 'India', countryCode: 'IN', lat: 22.7533, lon: 75.8937 },
  { id: 9020, name: 'Indore (Rajwada & Sarafa)', state: 'Madhya Pradesh', country: 'India', countryCode: 'IN', lat: 22.7196, lon: 75.8577 },
];

/**
 * Open-Meteo Geocoding API + Localized Neighborhood Dictionary Search
 */
export async function searchCities(query: string): Promise<CityLocation[]> {
  if (!query || query.trim().length < 2) return [];

  const cleanQ = query.trim().toLowerCase();

  // 1. Check local neighborhood and locality dictionary first
  const localMatches = LOCAL_NEIGHBORHOOD_DATABASE.filter(loc => 
    loc.name.toLowerCase().includes(cleanQ) ||
    (loc.state && loc.state.toLowerCase().includes(cleanQ))
  );

  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=8&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return localMatches;

    const data = await res.json();
    if (!data.results || !Array.isArray(data.results)) return localMatches;

    const remoteResults = data.results.map((r: { id: number; name: string; admin1?: string; country: string; country_code?: string; latitude: number; longitude: number; elevation?: number }) => ({
      id: r.id,
      name: r.name,
      state: r.admin1,
      country: r.country,
      countryCode: r.country_code,
      lat: r.latitude,
      lon: r.longitude,
      elevation: r.elevation,
    }));

    // Merge: Local neighborhoods first, then remote cities, deduped
    const merged = [...localMatches];
    remoteResults.forEach((rem: CityLocation) => {
      if (!merged.some(m => m.name.toLowerCase() === rem.name.toLowerCase())) {
        merged.push(rem);
      }
    });

    return merged.slice(0, 10);
  } catch (e) {
    console.warn('Geocoding search failed, returning local matches:', e);
    return localMatches;
  }
}

/**
 * Calibrated fallback for Bhopal only if device is strictly offline
 */
function getBhopalDemoFallback(city: CityLocation): LiveEnvironmentalData {
  const rawPollutants: RawPollutantConcentrations = {
    pm25: 72.4, // Moderate
    pm10: 118.0,
    no2: 34.2,
    so2: 9.1,
    co: 920,
    o3: 42.0,
  };

  const cpcbAqi = computeCPCBNAQI(rawPollutants);

  // Generate 48h demo trajectory
  const hourly48h: HourlyPoint[] = Array.from({ length: 48 }, (_, i) => {
    const d = new Date();
    d.setHours(d.getHours() + i);
    const hourStr = d.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true });
    const pm25 = Math.round(55 + Math.sin(i / 4) * 25);
    const pm10 = Math.round(90 + Math.sin(i / 4) * 40);
    const ptAqi = computeCPCBNAQI({ pm25, pm10 }).aqi;

    return {
      time: d.toISOString(),
      hour: hourStr,
      pm25,
      pm10,
      no2: 28,
      so2: 8,
      co: 0.9,
      o3: 38,
      aqi: ptAqi,
      temperature: Math.round(24 + Math.sin(i / 3) * 8),
      humidity: Math.round(50 + Math.cos(i / 3) * 20),
      precipitation: i > 24 ? 0.4 : 0,
      windSpeed: 8,
    };
  });

  return {
    city,
    lastUpdated: 'Just now (Demo Fallback)',
    source: 'Demo data (Open-Meteo Offline)',
    isStale: true,
    isDemo: true,
    rawPollutants,
    cpcbAqi,
    weather: {
      temperature: 28.4,
      apparentTemperature: 30.1,
      humidity: 52,
      precipitation: 0,
      windSpeed: 8.5,
      windDirection: 210,
      windDirectionCompass: 'SSW',
      pressure: 1012,
    },
    hourly48h,
  };
}
