import { LiveEnvironmentalData } from './openMeteo';

const PRIMARY_API_KEY = (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
const FALLBACK_API_KEY = (import.meta as any).env?.VITE_GEMINI_FALLBACK_API_KEY || '';
const FALLBACK_API_KEY_2 = (import.meta as any).env?.VITE_GEMINI_FALLBACK_API_KEY_2 || '';

const GEMINI_KEYS = Array.from(
  new Set([PRIMARY_API_KEY, FALLBACK_API_KEY, FALLBACK_API_KEY_2].filter(Boolean))
);

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  isAudioPlaying?: boolean;
}

export async function askGeminiClimateAssistant(
  userQuery: string,
  liveData: LiveEnvironmentalData,
  chatHistory: ChatMessage[] = []
): Promise<string> {
  const { city, cpcbAqi, weather, rawPollutants } = liveData;

  const pm25Str = rawPollutants.pm25 !== undefined ? `${rawPollutants.pm25.toFixed(1)} µg/m³` : 'N/A';
  const pm10Str = rawPollutants.pm10 !== undefined ? `${rawPollutants.pm10.toFixed(1)} µg/m³` : 'N/A';
  const no2Str = rawPollutants.no2 !== undefined ? `${rawPollutants.no2.toFixed(1)} µg/m³` : 'N/A';
  const o3Str = rawPollutants.o3 !== undefined ? `${rawPollutants.o3.toFixed(1)} µg/m³` : 'N/A';
  const coStr = rawPollutants.co !== undefined ? `${(rawPollutants.co / 1000).toFixed(2)} mg/m³` : 'N/A';
  const so2Str = rawPollutants.so2 !== undefined ? `${rawPollutants.so2.toFixed(1)} µg/m³` : 'N/A';

  const systemContext = `
You are "Prithvi AI" (पृथ्वी), the institutional Environmental Guardian & Climate Intelligence Assistant of the "Smart Climate Guardian" platform.
Default hub: Bhopal, Madhya Pradesh, India.

CURRENT REAL-TIME ENVIRONMENTAL CONTEXT FOR ${city.name.toUpperCase()} (${city.state || 'Madhya Pradesh'}, ${city.country}):
- Official Indian CPCB NAQI: ${cpcbAqi.aqi} (${cpcbAqi.category})
- Dominant Pollutant: ${cpcbAqi.dominantPollutant}
- PM2.5 Concentration: ${pm25Str}
- PM10 Concentration: ${pm10Str}
- Nitrogen Dioxide (NO2): ${no2Str}
- Ozone (O3): ${o3Str}
- Carbon Monoxide (CO): ${coStr}
- Sulphur Dioxide (SO2): ${so2Str}
- Ambient Temperature: ${weather.temperature}°C (Feels like: ${weather.apparentTemperature}°C)
- Relative Humidity: ${weather.humidity}%
- Precipitation Rate: ${weather.precipitation} mm/h
- Wind Speed: ${weather.windSpeed} km/h (Direction: ${weather.windDirection}°)

YOUR GUIDELINES:
1. Provide accurate, practical, and empathetic health and climate advice.
2. If asked in Hindi or Hinglish, reply warmly in natural Hindi (Devanagari or Hinglish depending on prompt).
3. If asked about air safety, explain whether outdoor activity, jogging, or cycling is advisable under current CPCB NAQI ${cpcbAqi.aqi} (${cpcbAqi.category}).
4. Advise on N95 masks, HEPA air purifiers, vulnerable populations (children, elderly, asthmatics), hydration for heat, and water-logging avoidance for floods.
5. Keep answers concise, clear, and actionable (2-4 paragraphs maximum with bullet points if helpful).
6. Never make up fake data; strictly reference the real telemetry provided above.
`;

  // Try calling Google Gemini API endpoints
  const models = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-1.5-pro'];

  // Format contents array for Gemini
  const contents = [
    {
      role: 'user',
      parts: [{ text: systemContext }],
    },
    {
      role: 'model',
      parts: [
        {
          text: `Understood! I am Prithvi AI, the Climate Guardian. I have loaded the live telemetry for ${city.name} (CPCB AQI ${cpcbAqi.aqi}, ${cpcbAqi.category}, ${weather.temperature}°C). How can I assist you today? नमस्ते! मैं कैसे मदद कर सकता हूँ?`,
        },
      ],
    },
  ];

  // Add recent history (up to last 6 messages)
  const recentHistory = chatHistory.slice(-6);
  recentHistory.forEach((msg) => {
    contents.push({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    });
  });

  // Add the current user query
  contents.push({
    role: 'user',
    parts: [{ text: userQuery }],
  });

  // Try each API key in order (Primary -> Fallback)
  for (const apiKey of GEMINI_KEYS) {
    for (const model of models) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents,
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800,
            },
          }),
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate) {
            return candidate.trim();
          }
        } else {
          console.warn(`Gemini call with key (...${apiKey.slice(-6)}) returned status ${response.status}`);
        }
      } catch (err) {
        console.warn(`Gemini call to ${model} with key (...${apiKey.slice(-6)}) failed:`, err);
      }
    }
  }

  // Smart Offline Fallback Engine if API key is rate-limited or offline
  return generateOfflineClimateAnswer(userQuery, liveData);
}

function generateOfflineClimateAnswer(query: string, data: LiveEnvironmentalData): string {
  const q = query.toLowerCase();
  const { city, cpcbAqi, weather, rawPollutants } = data;

  const isHindi = /[\u0900-\u097F]/.test(query) || q.includes('kaisa') || q.includes('kya') || q.includes('hawa');
  const pm25Val = rawPollutants.pm25 !== undefined ? rawPollutants.pm25.toFixed(1) : 'elevated';

  if (q.includes('jog') || q.includes('walk') || q.includes('run') || q.includes('exercise') || q.includes('tahalna') || q.includes('bahar')) {
    if (cpcbAqi.aqi <= 100) {
      return isHindi
        ? `✅ **बाहर टहलना सुरक्षित है**: वर्तमान में ${city.name} का CPCB वायु गुणवत्ता सूचकांक (AQI) **${cpcbAqi.aqi} (${cpcbAqi.category})** है। बाहरी व्यायाम और सैर के लिए स्थिति अनुकूल है।`
        : `✅ **Outdoor Activities Safe**: Current CPCB NAQI in ${city.name} is **${cpcbAqi.aqi} (${cpcbAqi.category})** with dominant pollutant **${cpcbAqi.dominantPollutant}**. Outdoor jogging and morning walks are safe for healthy individuals.`;
    } else {
      return isHindi
        ? `⚠️ **सावधानी बरतें**: वर्तमान में ${city.name} का CPCB AQI **${cpcbAqi.aqi} (${cpcbAqi.category})** है। मुख्य प्रदूषक **${cpcbAqi.dominantPollutant}** (${pm25Val} µg/m³) है। सुबह या शाम के समय तीव्र व्यायाम से बचें और बाहर जाते समय N95 मास्क का उपयोग करें।`
        : `⚠️ **Caution Advised**: Current CPCB NAQI in ${city.name} is elevated at **${cpcbAqi.aqi} (${cpcbAqi.category})** driven by **${cpcbAqi.dominantPollutant}** (${pm25Val} µg/m³). It is recommended to avoid strenuous outdoor cardio and wear a fitted N95 respirator.`;
    }
  }

  if (q.includes('mask') || q.includes('n95') || q.includes('purifier')) {
    return isHindi
      ? `😷 **मास्क और सुरक्षा सुझाव**: ${cpcbAqi.aqi > 100 ? 'वर्तमान AQI ' + cpcbAqi.aqi + ' के स्तर पर बाहर जाते समय N95 या FFP2 मास्क अवश्य पहनें। साधारण कपड़े का मास्क PM2.5 सूक्ष्म कणों को नहीं रोक पाता।' : 'वर्तमान में AQI ' + cpcbAqi.aqi + ' संतोषजनक है, सामान्य स्थिति में मास्क अनिवार्य नहीं है।'}`
      : `😷 **Mask & Filter Guidance**: At current AQI **${cpcbAqi.aqi}**, ${cpcbAqi.aqi > 100 ? 'an N95 or FFP2 certified respirator is strongly recommended outdoors to filter PM2.5 micro-particulates. Standard cloth masks do not filter fine combustion particulates.' : 'air quality is within acceptable limits; routine masks are not mandatory for healthy individuals.'}`;
  }

  if (q.includes('weather') || q.includes('temp') || q.includes('mausam') || q.includes('barish') || q.includes('flood') || q.includes('rain')) {
    return isHindi
      ? `🌦️ **मौसम और जलभराव स्थिति**: ${city.name} में वर्तमान तापमान **${weather.temperature}°C** (आभासी: ${weather.apparentTemperature}°C) है। आर्द्रता **${weather.humidity}%** और वर्षा दर **${weather.precipitation} mm/h** है। निचली बस्तियों और बड़े तालाब/भदभदा जलमार्ग पर नजर रखें।`
      : `🌦️ **Weather & Hydrology Overview**: Current temperature in ${city.name} is **${weather.temperature}°C** (feels like **${weather.apparentTemperature}°C**) with **${weather.humidity}%** humidity and **${weather.precipitation} mm/h** precipitation rate. Wind speed is **${weather.windSpeed} km/h**.`;
  }

  // Default response
  return isHindi
    ? `🌍 **${city.name} पर्यावरण स्थिति**:
- CPCB AQI: **${cpcbAqi.aqi}** (${cpcbAqi.category})
- मुख्य प्रदूषक: **${cpcbAqi.dominantPollutant}** (${pm25Val} µg/m³)
- तापमान: **${weather.temperature}°C** (नमी: ${weather.humidity}%)
- सुझाव: संवेदनशील नागरिक (बच्चे, बुजुर्ग, अस्थमा रोगी) लंबे समय तक खुले में रहने से बचें।`
    : `🌍 **Live Environmental Status for ${city.name}**:
- **Official CPCB AQI**: **${cpcbAqi.aqi}** (${cpcbAqi.category})
- **Dominant Pollutant**: **${cpcbAqi.dominantPollutant}** (PM2.5: ${pm25Val} µg/m³)
- **Weather**: **${weather.temperature}°C** (Humidity: ${weather.humidity}%, Wind: ${weather.windSpeed} km/h)
- **Guidance**: ${cpcbAqi.aqi > 150 ? 'Air quality may cause breathing discomfort to people with lung disease. Limit heavy outdoor exertion.' : 'Air quality is within normal operating limits.'}`;
}
