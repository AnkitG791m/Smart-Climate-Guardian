import React, { useState } from 'react';
import { X, Upload, MapPin, AlertTriangle, Check, Camera, ShieldCheck } from 'lucide-react';

interface ReportIncidentModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultLocation?: string;
  defaultCoords?: [number, number];
  onSubmitReport?: (report: {
    title: string;
    category: string;
    severity: string;
    description: string;
    locationName: string;
    reporterName: string;
    imageUrl: string;
  }) => void;
}

export const ReportIncidentModal: React.FC<ReportIncidentModalProps> = ({
  isOpen = true,
  onClose,
  defaultLocation = 'Bhopal Central Flank, MP',
  defaultCoords = [23.2599, 77.4126],
  onSubmitReport,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Illegal Crop Burning');
  const [severity, setSeverity] = useState('high');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState(defaultLocation);
  const [reporterName, setReporterName] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Sample realistic eco photo presets
  const samplePhotos = [
    { label: 'Heavy Smoke', url: 'https://images.unsplash.com/photo-1542385151-efd9000785a0?auto=format&fit=crop&w=700&q=80' },
    { label: 'Urban Heat / Asphalt', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=700&q=80' },
    { label: 'Drainage Flood', url: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=700&q=80' },
    { label: 'Industrial Emission', url: 'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?auto=format&fit=crop&w=700&q=80' },
  ];
  const [selectedPhoto, setSelectedPhoto] = useState(samplePhotos[0].url);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    if (onSubmitReport) {
      onSubmitReport({
        title,
        category,
        severity,
        description,
        locationName,
        reporterName: reporterName || 'Anonymous Citizen Guardian',
        imageUrl: selectedPhoto,
      });
    }

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      if (onClose) onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-2xl max-h-[90vh] overflow-y-auto text-slate-800">
        {/* Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 rounded-2xl bg-blue-50 text-[#2F80ED] border border-blue-200">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Report Ground Environmental Incident
            </h3>
            <p className="text-xs text-slate-500">
              Corroborates with Open-Meteo & NASA FIRMS telemetry across the city grid.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-eco-glow">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white">
              Incident Broadcast Successful
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your observation has been geo-pinned to the environmental risk grid.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Title */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Incident Summary / Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Thick smoke from open garbage burning near bypass"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-semibold"
              />
            </div>

            {/* Category & Severity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Hazard Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="Illegal Crop Burning">Illegal Crop Burning</option>
                  <option value="Chemical Odor">Chemical Odor / Fumes</option>
                  <option value="Drainage Blockage">Drainage Blockage / Inundation</option>
                  <option value="Urban Heat Pocket">Urban Heat Pocket</option>
                  <option value="Industrial Smoke">Industrial Smoke</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Severity Level
                </label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500 font-semibold"
                >
                  <option value="moderate">Moderate - Noticeable Smell / Haze</option>
                  <option value="high">High - Acute Health Discomfort</option>
                  <option value="critical">Critical - Immediate Evacuation Threat</option>
                </select>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Geographic Landmark
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-emerald-500 absolute left-3 top-3" />
                <input
                  type="text"
                  value={locationName}
                  onChange={(e) => setLocationName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Detailed Observations *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe smoke density, odor characteristics, standing water depth, etc."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Photos */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Attach Visual Evidence
              </label>
              <div className="grid grid-cols-4 gap-2">
                {samplePhotos.map((photo, idx) => (
                  <div
                    key={idx}
                    onClick={() => setSelectedPhoto(photo.url)}
                    className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all relative ${
                      selectedPhoto === photo.url ? 'border-emerald-500 shadow-eco-glow' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={photo.url} alt={photo.label} className="w-full h-12 object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[8px] text-white text-center py-0.5 truncate">
                      {photo.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reporter Name */}
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Name (Optional)
              </label>
              <input
                type="text"
                placeholder="Leave blank to submit anonymously"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="w-full bg-slate-50 dark:bg-black/30 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-[#2F80ED] hover:bg-blue-600 text-white font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Publish Report to Environmental Grid</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
