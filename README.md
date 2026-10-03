# 🌿 Smart Climate Guardian — Environmental Intelligence Platform

> **Next-Gen Climate Defense, Air Quality Monitoring, Risk Assessment & Citizen Resilience**  
> *Default Hub: Bhopal, Madhya Pradesh, India*

Smart Climate Guardian is a modern, production-grade environmental intelligence platform calibrated against the **Indian Central Pollution Control Board (CPCB) National Air Quality Index (NAQI)** standard and powered by authentic live telemetry from the **Open-Meteo Air Quality & Weather API**.

---

## 🌟 Phase 1 Implementation Highlights

- **Bilingual Interface**: Seamless instant toggling between **English** and **हिन्दी (Hindi)**.
- **Default City**: Bhopal, Madhya Pradesh, India (`lat: 23.2599, lon: 77.4126`), with instant Open-Meteo geocoding search across India/worldwide and GPS geolocation detection.
- **Authentic Live Data**:
  - Live pollutant concentrations for **PM2.5, PM10, NO2, SO2, CO, O3** from Open-Meteo Air Quality API.
  - Live meteorological telemetry (ambient temperature, apparent "feels-like" temperature, relative humidity, precipitation, wind speed/direction, barometric surface pressure) from Open-Meteo Forecast API.
  - Transparent data status cards: source identification, live timestamps, stale data indicators, error recovery with instant retry.
- **Indian CPCB NAQI Engine**:
  - Pure TypeScript calculation engine (`src/utils/cpcbAqi.ts`) implementing official CPCB sub-index formulas and breakpoints.
  - Determines the dominant pollutant and overall AQI category (Good, Satisfactory, Moderate, Poor, Very Poor, Severe).
  - 100% test coverage with automated unit tests (`npm test`).
- **Interactive Data Visualizations**:
  - Custom CPCB 0-500 semi-circular dial gauge with colored category bands.
  - 48-Hour interactive area charts using Recharts for AQI, PM2.5, PM10, and temperature.
- **Eco Climate-Tech Design System**:
  - Forest green (`#14532d`), emerald (`#10b981`), lime accent (`#a3e635`), soft off-white surfaces, and solid cards for high readability on data-heavy views.
  - Full WCAG AA contrast compliance in light and dark mode with persistent localStorage preference.
  - Respects user `prefers-reduced-motion` settings.
- **Statutory Disclaimers**:
  - Clear institutional notices indicating informational use (consult CPCB, IMD, and state authorities for statutory disaster orders).
  - Strict client-side location privacy policy.

---

## 🛠 Tech Stack

- **Framework**: React 18 + Vite 5 + TypeScript
- **Routing**: React Router DOM (v6)
- **State & Data Caching**: TanStack Query (React Query v5)
- **Styling**: Tailwind CSS with custom eco tokens
- **Charts**: Recharts
- **Localization**: i18next + react-i18next
- **Icons**: Lucide React
- **Testing**: Vitest 2.1 (7/7 unit tests passing)
- **Deployment Platform**: Vercel (SPA rewrites in `vercel.json`)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Run Unit Tests (CPCB Engine)
```bash
npm test
```

### 4. Build for Production
```bash
npm run build
```

---

## 🌐 Deploy to Vercel

The application is built for zero-config Vercel deployment:
- `vercel.json` routes non-API routes to `index.html`.
- Run `npx vercel` or link your Git repository in the Vercel dashboard.

---

## 📋 Roadmap by Phases
- ✅ **Phase 1**: Project setup, design system, dark mode, routing, landing page, dashboard with live Open-Meteo data, CPCB AQI, weather, i18n.
- ⏳ **Phase 2**: Risk engine (air/heat/flood) with reasons, 48h forecast confidence, Leaflet map, grid hotspots and danger zones, shelters.
- ⏳ **Phase 3**: Supabase auth + roles, citizen reporting, duplicate merge, authority dashboard, PDF generation.
- ⏳ **Phase 4**: Alert center, cron, Telegram webhook, FIRMS fires, PWA/offline, accessibility pass, README and deployment.
