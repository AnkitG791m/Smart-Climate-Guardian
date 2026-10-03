import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  MapPin, 
  ShieldAlert, 
  CheckCircle2, 
  Activity, 
  Navigation, 
  Flame, 
  Waves, 
  Building, 
  PlusCircle, 
  Compass, 
  Clock, 
  Users,
  Route,
  PhoneCall,
  Share2,
  ExternalLink
} from 'lucide-react';
import { DangerZoneFeature, FireHotspotFeature, FloodInundationFeature, ShelterHospitalFeature, CitizenIncidentPin } from '../../data/mapFeaturesData';
import { soundService } from '../../services/soundService';

export type SelectedMapFeature =
  | { type: 'danger_zone'; data: DangerZoneFeature }
  | { type: 'fire_hotspot'; data: FireHotspotFeature }
  | { type: 'flood_zone'; data: FloodInundationFeature }
  | { type: 'shelter'; data: ShelterHospitalFeature }
  | { type: 'citizen_report'; data: CitizenIncidentPin };

interface HotspotDetailDrawerProps {
  feature: SelectedMapFeature | null;
  onClose: () => void;
  onOpenReportModal: () => void;
  onDrawRouteToShelter?: (coords: [number, number], name: string) => void;
}

export const HotspotDetailDrawer: React.FC<HotspotDetailDrawerProps> = ({
  feature,
  onClose,
  onOpenReportModal,
  onDrawRouteToShelter,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'factors' | 'shelters'>('overview');
  const [copiedLink, setCopiedLink] = useState(false);

  if (!feature) return null;

  const handleShare = () => {
    soundService.playAlertChime('info');
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="absolute inset-y-0 right-0 sm:top-4 sm:bottom-4 sm:right-4 z-40 w-full sm:w-[420px] max-w-full glass-panel shadow-2xl sm:rounded-3xl border border-slate-200/90 dark:border-emerald-800/60 overflow-y-auto animate-fadeIn flex flex-col justify-between">
      <div>
        {/* Hero Header with Background Gradient */}
        <div className="relative p-5 pb-4 border-b border-slate-200/80 dark:border-emerald-950/80 overflow-hidden bg-gradient-to-b from-emerald-500/10 dark:from-emerald-950/40 via-transparent to-transparent">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-emerald-950/60 transition-colors z-10"
            title="Close Details Panel"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Hazard Type Pill */}
          <div className="flex items-center gap-1.5 mb-2">
            {feature.type === 'danger_zone' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-500/15 text-red-600 dark:text-red-400 border border-red-500/30 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                Active Danger Corridor
              </span>
            )}
            {feature.type === 'fire_hotspot' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                <Flame className="w-3 h-3" />
                NASA FIRMS Fire Hotspot
              </span>
            )}
            {feature.type === 'flood_zone' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-500/30 flex items-center gap-1">
                <Waves className="w-3 h-3" />
                Flood Inundation Basin
              </span>
            )}
            {feature.type === 'shelter' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                <Building className="w-3 h-3" />
                Civil Defense Shelter
              </span>
            )}
            {feature.type === 'citizen_report' && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30 flex items-center gap-1">
                <Users className="w-3 h-3" />
                Citizen Ground Truth
              </span>
            )}
          </div>

          <h3 className="text-lg font-black text-slate-900 dark:text-white pr-8 leading-snug">
            {feature.type === 'danger_zone' && feature.data.name}
            {feature.type === 'fire_hotspot' && feature.data.name}
            {feature.type === 'flood_zone' && feature.data.basinName}
            {feature.type === 'shelter' && feature.data.name}
            {feature.type === 'citizen_report' && feature.data.title}
          </h3>

          <div className="flex items-center gap-2 mt-2 text-xs text-slate-400 font-mono">
            <MapPin className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span className="truncate">
              {feature.type === 'danger_zone' && `${feature.data.coordinates[0].toFixed(4)}°N, ${feature.data.coordinates[1].toFixed(4)}°E`}
              {feature.type === 'fire_hotspot' && `${feature.data.lat.toFixed(4)}°N, ${feature.data.lng.toFixed(4)}°E`}
              {feature.type === 'flood_zone' && `${feature.data.lat.toFixed(4)}°N, ${feature.data.lng.toFixed(4)}°E`}
              {feature.type === 'shelter' && `${feature.data.lat.toFixed(4)}°N, ${feature.data.lng.toFixed(4)}°E`}
              {feature.type === 'citizen_report' && feature.data.locationName}
            </span>
          </div>

          {/* Action Quick Bar */}
          <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-200/60 dark:border-emerald-950/60 text-xs">
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-black/30 text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors font-medium"
            >
              <Share2 className="w-3 h-3" />
              <span>{copiedLink ? 'Copied Link!' : 'Share Dossier'}</span>
            </button>
          </div>
        </div>

        {/* Feature Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Danger Zone Specific Information */}
          {feature.type === 'danger_zone' && (
            <>
              {/* Risk Score & Affected Radius Metrics */}
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                  <span className="text-[10px] font-bold uppercase text-red-600 dark:text-red-400 block font-sans">
                    Hazard Score
                  </span>
                  <span className="text-2xl font-black text-red-600 dark:text-red-400">
                    {feature.data.riskScore} <span className="text-xs">/ 100</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block font-sans">Severity: {feature.data.severity}</span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block font-sans">
                    Affected Radius
                  </span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {feature.data.affectedRadiusKm} <span className="text-xs">km</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block font-sans">
                    {feature.data.populationExposed.toLocaleString()} Exposed
                  </span>
                </div>
              </div>

              {/* Verified Ground-Truth Atmospheric Observation */}
              <div className="rounded-2xl overflow-hidden border border-red-500/30 bg-slate-900 relative group shadow-lg">
                <img 
                  src="/images/smog-haze-city.png" 
                  alt="City smog haze inversion" 
                  className="w-full h-40 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-600/90 text-white backdrop-blur-md border border-white/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    CPCB Corridor Cam
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-slate-200 backdrop-blur-md">
                    Elevated Inversion 540m
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold flex items-center gap-1 text-red-400">
                      <AlertTriangle className="w-3.5 h-3.5" /> Dense Smog Ceiling
                    </span>
                    <span className="font-mono text-[9px] text-slate-300">Radius: {feature.data.affectedRadiusKm}km</span>
                  </div>
                  <p className="text-[11px] text-slate-200 mt-0.5 font-medium line-clamp-1">
                    Fine particulate thermal inversion trapping exhaust & industrial haze over urban agglomeration.
                  </p>
                </div>
              </div>

              {/* Explainable Environmental Factors */}
              <div className="space-y-1.5 pt-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Explainable Environmental Factors:</span>
                </h4>
                <div className="space-y-1.5">
                  {feature.data.reasons.map((r, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/20 border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 leading-relaxed text-[11px] flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0" />
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Health & Safety Directives */}
              <div className="space-y-1.5 pt-1">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
                  <span>Mandatory Public Directives:</span>
                </h4>
                <div className="space-y-1.5">
                  {feature.data.recommendations.map((rec, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-amber-900 dark:text-amber-200 text-[11px] leading-relaxed flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Fire Hotspot */}
          {feature.type === 'fire_hotspot' && (
            <>
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20">
                  <span className="text-[10px] font-bold uppercase text-amber-600 font-sans block">Confidence</span>
                  <span className="text-2xl font-black text-amber-600 dark:text-amber-400">
                    {feature.data.confidencePercent}%
                  </span>
                  <span className="text-[10px] text-slate-500 block font-sans">
                    {feature.data.confidenceLevel ? `${feature.data.confidenceLevel.toUpperCase()} Quality` : 'Satellite Verified'}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-500 font-sans block">Thermal Brightness</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {feature.data.brightnessTempK} K
                  </span>
                  <span className="text-[10px] text-slate-500 block font-sans">~{feature.data.estimatedAreaHectares} Ha Area</span>
                </div>
              </div>

              {/* Fire Radiative Power (FRP) & Pass Telemetry */}
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <span className="text-[9px] font-bold uppercase text-orange-600 font-sans block">Radiative Power (FRP)</span>
                  <span className="text-lg font-black text-orange-600 dark:text-orange-400">
                    {feature.data.frpMw ? `${feature.data.frpMw} MW` : 'Active'}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] font-bold uppercase text-slate-500 font-sans block">Orbit Pass</span>
                  <span className="text-lg font-bold text-slate-800 dark:text-slate-200 font-sans flex items-center justify-center gap-1">
                    {feature.data.daynight === 'N' ? '🌙 Night' : '☀️ Day'}
                  </span>
                </div>
              </div>

              {/* Verified Ground Truth Field Photo */}
              <div className="rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-900 relative group shadow-lg">
                <img 
                  src="/images/wildfire-citizen-action.png" 
                  alt="Citizen manual dousing of roadside scrub fire" 
                  className="w-full h-44 object-cover object-center group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-600/90 text-white backdrop-blur-md border border-white/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                    NASA FIRMS VIIRS
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-black/70 text-slate-200 backdrop-blur-md">
                    {feature.data.satellite || 'Suomi-NPP'}
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/95 via-black/70 to-transparent text-white">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold flex items-center gap-1 text-amber-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Thermal Satellite Tracked
                    </span>
                    <span className="font-mono text-[9px] text-slate-300">Lat: {feature.data.lat.toFixed(4)}°N</span>
                  </div>
                  <p className="text-[11px] text-slate-200 mt-1 font-medium leading-snug">
                    Real-time thermal anomaly detected by NASA satellite sensors with ground-level aerosol dispersion.
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Source Detection:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{feature.data.source}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Acquisition Time:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{feature.data.acqDate}, {feature.data.acqTime}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Instrument / Sensor:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {feature.data.instrument || 'VIIRS'} ({feature.data.satellite || 'Suomi-NPP'})
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/30 text-amber-900 dark:text-amber-300 text-[11px] leading-relaxed">
                Active stubble / scrub thermal anomaly releases concentrated PM2.5 and CO smoke plumes. Residents in downwind corridors should keep windows shut and wear N95 filtration.
              </div>
            </>
          )}

          {/* Flood Basins */}
          {feature.type === 'flood_zone' && (
            <>
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-3 rounded-2xl bg-sky-500/10 border border-sky-500/20">
                  <span className="text-[10px] font-bold uppercase text-sky-600 font-sans block">Catchment Sat.</span>
                  <span className="text-2xl font-black text-sky-600 dark:text-sky-400">
                    {feature.data.saturationPercent}%
                  </span>
                  <span className="text-[10px] text-slate-400 block font-sans">{feature.data.flowStatus}</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-sans block">Water Level</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {feature.data.waterLevelMeters}m
                  </span>
                  <span className="text-[10px] text-slate-400 block font-sans">Gauge (Max {feature.data.thresholdMeters}m)</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-900/30 text-sky-800 dark:text-sky-300 text-[11px] leading-relaxed">
                Catchment soil nearing full saturation. Drainage pumps active along arterial low-points. Avoid driving through submerged underpasses.
              </div>
            </>
          )}

          {/* Shelters & Hospitals */}
          {feature.type === 'shelter' && (
            <>
              <div className="grid grid-cols-2 gap-2 text-center font-mono">
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <span className="text-[10px] font-bold uppercase text-emerald-600 font-sans block">Beds Available</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {feature.data.availableCapacity}
                  </span>
                  <span className="text-[10px] text-slate-400 block font-sans">of {feature.data.totalCapacity} Total</span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800">
                  <span className="text-[10px] font-bold uppercase text-slate-400 font-sans block">Transit Distance</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">
                    {feature.data.distanceKm ?? 3.2} km
                  </span>
                  <span className="text-[10px] text-slate-400 block font-sans">Designated Safe Haven</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-black/20 border border-slate-200 dark:border-slate-800 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>Address:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-right">{feature.data.address}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Hotline:</span>
                  <a href={`tel:${feature.data.phone}`} className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline">
                    {feature.data.phone}
                  </a>
                </div>
                <div className="flex justify-between text-slate-500 pt-1 border-t border-slate-200 dark:border-slate-800">
                  <span>Medical Grade Oxygen:</span>
                  <span className="font-bold text-emerald-600">{feature.data.hasOxygenSupply ? 'Verified Available' : 'No'}</span>
                </div>
              </div>

              {onDrawRouteToShelter && (
                <button
                  onClick={() => onDrawRouteToShelter([feature.data.lat, feature.data.lng], feature.data.name)}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-eco-sm transition-all flex items-center justify-center gap-1.5"
                >
                  <Route className="w-3.5 h-3.5" />
                  <span>Show Evacuation Route on Map</span>
                </button>
              )}
            </>
          )}

          {/* Citizen Report */}
          {feature.type === 'citizen_report' && (
            <>
              {feature.data.imageUrl && (
                <div className="rounded-2xl overflow-hidden h-40 bg-slate-100 dark:bg-black border border-slate-200 dark:border-slate-800">
                  <img src={feature.data.imageUrl} alt={feature.data.title} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900/30 text-purple-800 dark:text-purple-300 text-[11px]">
                Reported by <b>{feature.data.reporterName}</b> • {feature.data.timestamp} • <b>{feature.data.corroborations}</b> citizen corroborations.
              </div>
            </>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-4 border-t border-slate-200/80 dark:border-emerald-950/80 bg-white/70 dark:bg-black/30 space-y-2">
        <button
          onClick={onOpenReportModal}
          className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-forest-800 hover:from-emerald-500 hover:to-forest-700 text-white font-bold text-xs shadow-eco-sm transition-all flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Report Ground Observation Here</span>
        </button>
      </div>
    </div>
  );
};
