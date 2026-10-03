import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Flame, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  Crosshair, 
  Maximize2, 
  Filter, 
  Eye, 
  EyeOff,
  Navigation
} from 'lucide-react';
import { useClimate } from '../../context/ClimateContext';

// Fix standard Leaflet default icon issues in bundlers
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export const InteractiveMap: React.FC = () => {
  const { stations, currentStation, selectStation, citizenReports, darkMode, setActiveTab, setIsReportModalOpen } = useClimate();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer filters
  const [showStations, setShowStations] = useState(true);
  const [showDangerZones, setShowDangerZones] = useState(true);
  const [showCitizenReports, setShowCitizenReports] = useState(true);
  const [tileMode, setTileMode] = useState<'google_streets' | 'google_hybrid' | 'osm_local' | 'arcgis_imagery' | 'arcgis_dark'>('google_streets');

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentStation.lat, currentStation.lng],
        zoom: 7,
        zoomControl: false,
        attributionControl: false
      });

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      mapInstanceRef.current = map;
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update base tile when tileMode changes (Google Streets, Hybrid, OSM, ArcGIS)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    if (tileMode === 'google_streets') {
      const googleStreets = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps &mdash; Streets',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      });
      googleStreets.addTo(map);
    } else if (tileMode === 'google_hybrid') {
      const googleHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps &mdash; Satellite & Places',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      });
      googleHybrid.addTo(map);
    } else if (tileMode === 'osm_local') {
      const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      });
      osmLayer.addTo(map);
    } else if (tileMode === 'arcgis_imagery') {
      const baseImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri',
      });
      const labelsOverlay = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
      });
      baseImagery.addTo(map);
      labelsOverlay.addTo(map);
    } else {
      const darkBase = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri',
      });
      const darkLabels = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
      });
      darkBase.addTo(map);
      darkLabels.addTo(map);
    }
  }, [tileMode]);

  // Center on currentStation when it changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([currentStation.lat, currentStation.lng], 8, {
      duration: 1.2
    });
  }, [currentStation.id]);

  // Render station markers, danger zones, and citizen pins
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. Station Markers
    if (showStations) {
      stations.forEach((st) => {
        const isCurrent = st.id === currentStation.id;
        const aqiColor = 
          st.airQuality.aqi <= 50 ? '#10b981' :
          st.airQuality.aqi <= 100 ? '#eab308' :
          st.airQuality.aqi <= 150 ? '#f97316' :
          st.airQuality.aqi <= 200 ? '#ef4444' :
          st.airQuality.aqi <= 300 ? '#a855f7' : '#881337';

        const customIcon = L.divIcon({
          className: 'custom-station-pin',
          html: `
            <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px;">
              <span style="position: absolute; width: 40px; height: 40px; border-radius: 9999px; background-color: ${aqiColor}; opacity: 0.3;" class="radar-pulse"></span>
              <div style="position: relative; width: 32px; height: 32px; border-radius: 9999px; background-color: #0d1615; border: 2.5px solid ${aqiColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(0,0,0,0.5); font-weight: 800; font-family: monospace; font-size: 11px; color: ${aqiColor};">
                ${st.airQuality.aqi}
              </div>
              ${isCurrent ? `<span style="position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; border-radius: 9999px; background-color: #a3e635; border: 2px solid #fff;"></span>` : ''}
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22]
        });

        const marker = L.marker([st.lat, st.lng], { icon: customIcon });

        const popupContent = `
          <div style="padding: 14px; min-width: 220px; font-family: 'Plus Jakarta Sans', sans-serif;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; color: #10b981; letter-spacing: 0.5px;">MONITORED STATION</span>
              <span style="font-size: 11px; font-weight: 800; padding: 2px 6px; border-radius: 4px; background: ${aqiColor}22; color: ${aqiColor};">AQI ${st.airQuality.aqi}</span>
            </div>
            <h4 style="margin: 0; font-size: 14px; font-weight: 800; color: #0f172a;">${st.name}</h4>
            <p style="margin: 2px 0 10px 0; font-size: 11px; color: #64748b;">${st.region}, ${st.country}</p>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #f8fafc; padding: 8px; border-radius: 8px; margin-bottom: 10px;">
              <div>
                <span style="font-size: 10px; color: #94a3b8; display: block;">Temperature</span>
                <span style="font-size: 12px; font-weight: 700; color: #1e293b;">${st.weather.temperature}°C</span>
              </div>
              <div>
                <span style="font-size: 10px; color: #94a3b8; display: block;">Humidity</span>
                <span style="font-size: 12px; font-weight: 700; color: #1e293b;">${st.weather.humidity}%</span>
              </div>
            </div>
            <button id="btn-select-${st.id}" style="width: 100%; background: #064e3b; color: white; border: none; padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; cursor: pointer;">
              Select Station Telemetry
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById(`btn-select-${st.id}`);
          if (btn) {
            btn.onclick = () => {
              selectStation(st.id);
              marker.closePopup();
            };
          }
        });

        layerGroup.addLayer(marker);
      });
    }

    // 2. Danger Zone Geofence Buffers (Circles & Hazard Plumes)
    if (showDangerZones) {
      stations.forEach((st) => {
        // High risk buffer around polluted or flooded regions
        if (st.airQuality.aqi > 150) {
          const dangerCircle = L.circle([st.lat, st.lng], {
            radius: 28000, // 28 km
            color: '#ef4444',
            weight: 1.5,
            fillColor: '#ef4444',
            fillOpacity: 0.12,
            dashArray: '4, 6'
          }).bindTooltip(`<b>Hazardous Smoke Buffer</b><br>Station: ${st.name} (28km radius)`, { sticky: true });
          layerGroup.addLayer(dangerCircle);
        }

        if (st.floodRisk.runoffRisk === 'Flash Flood Warning') {
          const floodCircle = L.circle([st.lat, st.lng], {
            radius: 22000,
            color: '#0284c7',
            weight: 2,
            fillColor: '#0ea5e9',
            fillOpacity: 0.18,
            dashArray: '6, 6'
          }).bindTooltip(`<b>Flash Flood Inundation Buffer</b><br>Basin: ${st.name}`, { sticky: true });
          layerGroup.addLayer(floodCircle);
        }

        if (st.heatwaveRisk.riskLevel === 'Extreme Danger' || st.heatwaveRisk.riskLevel === 'Danger') {
          const heatCircle = L.circle([st.lat, st.lng], {
            radius: 18000,
            color: '#f97316',
            weight: 1.5,
            fillColor: '#f97316',
            fillOpacity: 0.15
          }).bindTooltip(`<b>Urban Heat Island Hotspot</b><br>+${st.heatwaveRisk.urbanHeatIslandDelta}°C Anomaly`, { sticky: true });
          layerGroup.addLayer(heatCircle);
        }
      });
    }

    // 3. Citizen Incident Markers
    if (showCitizenReports) {
      citizenReports.forEach((rep) => {
        const repIcon = L.divIcon({
          className: 'citizen-marker',
          html: `
            <div style="background: #e11d48; width: 28px; height: 28px; border-radius: 9999px; border: 2px solid white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 8px rgba(0,0,0,0.3); color: white; font-size: 14px;">
              ⚠️
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([rep.lat, rep.lng], { icon: repIcon });
        const popupContent = `
          <div style="padding: 12px; min-width: 200px; font-family: 'Plus Jakarta Sans', sans-serif;">
            <span style="font-size: 10px; font-weight: 700; color: #e11d48; text-transform: uppercase;">CITIZEN INCIDENT</span>
            <h4 style="margin: 2px 0 6px 0; font-size: 13px; font-weight: 800; color: #0f172a;">${rep.title}</h4>
            <p style="margin: 0 0 6px 0; font-size: 11px; color: #475569;">${rep.description}</p>
            <div style="font-size: 10px; color: #64748b; margin-bottom: 6px;">
              Reported: ${rep.timestamp} • Status: <b>${rep.status}</b>
            </div>
            <button id="btn-citizen-hub" style="width: 100%; background: #059669; color: white; border: none; padding: 5px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; cursor: pointer;">
              View Community Discussion
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
          const btn = document.getElementById('btn-citizen-hub');
          if (btn) {
            btn.onclick = () => {
              setActiveTab('citizen');
              marker.closePopup();
            };
          }
        });

        layerGroup.addLayer(marker);
      });
    }
  }, [stations, currentStation.id, citizenReports, showStations, showDangerZones, showCitizenReports]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([currentStation.lat, currentStation.lng], 8);
    }
  };

  return (
    <div className="space-y-4">
      {/* Map Control Header Bar */}
      <div className="glass-panel rounded-3xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-emerald-500/20">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Crosshair className="w-5 h-5 text-emerald-500" />
            Planetary GIS Risk & Hotspot Visualizer
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Leaflet GIS engine with atmospheric dispersion buffers, thermal anomalies, and community reports.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Tile Mode Selector */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-obsidian-900 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setTileMode('google_streets')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                tileMode === 'google_streets' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>🗺️</span>
              <span>Google Streets</span>
            </button>
            <button
              onClick={() => setTileMode('google_hybrid')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                tileMode === 'google_hybrid' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>🛰️</span>
              <span>Hybrid</span>
            </button>
            <button
              onClick={() => setTileMode('osm_local')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                tileMode === 'osm_local' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>📍</span>
              <span>OSM Local</span>
            </button>
            <button
              onClick={() => setTileMode('arcgis_dark')}
              className={`px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 ${
                tileMode === 'arcgis_dark' ? 'bg-emerald-500 text-white font-bold' : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              <span>🌑</span>
              <span>Dark</span>
            </button>
          </div>

          {/* Recenter button */}
          <button
            onClick={resetView}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-obsidian-850 hover:bg-slate-50 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-emerald-900 text-xs font-bold transition-colors"
          >
            <Navigation className="w-3.5 h-3.5 text-emerald-500" />
            <span>Recenter</span>
          </button>

          {/* Add Report button */}
          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm"
          >
            <span>+ Tag Incident</span>
          </button>
        </div>
      </div>

      {/* Main Map Canvas Container */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-emerald-500/25 shadow-eco-lg h-[620px]">
        {/* Map Canvas */}
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Layer Toggle Panel (Top-Right) */}
        <div className="absolute top-4 right-4 z-20 glass-panel-elevated rounded-2xl p-3 shadow-xl border border-emerald-500/30 max-w-[210px] space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-200 dark:border-emerald-900/60">
            <Filter className="w-3.5 h-3.5 text-emerald-500" />
            <span>GIS Map Overlays</span>
          </div>

          <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-emerald-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Air Stations
            </span>
            <input
              type="checkbox"
              checked={showStations}
              onChange={(e) => setShowStations(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-emerald-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              Hazard Buffers
            </span>
            <input
              type="checkbox"
              checked={showDangerZones}
              onChange={(e) => setShowDangerZones(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
          </label>

          <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer hover:text-emerald-500">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              Citizen Incidents
            </span>
            <input
              type="checkbox"
              checked={showCitizenReports}
              onChange={(e) => setShowCitizenReports(e.target.checked)}
              className="accent-emerald-500 rounded"
            />
          </label>
        </div>

        {/* Floating Quick Region Jump Ribbon (Bottom-Left) */}
        <div className="absolute bottom-4 left-4 z-20 flex flex-wrap gap-2 max-w-[calc(100%-80px)]">
          {stations.map(st => (
            <button
              key={st.id}
              onClick={() => selectStation(st.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-md backdrop-blur-md ${
                st.id === currentStation.id
                  ? 'bg-emerald-500 text-white shadow-eco-glow'
                  : 'bg-white/90 dark:bg-obsidian-900/90 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-emerald-900 hover:bg-white'
              }`}
            >
              {st.name.split(' ')[0]} ({st.airQuality.aqi})
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
