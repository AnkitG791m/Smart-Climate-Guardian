import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Layers, 
  MapPin, 
  Flame, 
  Waves, 
  AlertTriangle, 
  Building, 
  Users, 
  PlusCircle, 
  Crosshair, 
  Globe2, 
  Navigation, 
  Sun, 
  Moon, 
  SlidersHorizontal,
  Home,
  ShieldCheck,
  Check,
  Compass,
  Maximize,
  Minimize,
  Route,
  Info,
  Volume2,
  VolumeX,
  Keyboard,
  Table as TableIcon
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CityLocation, LiveEnvironmentalData } from '../../services/openMeteo';
import { RegionalRecordsInspectorView } from '../records/RegionalRecordsInspectorView';
import { MobileBottomNav, MobileTab } from '../common/MobileBottomNav';
import { MobileDashboardView } from '../mobile/MobileDashboardView';
import { EugeneAirShowcase } from '../mobile/EugeneAirShowcase';
import { 
  DANGER_ZONES, 
  FIRE_HOTSPOTS, 
  FLOOD_INUNDATION_ZONES, 
  SHELTERS_AND_HOSPITALS, 
  CITIZEN_REPORTS_GEO,
  BHOPAL_GRID_CELLS,
  BHOPAL_NEIGHBORHOODS,
  BhopalNeighborhood,
  DangerZoneFeature,
  FireHotspotFeature,
  FloodInundationFeature,
  ShelterHospitalFeature,
  CitizenIncidentPin
} from '../../data/mapFeaturesData';
import { FloatingSearchBar } from './FloatingSearchBar';
import { FloatingStatsCard } from './FloatingStatsCard';
import { HotspotDetailDrawer, SelectedMapFeature } from './HotspotDetailDrawer';
import { AlertDrawer } from './AlertDrawer';
import { RadarTimelineScrubber } from './RadarTimelineScrubber';
import { MapLegendBar } from './MapLegendBar';
import { ReportIncidentModal } from '../modals/ReportIncidentModal';
import { KeyboardShortcutsModal } from '../modals/KeyboardShortcutsModal';
import { FloatingChatButton } from '../chat/FloatingChatButton';
import { GeminiClimateChatModal } from '../chat/GeminiClimateChatModal';
import { soundService } from '../../services/soundService';
import { firmsSatelliteService } from '../../services/firmsService';

interface GoogleMapsDashboardProps {
  currentCity: CityLocation;
  onSelectCity: (city: CityLocation) => void;
  liveData: LiveEnvironmentalData;
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const GoogleMapsDashboard: React.FC<GoogleMapsDashboardProps> = ({
  currentCity,
  onSelectCity,
  liveData,
  darkMode,
  toggleDarkMode,
}) => {
  const { t, i18n } = useTranslation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layersGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // Layer Visibility States (Clean defaults for normal users, avoid clutter)
  const [showAqiHeatmap, setShowAqiHeatmap] = useState(false);
  const [showFireHotspots, setShowFireHotspots] = useState(false);
  const [showFloodRisk, setShowFloodRisk] = useState(false);
  const [showDangerZones, setShowDangerZones] = useState(false);
  const [showCitizenReports, setShowCitizenReports] = useState(true);
  const [showShelters, setShowShelters] = useState(false);
  const [showNeighborhoods, setShowNeighborhoods] = useState(true);

  // Basemap Tile Mode: Google Streets (Local Details), Google Hybrid, OSM, ArcGIS
  const [tileMode, setTileMode] = useState<'google_streets' | 'google_hybrid' | 'osm_local' | 'arcgis_imagery' | 'arcgis_dark'>('google_streets');
  const [isLayerDockOpen, setIsLayerDockOpen] = useState(false);
  const [radarMode, setRadarMode] = useState<'aqi' | 'heat' | 'flood'>('aqi');

  // Detail Drawer, Alert Drawer & Report Modal
  const [selectedFeature, setSelectedFeature] = useState<SelectedMapFeature | null>(null);
  const [isAlertDrawerOpen, setIsAlertDrawerOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isMuted, setIsMuted] = useState(() => soundService.getMuted());
  const [isLocating, setIsLocating] = useState(false);
  const [activeEvacRoute, setActiveEvacRoute] = useState<{ toName: string; distKm: number } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(12);

  // View Mode: Reference Air Quality Experience vs Fullscreen GIS Map vs Regional Records
  const [dashboardView, setDashboardView] = useState<'eugene_air' | 'map' | 'records'>('eugene_air');
  const [mobileTab, setMobileTab] = useState<MobileTab>('home');

  const handleMobileTabChange = (tab: MobileTab) => {
    setMobileTab(tab);
    if (tab === 'home') {
      setDashboardView('eugene_air');
    } else if (tab === 'map') {
      setDashboardView('map');
    } else if (tab === 'records') {
      setDashboardView('records');
    } else if (tab === 'citizen') {
      setIsReportModalOpen(true);
    } else if (tab === 'chat') {
      setIsChatOpen(true);
    }
  };

  // Cursor coordinates
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lng: number }>({
    lat: currentCity.lat,
    lng: currentCity.lon,
  });

  // NASA FIRMS Live Fire Satellite Hotspots
  const [fireHotspots, setFireHotspots] = useState<FireHotspotFeature[]>(FIRE_HOTSPOTS);
  const [firmsStatus, setFirmsStatus] = useState<{ isLive: boolean; source: string; count: number }>({
    isLive: false,
    source: 'NASA FIRMS VIIRS',
    count: FIRE_HOTSPOTS.length,
  });

  // Real-time NASA FIRMS Satellite Telemetry Fetch (VIIRS / MODIS)
  useEffect(() => {
    let isMounted = true;
    const fetchFirmsHotspots = async () => {
      try {
        const res = await firmsSatelliteService.getActiveFireHotspots({
          centerLat: currentCity.lat,
          centerLng: currentCity.lon,
          days: 5,
        });
        if (isMounted) {
          setFireHotspots(res.hotspots);
          setFirmsStatus({
            isLive: res.isLive,
            source: res.source,
            count: res.hotspots.length,
          });
        }
      } catch (err) {
        console.warn('[FIRMS] Hotspots fetch error:', err);
      }
    };

    fetchFirmsHotspots();
    return () => {
      isMounted = false;
    };
  }, [currentCity.lat, currentCity.lon]);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [currentCity.lat, currentCity.lon],
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      // Mousemove coordinate tracking
      map.on('mousemove', (e) => {
        setCursorCoords({
          lat: +e.latlng.lat.toFixed(4),
          lng: +e.latlng.lng.toFixed(4),
        });
      });

      // Zoom tracking for dynamic scale bar
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
      layersGroupRef.current = L.layerGroup().addTo(map);
      routeLayerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Base Tiles (ESRI ArcGIS API)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    const esriAttribution = 'Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics, GIS User Community';

    if (tileMode === 'google_streets') {
      // 1. Google Maps Local Street Map (High resolution streets, colonies, landmarks, markets)
      const googleStreets = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps &mdash; Street & Locality Intelligence',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      });
      googleStreets.addTo(map);
    } else if (tileMode === 'google_hybrid') {
      // 2. Google Maps Hybrid Satellite (Real imagery + High-contrast road & colony labels)
      const googleHybrid = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}', {
        maxZoom: 20,
        attribution: '&copy; Google Maps &mdash; Satellite & Places',
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      });
      googleHybrid.addTo(map);
    } else if (tileMode === 'osm_local') {
      // 3. OpenStreetMap Local Community Roads & Sectors
      const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      });
      osmLayer.addTo(map);
    } else if (tileMode === 'arcgis_imagery') {
      // 4. High-resolution ESRI World Satellite Imagery
      const baseImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri',
      });
      const labelsOverlay = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
      });
      baseImagery.addTo(map);
      labelsOverlay.addTo(map);
    } else if (tileMode === 'arcgis_dark') {
      // 5. ESRI Dark Gray Canvas (Obsidian Night View)
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

  // Fly to currentCity on selection (smart zoom: zoom 15 for local colonies, 13 for cities)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const targetZoom = (currentCity.id && Number(currentCity.id) >= 9000) ? 15 : 13;
    map.flyTo([currentCity.lat, currentCity.lon], targetZoom, {
      duration: 1.4,
    });
  }, [currentCity.lat, currentCity.lon, currentCity.id]);

  // Fullscreen Toggle
  const toggleFullscreenMode = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Center / North Reset
  const resetNorth = () => {
    const map = mapInstanceRef.current;
    if (!map) return;
    map.flyTo([currentCity.lat, currentCity.lon], 12, { duration: 0.8 });
    soundService.playAlertChime('info');
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do not intercept when inside input or textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.key === 'Escape') {
        if (isChatOpen) setIsChatOpen(false);
        if (selectedFeature) setSelectedFeature(null);
        if (isAlertDrawerOpen) setIsAlertDrawerOpen(false);
        if (isReportModalOpen) setIsReportModalOpen(false);
        if (isShortcutsOpen) setIsShortcutsOpen(false);
        if (isLayerDockOpen) setIsLayerDockOpen(false);
        if (activeEvacRoute) clearEvacRoute();
      } else if (e.key === '+' || e.key === '=') {
        mapInstanceRef.current?.zoomIn();
      } else if (e.key === '-' || e.key === '_') {
        mapInstanceRef.current?.zoomOut();
      } else if (e.key.toLowerCase() === 'c') {
        setIsChatOpen((prev) => !prev);
        soundService.playClick();
      } else if (e.key.toLowerCase() === 'l') {
        setIsLayerDockOpen((prev) => !prev);
        soundService.playClick();
      } else if (e.key.toLowerCase() === 'a') {
        setIsAlertDrawerOpen((prev) => !prev);
        soundService.playClick();
      } else if (e.key.toLowerCase() === 'r') {
        setIsReportModalOpen((prev) => !prev);
        soundService.playClick();
      } else if (e.key.toLowerCase() === 'n') {
        resetNorth();
      } else if (e.key.toLowerCase() === 'm') {
        const next = soundService.toggleMute();
        setIsMuted(next);
        if (!next) soundService.playAlertChime('info');
      } else if (e.key.toLowerCase() === 't') {
        toggleDarkMode();
        soundService.playClick();
      } else if (e.key.toLowerCase() === 'h') {
        toggleLanguage();
        soundService.playClick();
      } else if (e.key === '?') {
        setIsShortcutsOpen((prev) => !prev);
        soundService.playClick();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedFeature, isAlertDrawerOpen, isReportModalOpen, isShortcutsOpen, isChatOpen, isLayerDockOpen, activeEvacRoute, darkMode, i18n.language]);

  // Draw Evacuation Route Line on Map
  const drawRouteToShelter = (shelterCoords: [number, number], shelterName: string) => {
    const map = mapInstanceRef.current;
    const routeGroup = routeLayerGroupRef.current;
    if (!map || !routeGroup) return;

    routeGroup.clearLayers();

    const origin: [number, number] = [currentCity.lat, currentCity.lon];
    const latDiff = shelterCoords[0] - origin[0];
    const lngDiff = shelterCoords[1] - origin[1];
    const distKm = +(Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111).toFixed(1);

    // Dashed glowing green evacuation path
    const routeLine = L.polyline([origin, shelterCoords], {
      color: '#10b981',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.9,
    });

    // Tooltip midpoint
    const midPoint: [number, number] = [(origin[0] + shelterCoords[0]) / 2, (origin[1] + shelterCoords[1]) / 2];
    const label = L.tooltip({ permanent: true, direction: 'center', className: 'evac-tooltip' })
      .setLatLng(midPoint)
      .setContent(`<b style="color:#064e3b; font-family:'Plus Jakarta Sans'; font-size:10px;">🟢 Evacuation Corridor (${distKm} km)</b>`);

    routeGroup.addLayer(routeLine);
    routeGroup.addLayer(label);

    setActiveEvacRoute({ toName: shelterName, distKm });
    soundService.playAlertChime('warning');

    // Fit bounds to show route
    map.fitBounds([origin, shelterCoords], { padding: [80, 80] });
  };

  // Clear active route
  const clearEvacRoute = () => {
    if (routeLayerGroupRef.current) {
      routeLayerGroupRef.current.clearLayers();
    }
    setActiveEvacRoute(null);
  };

  // Handle GPS Locate Me
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const userLoc: CityLocation = {
          name: 'My GPS Location',
          state: 'Local Area',
          country: 'India',
          countryCode: 'IN',
          lat: +pos.coords.latitude.toFixed(4),
          lon: +pos.coords.longitude.toFixed(4),
        };
        onSelectCity(userLoc);
        soundService.playAlertChime('info');
      },
      (err) => {
        setIsLocating(false);
        console.warn('Geolocation error:', err);
        alert('Could not determine your GPS location. Please check browser permissions.');
      },
      { timeout: 10000 }
    );
  };

  // Render Map Features & Layers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layersGroupRef.current;
    if (!map || !layerGroup) return;

    layerGroup.clearLayers();

    // 1. DANGER ZONES: Glowing Google Maps Traffic Style
    if (showDangerZones) {
      DANGER_ZONES.forEach((dz) => {
        const isRed = dz.severity === 'Critical';
        const color = isRed ? '#ef4444' : '#f97316';
        const glowClass = isRed ? 'glow-hazard-red' : 'glow-hazard-orange';

        if (dz.polygonCoordinates) {
          const poly = L.polygon(dz.polygonCoordinates, {
            color: color,
            weight: 3.5,
            fillColor: color,
            fillOpacity: 0.25,
            className: glowClass,
            dashArray: '8, 6',
          });

          poly.on('click', () => {
            setSelectedFeature({ type: 'danger_zone', data: dz });
            soundService.playAlertChime('info');
          });

          poly.bindTooltip(
            `<div style="font-family:'Plus Jakarta Sans'; font-size:11px;">
              <b style="color:${color};">⚠️ ${dz.name}</b><br/>
              <span>Hazard Score: <b>${dz.riskScore}/100</b> (${dz.severity})</span><br/>
              <span style="font-size:10px; color:#94a3b8;">Click for details & safe havens</span>
            </div>`,
            { sticky: true }
          );

          layerGroup.addLayer(poly);
        }

        const circle = L.circle(dz.coordinates, {
          radius: dz.affectedRadiusKm * 1000,
          color: color,
          weight: 1.5,
          fillColor: color,
          fillOpacity: 0.05,
          className: glowClass,
        });

        circle.on('click', () => {
          setSelectedFeature({ type: 'danger_zone', data: dz });
          soundService.playAlertChime('info');
        });

        layerGroup.addLayer(circle);

        // Center Pin with Radar Ping
        const pinIcon = L.divIcon({
          className: 'hazard-pin',
          html: `
            <div style="position:relative; display:flex; align-items:center; justify-content:center; width:44px; height:44px; cursor:pointer;">
              <span style="position:absolute; width:40px; height:40px; border-radius:9999px; background-color:${color}; opacity:0.35;" class="pin-radar"></span>
              <div style="width:30px; height:30px; border-radius:9999px; background-color:#0d1615; border:2.5px solid ${color}; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 14px rgba(0,0,0,0.6); font-size:14px;">
                ⚠️
              </div>
            </div>
          `,
          iconSize: [44, 44],
          iconAnchor: [22, 22],
        });

        const marker = L.marker(dz.coordinates, { icon: pinIcon });
        marker.on('click', () => {
          setSelectedFeature({ type: 'danger_zone', data: dz });
          soundService.playAlertChime('info');
        });
        layerGroup.addLayer(marker);
      });
    }

    // 2. CPCB AQI HEATMAP CELLS
    if (showAqiHeatmap) {
      BHOPAL_GRID_CELLS.forEach((cell) => {
        const aqiColor = 
          cell.aqi <= 50 ? '#00b050' :
          cell.aqi <= 100 ? '#84cc16' :
          cell.aqi <= 200 ? '#eab308' :
          cell.aqi <= 300 ? '#f97316' :
          cell.aqi <= 400 ? '#ef4444' : '#7f1d1d';

        const gridCircle = L.circle([cell.lat, cell.lng], {
          radius: 2000,
          color: aqiColor,
          weight: 1,
          fillColor: aqiColor,
          fillOpacity: 0.35,
        });

        gridCircle.bindTooltip(
          `<div style="font-family:'Plus Jakarta Sans'; font-size:11px;">
            <b style="color:${aqiColor};">CPCB AQI: ${cell.aqi} (${cell.category})</b><br/>
            <span>Temp: ${cell.temp}°C | Flood Index: ${cell.floodRisk}%</span>
          </div>`,
          { sticky: true }
        );

        layerGroup.addLayer(gridCircle);
      });
    }

    // 3. FIRE HOTSPOTS (NASA FIRMS Live Satellite Telemetry)
    if (showFireHotspots) {
      fireHotspots.forEach((fire) => {
        const fireIcon = L.divIcon({
          className: 'fire-pin',
          html: `
            <div style="position:relative; display:flex; align-items:center; justify-content:center; width:38px; height:38px; cursor:pointer;">
              <span style="position:absolute; width:34px; height:34px; border-radius:9999px; background-color:#f97316; opacity:0.45;" class="pin-radar"></span>
              <div style="width:26px; height:26px; border-radius:9999px; background-color:#1c1917; border:2px solid #f97316; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 10px rgba(0,0,0,0.6); font-size:12px;">
                🔥
              </div>
            </div>
          `,
          iconSize: [38, 38],
          iconAnchor: [19, 19],
        });

        const marker = L.marker([fire.lat, fire.lng], { icon: fireIcon });
        marker.on('click', () => {
          setSelectedFeature({ type: 'fire_hotspot', data: fire });
          soundService.playAlertChime('info');
        });
        marker.bindTooltip(
          `<div style="font-family:'Plus Jakarta Sans'; font-size:11px;">
            <b style="color:#f97316;">🔥 ${fire.name}</b><br/>
            <span>Confidence: ${fire.confidencePercent}% • ${fire.frpMw ? fire.frpMw + ' MW • ' : ''}${fire.source}</span>
          </div>`,
          { sticky: true }
        );
        layerGroup.addLayer(marker);
      });
    }

    // 4. FLOOD INUNDATION BASINS
    if (showFloodRisk) {
      FLOOD_INUNDATION_ZONES.forEach((fl) => {
        const floodCircle = L.circle([fl.lat, fl.lng], {
          radius: fl.radiusKm * 1000,
          color: '#0284c7',
          weight: 2,
          fillColor: '#0ea5e9',
          fillOpacity: 0.28,
          dashArray: '6, 6',
        });

        floodCircle.on('click', () => {
          setSelectedFeature({ type: 'flood_zone', data: fl });
          soundService.playAlertChime('info');
        });

        floodCircle.bindTooltip(
          `<div style="font-family:'Plus Jakarta Sans'; font-size:11px;">
            <b style="color:#0284c7;">🌊 ${fl.basinName}</b><br/>
            <span>Status: ${fl.flowStatus} • Saturation: ${fl.saturationPercent}%</span>
          </div>`,
          { sticky: true }
        );

        layerGroup.addLayer(floodCircle);
      });
    }

    // 5. SHELTERS & HOSPITALS
    if (showShelters) {
      SHELTERS_AND_HOSPITALS.forEach((sh) => {
        const shelterIcon = L.divIcon({
          className: 'shelter-pin',
          html: `
            <div style="background-color:#064e3b; width:30px; height:30px; border-radius:10px; border:2px solid #10b981; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 12px rgba(0,0,0,0.5); color:white; font-size:14px; cursor:pointer;">
              ${sh.type === 'Hospital' ? '🏥' : '🛡️'}
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        });

        const marker = L.marker([sh.lat, sh.lng], { icon: shelterIcon });
        marker.on('click', () => {
          setSelectedFeature({ type: 'shelter', data: sh });
          soundService.playAlertChime('info');
        });
        marker.bindTooltip(
          `<div style="font-family:'Plus Jakarta Sans'; font-size:11px;">
            <b style="color:#10b981;">${sh.type === 'Hospital' ? '🏥' : '🛡️'} ${sh.name}</b><br/>
            <span>Beds Available: ${sh.availableCapacity} / ${sh.totalCapacity}</span>
          </div>`,
          { sticky: true }
        );
        layerGroup.addLayer(marker);
      });
    }

    // 6. CITIZEN REPORTS
    if (showCitizenReports) {
      CITIZEN_REPORTS_GEO.forEach((cit) => {
        const citIcon = L.divIcon({
          className: 'cit-pin',
          html: `
            <div style="background-color:#7e22ce; width:28px; height:28px; border-radius:9999px; border:2px solid #c084fc; display:flex; align-items:center; justify-content:center; box-shadow:0 4px 8px rgba(0,0,0,0.4); color:white; font-size:12px; cursor:pointer;">
              👥
            </div>
          `,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const marker = L.marker([cit.lat, cit.lng], { icon: citIcon });
        marker.on('click', () => {
          setSelectedFeature({ type: 'citizen_report', data: cit });
          soundService.playAlertChime('info');
        });
        marker.bindTooltip(
          `<div style="font-family:'Plus Jakarta Sans'; font-size:11px;">
            <b style="color:#a855f7;">👥 ${cit.title}</b><br/>
            <span>By ${cit.reporterName} • ${cit.corroborations} confirmations</span>
          </div>`,
          { sticky: true }
        );
        layerGroup.addLayer(marker);
      });
    }

    // 7. BHOPAL LOCAL NEIGHBORHOODS & SECTOR BADGES
    if (showNeighborhoods) {
      BHOPAL_NEIGHBORHOODS.forEach((nb) => {
        const aqiColor =
          nb.aqiBaseline <= 100 ? '#10b981' :
          nb.aqiBaseline <= 200 ? '#f59e0b' : '#ef4444';

        const nbIcon = L.divIcon({
          className: 'neighborhood-pill-pin',
          html: `
            <div style="display:inline-flex; align-items:center; justify-content:center; width:30px; height:30px; border-radius:9999px; background:#ffffff; border:3px solid ${aqiColor}; box-shadow:0 4px 12px rgba(0,0,0,0.18); cursor:pointer; transform:translate(-50%, -50%); transition:transform 0.15s ease;">
              <span style="color:#0f172a; font-family:'Plus Jakarta Sans',sans-serif; font-size:10px; font-weight:900; line-height:1;">${nb.aqiBaseline}</span>
            </div>
          `,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        });

        const marker = L.marker([nb.lat, nb.lng], { icon: nbIcon });
        marker.on('click', () => {
          soundService.playAlertChime('info');
          map.flyTo([nb.lat, nb.lng], 15, { duration: 1.2 });
        });
        marker.bindTooltip(
          `<div style="font-family:'Plus Jakarta Sans'; font-size:11px; padding:4px;">
            <b style="color:${aqiColor}; font-size:13px;">📍 ${nb.name}</b><br/>
            <span style="color:#94a3b8; font-size:10px;">${nb.hindiName} • ${nb.category}</span><br/>
            <span style="font-size:10px; color:#e2e8f0; margin-top:3px; display:block;">${nb.description}</span>
            <div style="margin-top:4px; font-size:9.5px; color:#38bdf8; font-weight:bold;">Dominant: ${nb.dominantSource}</div>
          </div>`,
          { sticky: true }
        );
        layerGroup.addLayer(marker);
      });
    }
  }, [
    showAqiHeatmap,
    showFireHotspots,
    showFloodRisk,
    showDangerZones,
    showCitizenReports,
    showShelters,
    showNeighborhoods,
    fireHotspots,
  ]);

  const toggleLanguage = () => {
    const next = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(next);
    localStorage.setItem('scg_language', next);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden select-none">
      {/* 1. FULLSCREEN LEAFLET MAP CANVAS */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* 2. FLOATING GOOGLE MAPS SEARCH PILL (TOP-LEFT) */}
      <FloatingSearchBar
        currentCity={currentCity}
        onSelectCity={onSelectCity}
        onLocateMe={handleLocateMe}
        isLocating={isLocating}
        onOpenAlerts={() => setIsAlertDrawerOpen(true)}
        activeAlertsCount={2}
      />

      {/* 3. FLOATING TOP UTILITIES (Theme, Language, Landing Page Link) */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 hidden md:flex items-center gap-1.5 glass-panel p-1 rounded-2xl shadow-xl border border-slate-200/90 dark:border-emerald-800/60">
        {/* Switcher: Air Quality Experience vs GIS Map vs Regional Stations Hub */}
        <div className="flex items-center gap-1 bg-slate-100/90 dark:bg-black/40 p-0.5 rounded-xl border border-slate-200/60 dark:border-blue-950/60">
          <button
            onClick={() => {
              soundService.playClick();
              setDashboardView('eugene_air');
              setMobileTab('home');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              dashboardView === 'eugene_air'
                ? 'bg-[#2F80ED] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#2F80ED]'
            }`}
          >
            <span>📱</span>
            <span>Air Experience</span>
            <span className="text-[9px] px-1 py-0.2 rounded-full bg-blue-100 dark:bg-blue-900/60 text-[#2F80ED] dark:text-blue-200 font-mono">UI</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              setDashboardView('map');
              setMobileTab('map');
            }}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              dashboardView === 'map'
                ? 'bg-[#2F80ED] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#2F80ED]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>GIS Map</span>
          </button>

          <button
            onClick={() => {
              soundService.playClick();
              setDashboardView('records');
              setMobileTab('records');
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              dashboardView === 'records'
                ? 'bg-[#2F80ED] text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-300 hover:text-[#2F80ED]'
            }`}
          >
            <TableIcon className="w-3.5 h-3.5" />
            <span>Regional Stations</span>
            <span className="text-[9px] px-1 py-0.2 rounded-full bg-emerald-500/20 text-emerald-500 font-mono">Live</span>
          </button>
        </div>

        <span className="text-slate-300 dark:text-slate-700">|</span>

        <Link
          to="/overview"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-emerald-950/60 transition-colors"
        >
          <Home className="w-3.5 h-3.5 text-emerald-500" />
          <span>{t('nav.landing')}</span>
        </Link>

        <span className="text-slate-300 dark:text-slate-700">|</span>

        <button
          onClick={toggleLanguage}
          className="px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-emerald-500 transition-colors"
        >
          {i18n.language === 'hi' ? 'EN' : 'हिन्दी'}
        </button>

        <button
          onClick={toggleDarkMode}
          className="p-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-amber-400 transition-colors"
          title="Toggle Theme (T)"
        >
          {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        <span className="text-slate-300 dark:text-slate-700">|</span>

        <button
          onClick={() => {
            const next = soundService.toggleMute();
            setIsMuted(next);
            if (!next) soundService.playAlertChime('info');
          }}
          className="p-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-emerald-500 transition-colors"
          title={isMuted ? 'Sound Cues Muted (M)' : 'Sound Cues Active (M)'}
        >
          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-500" />}
        </button>

        <button
          onClick={() => {
            soundService.playClick();
            setIsShortcutsOpen(true);
          }}
          className="p-1.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-emerald-500 transition-colors"
          title="Keyboard Shortcuts (?)"
        >
          <Keyboard className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. FLOATING TOP-RIGHT STATS DOCK */}
      <FloatingStatsCard data={liveData} forceMinimized={Boolean(selectedFeature)} />

      {/* 5. ACTIVE EVACUATION ROUTE BANNER (TOP-CENTER IF ROUTE ACTIVE) */}
      {activeEvacRoute && (
        <div className="absolute top-16 left-1/2 transform -translate-x-1/2 z-30 flex items-center gap-2 glass-panel px-4 py-2 rounded-2xl shadow-2xl border border-emerald-500 text-xs text-slate-800 dark:text-slate-100 animate-fadeIn">
          <Route className="w-4 h-4 text-emerald-500 animate-bounce" />
          <span>Evacuation Path to <b>{activeEvacRoute.toName}</b> ({activeEvacRoute.distKm} km)</span>
          <button
            onClick={clearEvacRoute}
            className="ml-2 text-slate-400 hover:text-rose-500 font-bold"
            title="Clear Route"
          >
            ✕
          </button>
        </div>
      )}

      {/* 6. GOOGLE MAPS VERTICAL RIGHT CONTROL STACK */}
      <div className="absolute right-4 bottom-28 z-30 flex flex-col gap-1.5">
        <div className="glass-panel p-1 rounded-2xl shadow-2xl flex flex-col gap-1 border border-slate-200/90 dark:border-emerald-800/60">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-emerald-950/60 transition-colors"
            title="Zoom In"
          >
            <span className="text-base font-black leading-none">+</span>
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-emerald-950/60 transition-colors"
            title="Zoom Out"
          >
            <span className="text-base font-black leading-none">−</span>
          </button>
          <div className="h-px bg-slate-200 dark:bg-emerald-950/80 my-0.5" />
          <button
            onClick={resetNorth}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-emerald-950/60 transition-colors"
            title="Reset North & Recenter City"
          >
            <Compass className="w-4 h-4 text-emerald-500" />
          </button>
          <button
            onClick={toggleFullscreenMode}
            className="p-2.5 rounded-xl text-slate-700 dark:text-slate-200 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-emerald-950/60 transition-colors"
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 7. FLOATING RADAR TIMELINE SCRUBBER (BOTTOM-CENTER) */}
      <RadarTimelineScrubber
        activeMode={radarMode}
        onChangeMode={(mode) => setRadarMode(mode)}
        onTimeChange={(hours) => {
          // Adjust simulated opacity/layer dynamics on scrub
          if (hours !== 0) {
            soundService.playAlertChime('info');
          }
        }}
      />

      {/* 8. FLOATING LAYER TOGGLE DOCK (BOTTOM-LEFT) */}
      <div className="absolute bottom-6 left-4 z-30 flex flex-col gap-2">
        <button
          onClick={() => setIsLayerDockOpen(!isLayerDockOpen)}
          className="glass-panel px-3.5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-extrabold text-slate-800 dark:text-slate-100 border border-slate-200/90 dark:border-emerald-800/80 hover:border-emerald-500 transition-all hover:scale-105"
        >
          <Layers className="w-4 h-4 text-emerald-500 animate-pulse" />
          <span>Radar & Map Overlays</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-mono">
            {[showAqiHeatmap, showFireHotspots, showFloodRisk, showDangerZones, showCitizenReports, showShelters].filter(Boolean).length}
          </span>
        </button>

        {isLayerDockOpen && (
          <div className="glass-panel rounded-3xl p-4 shadow-2xl border border-slate-200 dark:border-emerald-800/80 w-72 space-y-3 animate-fadeIn">
            {/* Basemap Satellite / Dark Switcher */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                Cartographic Basemap & Local Details
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs font-bold text-center">
                <button
                  onClick={() => {
                    soundService.playClick();
                    setTileMode('google_streets');
                  }}
                  className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-[11px] ${
                    tileMode === 'google_streets'
                      ? 'bg-emerald-600 text-white shadow-eco-sm'
                      : 'bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 hover:text-emerald-500'
                  }`}
                >
                  <span>🗺️</span>
                  <span>Google Streets (Local)</span>
                </button>
                <button
                  onClick={() => {
                    soundService.playClick();
                    setTileMode('google_hybrid');
                  }}
                  className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-[11px] ${
                    tileMode === 'google_hybrid'
                      ? 'bg-emerald-600 text-white shadow-eco-sm'
                      : 'bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 hover:text-emerald-500'
                  }`}
                >
                  <span>🛰️</span>
                  <span>Google Hybrid</span>
                </button>
                <button
                  onClick={() => {
                    soundService.playClick();
                    setTileMode('osm_local');
                  }}
                  className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-[11px] ${
                    tileMode === 'osm_local'
                      ? 'bg-emerald-600 text-white shadow-eco-sm'
                      : 'bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 hover:text-emerald-500'
                  }`}
                >
                  <span>🏘️</span>
                  <span>OSM Local</span>
                </button>
                <button
                  onClick={() => {
                    soundService.playClick();
                    setTileMode('arcgis_imagery');
                  }}
                  className={`py-2 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-[11px] ${
                    tileMode === 'arcgis_imagery'
                      ? 'bg-emerald-600 text-white shadow-eco-sm'
                      : 'bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 hover:text-emerald-500'
                  }`}
                >
                  <span>🛰️</span>
                  <span>ArcGIS Satellite</span>
                </button>
                <button
                  onClick={() => {
                    soundService.playClick();
                    setTileMode('arcgis_dark');
                  }}
                  className={`col-span-2 py-1.5 px-2 rounded-xl transition-all flex items-center justify-center gap-1.5 text-[11px] ${
                    tileMode === 'arcgis_dark'
                      ? 'bg-emerald-600 text-white shadow-eco-sm'
                      : 'bg-slate-100 dark:bg-black/30 text-slate-600 dark:text-slate-400 hover:text-emerald-500'
                  }`}
                >
                  <span>🌑</span>
                  <span>ArcGIS Dark Gray Canvas</span>
                </button>
              </div>
            </div>

            {/* Environmental Layer Checkboxes */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200/80 dark:border-slate-800 text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Active Hazard Overlays & Local Names
              </span>

              <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-emerald-950/40 cursor-pointer bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-500/20">
                <span className="flex items-center gap-2 text-slate-900 dark:text-slate-100 font-extrabold text-[11px]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm animate-pulse" />
                  Local Colonies & Hubs (MP Nagar, TT Nagar...)
                </span>
                <input
                  type="checkbox"
                  checked={showNeighborhoods}
                  onChange={(e) => setShowNeighborhoods(e.target.checked)}
                  className="accent-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-emerald-950/40 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-sm" />
                  Glowing Danger Zones
                </span>
                <input
                  type="checkbox"
                  checked={showDangerZones}
                  onChange={(e) => setShowDangerZones(e.target.checked)}
                  className="accent-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-emerald-950/40 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
                  CPCB AQI Heatmap Grid
                </span>
                <input
                  type="checkbox"
                  checked={showAqiHeatmap}
                  onChange={(e) => setShowAqiHeatmap(e.target.checked)}
                  className="accent-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-emerald-950/40 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
                  <span>NASA FIRMS Fire Hotspots</span>
                  {firmsStatus.isLive && (
                    <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                      LIVE ({firmsStatus.count})
                    </span>
                  )}
                </span>
                <input
                  type="checkbox"
                  checked={showFireHotspots}
                  onChange={(e) => setShowFireHotspots(e.target.checked)}
                  className="accent-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-emerald-950/40 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm" />
                  Flood Inundation Watershed
                </span>
                <input
                  type="checkbox"
                  checked={showFloodRisk}
                  onChange={(e) => setShowFloodRisk(e.target.checked)}
                  className="accent-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-emerald-950/40 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-700 shadow-sm" />
                  Civil Shelters & Hospitals
                </span>
                <input
                  type="checkbox"
                  checked={showShelters}
                  onChange={(e) => setShowShelters(e.target.checked)}
                  className="accent-emerald-600 rounded"
                />
              </label>

              <label className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-100/60 dark:hover:bg-emerald-950/40 cursor-pointer">
                <span className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shadow-sm" />
                  Citizen Ground Incidents
                </span>
                <input
                  type="checkbox"
                  checked={showCitizenReports}
                  onChange={(e) => setShowCitizenReports(e.target.checked)}
                  className="accent-emerald-600 rounded"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* 9. LIVE COORDINATES & DYNAMIC SCALE + CPCB LEGEND (BOTTOM-RIGHT) */}
      <div className="absolute bottom-6 right-20 z-30 hidden sm:flex items-center gap-2">
        <MapLegendBar zoom={currentZoom} latitude={currentCity.lat} />
        <div className="glass-panel px-3 py-1.5 rounded-xl shadow-lg border border-slate-200/80 dark:border-emerald-950 text-[10px] text-slate-500 dark:text-slate-400 font-mono hidden xl:flex items-center gap-2">
          <span>{cursorCoords.lat}°N, {cursorCoords.lng}°E</span>
          <span>•</span>
          <span>ESRI ArcGIS REST API</span>
          <span>•</span>
          <span>CPCB NAQI</span>
        </div>
      </div>

      {/* 10. SLIDING HOTSPOT DETAIL DRAWER (GOOGLE MAPS PLACE SHEET) */}
      <HotspotDetailDrawer
        feature={selectedFeature}
        onClose={() => setSelectedFeature(null)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
        onDrawRouteToShelter={(coords, name) => drawRouteToShelter(coords, name)}
      />

      {/* 11. EMERGENCY ALERT CENTER DRAWER */}
      <AlertDrawer
        isOpen={isAlertDrawerOpen}
        onClose={() => setIsAlertDrawerOpen(false)}
        cityName={currentCity.name}
      />

      {/* 12. CITIZEN INCIDENT REPORT MODAL */}
      <ReportIncidentModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        defaultLocation={`${currentCity.name} Sector, MP`}
      />

      {/* 13. POWER-USER KEYBOARD SHORTCUTS MODAL */}
      <KeyboardShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* 14. FLOATING GEMINI CLIMATE AI CHAT TRIGGER PILL */}
      <FloatingChatButton
        onClick={() => setIsChatOpen(true)}
        isOpen={isChatOpen}
      />

      {/* 15. GEMINI AI CLIMATE GUARDIAN CHAT MODAL (VOICE & SPEAK MODE) */}
      <GeminiClimateChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        liveData={liveData}
      />

      {/* 16. AIR QUALITY SHOWCASE VIEW (Exact Match to User Reference media_1791013058414.png) */}
      {dashboardView === 'eugene_air' && (
        <div className="absolute inset-0 z-40 overflow-y-auto animate-fadeIn">
          <EugeneAirShowcase
            currentCity={currentCity}
            liveData={liveData}
            onOpenMap={() => {
              soundService.playClick();
              setDashboardView('map');
              setMobileTab('map');
            }}
            onOpenChat={() => setIsChatOpen(true)}
            onOpenReportModal={() => setIsReportModalOpen(true)}
            onSelectCity={onSelectCity}
          />
        </div>
      )}

      {/* 17. REGIONAL RECORDS & TELEMETRY INSPECTOR VIEW */}
      {dashboardView === 'records' && (
        <div className="absolute inset-0 z-40 overflow-y-auto animate-fadeIn">
          <RegionalRecordsInspectorView
            currentCity={currentCity}
            liveData={liveData}
            onSelectCity={onSelectCity}
            onOpenMap={() => {
              soundService.playClick();
              setDashboardView('map');
              setMobileTab('map');
            }}
            onOpenChat={() => setIsChatOpen(true)}
            onOpenAlerts={() => setIsAlertDrawerOpen(true)}
          />
        </div>
      )}

      {/* 17. MOBILE BOTTOM NAVIGATION BAR (Phone-first Floating Dock) */}
      <MobileBottomNav
        activeTab={mobileTab}
        onChangeTab={handleMobileTabChange}
        unreadAlertsCount={2}
      />
    </div>
  );
};
