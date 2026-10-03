/**
 * Indian Central Pollution Control Board (CPCB) National Air Quality Index (NAQI) Calculation Engine
 * Reference: CPCB NAQI Guidelines & Breakpoints Table
 *
 * Formula:
 * Ip = [ (I_hi - I_lo) / (B_hi - B_lo) ] * (Cp - B_lo) + I_lo
 * AQI = max(Ip) across available pollutants
 */

export type CPCBCategory =
  | 'Good'
  | 'Satisfactory'
  | 'Moderate'
  | 'Poor'
  | 'Very Poor'
  | 'Severe';

export interface CPCBBreakpoint {
  bLo: number;
  bHi: number;
  iLo: number;
  iHi: number;
}

export interface PollutantSubIndex {
  pollutant: 'PM2.5' | 'PM10' | 'NO2' | 'SO2' | 'CO' | 'O3';
  concentration: number;
  unit: string;
  subIndex: number;
  category: CPCBCategory;
}

export interface CPCBAQIResult {
  aqi: number;
  category: CPCBCategory;
  dominantPollutant: 'PM2.5' | 'PM10' | 'NO2' | 'SO2' | 'CO' | 'O3' | 'None';
  color: string;
  textColor: string;
  bgLight: string;
  healthStatement: string;
  healthStatementHi: string;
  subIndices: Record<string, PollutantSubIndex>;
}

// CPCB standard breakpoints
const BREAKPOINTS: Record<string, CPCBBreakpoint[]> = {
  'PM2.5': [
    { bLo: 0, bHi: 30, iLo: 0, iHi: 50 },
    { bLo: 31, bHi: 60, iLo: 51, iHi: 100 },
    { bLo: 61, bHi: 90, iLo: 101, iHi: 200 },
    { bLo: 91, bHi: 120, iLo: 201, iHi: 300 },
    { bLo: 121, bHi: 250, iLo: 301, iHi: 400 },
    { bLo: 251, bHi: 500, iLo: 401, iHi: 500 },
  ],
  'PM10': [
    { bLo: 0, bHi: 50, iLo: 0, iHi: 50 },
    { bLo: 51, bHi: 100, iLo: 51, iHi: 100 },
    { bLo: 101, bHi: 250, iLo: 101, iHi: 200 },
    { bLo: 251, bHi: 350, iLo: 201, iHi: 300 },
    { bLo: 351, bHi: 430, iLo: 301, iHi: 400 },
    { bLo: 431, bHi: 600, iLo: 401, iHi: 500 },
  ],
  'NO2': [
    { bLo: 0, bHi: 40, iLo: 0, iHi: 50 },
    { bLo: 41, bHi: 80, iLo: 51, iHi: 100 },
    { bLo: 81, bHi: 180, iLo: 101, iHi: 200 },
    { bLo: 181, bHi: 280, iLo: 201, iHi: 300 },
    { bLo: 281, bHi: 400, iLo: 301, iHi: 400 },
    { bLo: 401, bHi: 600, iLo: 401, iHi: 500 },
  ],
  'SO2': [
    { bLo: 0, bHi: 40, iLo: 0, iHi: 50 },
    { bLo: 41, bHi: 80, iLo: 51, iHi: 100 },
    { bLo: 81, bHi: 380, iLo: 101, iHi: 200 },
    { bLo: 381, bHi: 800, iLo: 201, iHi: 300 },
    { bLo: 801, bHi: 1600, iLo: 301, iHi: 400 },
    { bLo: 1601, bHi: 2000, iLo: 401, iHi: 500 },
  ],
  'CO': [
    // In mg/m³
    { bLo: 0.0, bHi: 1.0, iLo: 0, iHi: 50 },
    { bLo: 1.1, bHi: 2.0, iLo: 51, iHi: 100 },
    { bLo: 2.1, bHi: 10.0, iLo: 101, iHi: 200 },
    { bLo: 10.1, bHi: 17.0, iLo: 201, iHi: 300 },
    { bLo: 17.1, bHi: 34.0, iLo: 301, iHi: 400 },
    { bLo: 34.1, bHi: 50.0, iLo: 401, iHi: 500 },
  ],
  'O3': [
    { bLo: 0, bHi: 50, iLo: 0, iHi: 50 },
    { bLo: 51, bHi: 100, iLo: 51, iHi: 100 },
    { bLo: 101, bHi: 168, iLo: 101, iHi: 200 },
    { bLo: 169, bHi: 208, iLo: 201, iHi: 300 },
    { bLo: 209, bHi: 748, iLo: 301, iHi: 400 },
    { bLo: 749, bHi: 1000, iLo: 401, iHi: 500 },
  ],
};

/**
 * Calculate CPCB sub-index for a single pollutant
 */
export function calculateSubIndex(
  pollutant: 'PM2.5' | 'PM10' | 'NO2' | 'SO2' | 'CO' | 'O3',
  concentration: number
): number {
  if (concentration < 0 || isNaN(concentration)) return 0;

  const table = BREAKPOINTS[pollutant];
  if (!table) return 0;

  // Handle concentration below lower bound
  if (concentration <= table[0].bLo) {
    return table[0].iLo;
  }

  // Find corresponding breakpoint interval
  for (const bp of table) {
    if (concentration >= bp.bLo && concentration <= bp.bHi) {
      const subIndex =
        ((bp.iHi - bp.iLo) / (bp.bHi - bp.bLo)) * (concentration - bp.bLo) + bp.iLo;
      return Math.round(subIndex);
    }
  }

  // If concentration exceeds the highest breakpoint, cap at 500 (Severe max)
  return 500;
}

/**
 * Determine category from AQI value
 */
export function getCPCBCategory(aqi: number): CPCBCategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

/**
 * Get category styling colors (CPCB standards)
 */
export function getCPCBColorDetails(category: CPCBCategory) {
  switch (category) {
    case 'Good':
      return {
        color: '#00b050',
        textColor: '#14532d',
        bgLight: '#ecfdf5',
        labelHi: 'अच्छा',
      };
    case 'Satisfactory':
      return {
        color: '#84cc16',
        textColor: '#365314',
        bgLight: '#f7fee7',
        labelHi: 'संतोषजनक',
      };
    case 'Moderate':
      return {
        color: '#eab308',
        textColor: '#713f12',
        bgLight: '#fefce8',
        labelHi: 'मध्यम',
      };
    case 'Poor':
      return {
        color: '#f97316',
        textColor: '#7c2d12',
        bgLight: '#fff7ed',
        labelHi: 'खराब',
      };
    case 'Very Poor':
      return {
        color: '#ef4444',
        textColor: '#7f1d1d',
        bgLight: '#fef2f2',
        labelHi: 'बहुत खराब',
      };
    case 'Severe':
    default:
      return {
        color: '#7f1d1d',
        textColor: '#450a0a',
        bgLight: '#fdf2f2',
        labelHi: 'गंभीर',
      };
  }
}

/**
 * CPCB Official Health Advisory Statements
 */
export function getCPCBHealthStatement(category: CPCBCategory): {
  en: string;
  hi: string;
} {
  switch (category) {
    case 'Good':
      return {
        en: 'Minimal impact. Air quality is ideal for all outdoor activities.',
        hi: 'न्यूनतम प्रभाव। वायु गुणवत्ता सभी बाहरी गतिविधियों के लिए आदर्श है।',
      };
    case 'Satisfactory':
      return {
        en: 'Minor breathing discomfort to sensitive people.',
        hi: 'संवेदनशील लोगों को सांस लेने में हल्की परेशानी हो सकती है।',
      };
    case 'Moderate':
      return {
        en: 'Breathing discomfort to people with lung disease such as asthma, and discomfort to humans with heart disease, children and older adults.',
        hi: 'अस्थमा जैसे फेफड़ों के रोग वाले लोगों, हृदय रोगियों, बच्चों और बुजुर्गों को सांस लेने में परेशानी हो सकती है।',
      };
    case 'Poor':
      return {
        en: 'Breathing discomfort to most people on prolonged exposure. Limit prolonged outdoor exertion.',
        hi: 'लंबे समय तक रहने पर अधिकांश लोगों को सांस लेने में परेशानी हो सकती है। बाहरी श्रम सीमित करें।',
      };
    case 'Very Poor':
      return {
        en: 'Respiratory illness to people on prolonged exposure. Significant increase in symptoms for people with lung/heart diseases.',
        hi: 'लंबे समय तक संपर्क में रहने पर श्वसन संबंधी बीमारी हो सकती है। हृदय/फेफड़ों के रोगियों में लक्षण बढ़ सकते हैं।',
      };
    case 'Severe':
    default:
      return {
        en: 'Respiratory effects even on healthy people and serious health impacts on that with lung/heart disease. Avoid all outdoor physical activity.',
        hi: 'स्वस्थ लोगों पर भी श्वसन संबंधी प्रभाव और हृदय/फेफड़ों के रोगियों पर गंभीर प्रभाव। बाहरी शारीरिक गतिविधियों से बचें।',
      };
  }
}

export interface RawPollutantConcentrations {
  pm25?: number; // µg/m³
  pm10?: number; // µg/m³
  no2?: number;  // µg/m³
  so2?: number;  // µg/m³
  co?: number;   // µg/m³ (from Open-Meteo, will be converted to mg/m³)
  o3?: number;   // µg/m³
}

/**
 * Main Pure Function: Compute CPCB NAQI from Raw Open-Meteo concentrations
 */
export function computeCPCBNAQI(raw: RawPollutantConcentrations): CPCBAQIResult {
  const subIndices: Record<string, PollutantSubIndex> = {};

  if (typeof raw.pm25 === 'number' && raw.pm25 >= 0) {
    const idx = calculateSubIndex('PM2.5', raw.pm25);
    subIndices['PM2.5'] = {
      pollutant: 'PM2.5',
      concentration: raw.pm25,
      unit: 'µg/m³',
      subIndex: idx,
      category: getCPCBCategory(idx),
    };
  }

  if (typeof raw.pm10 === 'number' && raw.pm10 >= 0) {
    const idx = calculateSubIndex('PM10', raw.pm10);
    subIndices['PM10'] = {
      pollutant: 'PM10',
      concentration: raw.pm10,
      unit: 'µg/m³',
      subIndex: idx,
      category: getCPCBCategory(idx),
    };
  }

  if (typeof raw.no2 === 'number' && raw.no2 >= 0) {
    const idx = calculateSubIndex('NO2', raw.no2);
    subIndices['NO2'] = {
      pollutant: 'NO2',
      concentration: raw.no2,
      unit: 'µg/m³',
      subIndex: idx,
      category: getCPCBCategory(idx),
    };
  }

  if (typeof raw.so2 === 'number' && raw.so2 >= 0) {
    const idx = calculateSubIndex('SO2', raw.so2);
    subIndices['SO2'] = {
      pollutant: 'SO2',
      concentration: raw.so2,
      unit: 'µg/m³',
      subIndex: idx,
      category: getCPCBCategory(idx),
    };
  }

  if (typeof raw.co === 'number' && raw.co >= 0) {
    // Open-Meteo provides CO in µg/m³ (e.g. 50-800 µg/m³), CPCB standard uses mg/m³ (0.05-5.0 mg/m³)
    const coMgM3 = raw.co > 5 ? +(raw.co / 1000).toFixed(2) : raw.co;
    const idx = calculateSubIndex('CO', coMgM3);
    subIndices['CO'] = {
      pollutant: 'CO',
      concentration: coMgM3,
      unit: 'mg/m³',
      subIndex: idx,
      category: getCPCBCategory(idx),
    };
  }

  if (typeof raw.o3 === 'number' && raw.o3 >= 0) {
    const idx = calculateSubIndex('O3', raw.o3);
    subIndices['O3'] = {
      pollutant: 'O3',
      concentration: raw.o3,
      unit: 'µg/m³',
      subIndex: idx,
      category: getCPCBCategory(idx),
    };
  }

  const entries = Object.values(subIndices);

  if (entries.length === 0) {
    return {
      aqi: 0,
      category: 'Good',
      dominantPollutant: 'None',
      color: '#00b050',
      textColor: '#14532d',
      bgLight: '#ecfdf5',
      healthStatement: 'No pollutant telemetry data available.',
      healthStatementHi: 'कोई प्रदूषक डेटा उपलब्ध नहीं है।',
      subIndices: {},
    };
  }

  // Dominant pollutant is the one with the highest sub-index
  let dominantEntry = entries[0];
  for (const entry of entries) {
    if (entry.subIndex > dominantEntry.subIndex) {
      dominantEntry = entry;
    }
  }

  const overallAQI = Math.min(500, Math.max(0, dominantEntry.subIndex));
  const category = getCPCBCategory(overallAQI);
  const colorDetails = getCPCBColorDetails(category);
  const healthStatements = getCPCBHealthStatement(category);

  return {
    aqi: overallAQI,
    category,
    dominantPollutant: dominantEntry.pollutant,
    color: colorDetails.color,
    textColor: colorDetails.textColor,
    bgLight: colorDetails.bgLight,
    healthStatement: healthStatements.en,
    healthStatementHi: healthStatements.hi,
    subIndices,
  };
}
