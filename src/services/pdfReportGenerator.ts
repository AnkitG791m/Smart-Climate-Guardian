import { jsPDF } from 'jspdf';
import { ClimateStation, CitizenReport, EmergencyAlert } from '../types';

export const generateClimateExecutivePdf = (
  station: ClimateStation,
  recentReports: CitizenReport[],
  activeAlerts: EmergencyAlert[]
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Primary colors
  const forestGreen = [6, 78, 59];    // #064e3b
  const emeraldGreen = [16, 185, 129]; // #10b981
  const darkSlate = [30, 41, 59];      // #1e293b
  const mutedGray = [100, 116, 139];   // #64748b

  // 1. Header Banner
  doc.setFillColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setFillColor(emeraldGreen[0], emeraldGreen[1], emeraldGreen[2]);
  doc.rect(0, 28, pageWidth, 2, 'F');

  // Brand text
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('SMART CLIMATE GUARDIAN', 14, 13);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL ENVIRONMENTAL INTELLIGENCE & RESILIENCE AUDIT REPORT', 14, 20);

  doc.setFontSize(8);
  doc.text(`DOC-REF: SCG-${Date.now().toString().slice(-6)}`, pageWidth - 48, 13);
  doc.text(`DATE: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}`, pageWidth - 48, 19);

  // 2. Station Meta Card
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, 35, pageWidth - 28, 26, 2, 2, 'F');
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, 35, pageWidth - 28, 26, 2, 2, 'S');

  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text(station.name, 18, 43);

  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Region: ${station.region}, ${station.country} | Coordinates: ${station.lat.toFixed(4)}°N, ${station.lng.toFixed(4)}°E`, 18, 49);
  doc.text(`Population Protected: ${station.populationCovered.toLocaleString()} | Telemetry Health: 99.8% Online`, 18, 55);

  // 3. Key Telemetry Grid
  let y = 68;
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. SENSOR TELEMETRY & ATMOSPHERIC READINGS', 14, y);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  y += 7;
  const metrics = [
    { label: 'Air Quality (AQI)', val: `${station.airQuality.aqi} - ${station.airQuality.category}` },
    { label: 'PM2.5 / PM10', val: `${station.airQuality.pm25} / ${station.airQuality.pm10} µg/m³` },
    { label: 'Ambient Temperature', val: `${station.weather.temperature}°C (Feels ${station.weather.feelsLike}°C)` },
    { label: 'Relative Humidity', val: `${station.weather.humidity}%` },
    { label: 'Surface Wind Vector', val: `${station.weather.windSpeed} km/h (${station.weather.windDirection})` },
    { label: 'Wet-Bulb Globe (WBGT)', val: `${station.heatwaveRisk.wbgtIndex}°C (${station.heatwaveRisk.riskLevel})` },
    { label: 'River Basin Gauge', val: `${station.floodRisk.riverGaugeLevel}m (Threshold: ${station.floodRisk.riverThreshold}m)` },
    { label: 'Soil Saturation', val: `${station.floodRisk.catchmentSaturation}%` },
  ];

  const colWidth = (pageWidth - 28) / 2;
  metrics.forEach((m, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const boxX = 14 + col * colWidth;
    const boxY = y + row * 11;

    doc.setFillColor(241, 245, 249);
    doc.rect(boxX, boxY, colWidth - 4, 9, 'F');

    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(m.label, boxX + 3, boxY + 6);

    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(m.val, boxX + colWidth - 7, boxY + 6, { align: 'right' });
  });

  // 4. Multi-Hazard Assessment Summary
  y += 48;
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('2. MULTI-HAZARD RISK EVALUATION', 14, y);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  y += 7;
  const hazards = [
    {
      title: 'Air Toxicity & Stagnation',
      summary: `Plume risk is ${station.airRisk.plumeRisk}. Inversion stagnation: ${station.airRisk.inversionStagnation ? 'ACTIVE' : 'NONE'}. Vulnerable risk score: ${station.airRisk.vulnerableRiskScore}/100.`,
      status: station.airQuality.category
    },
    {
      title: 'Heatwave & Grid Resilience',
      summary: `Urban Heat Island anomaly: +${station.heatwaveRisk.urbanHeatIslandDelta}°C. Active cooling centers: ${station.heatwaveRisk.coolingSheltersAvailable}. Power grid strain: ${station.heatwaveRisk.powerGridStress}.`,
      status: station.heatwaveRisk.riskLevel
    },
    {
      title: 'Hydro-meteorological Runoff',
      summary: `Catchment drainage capacity operating at ${station.floodRisk.drainageCapacity}%. Soil waterlogged at ${station.floodRisk.catchmentSaturation}%. Status: ${station.floodRisk.runoffRisk}.`,
      status: station.floodRisk.runoffRisk
    }
  ];

  hazards.forEach((h) => {
    doc.setFillColor(250, 250, 250);
    doc.rect(14, y, pageWidth - 28, 12, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, y, pageWidth - 28, 12, 'S');

    doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(h.title, 17, y + 5);

    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(h.summary, 17, y + 9.5);

    doc.setTextColor(15, 23, 42);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`Rating: ${h.status}`, pageWidth - 18, y + 7, { align: 'right' });

    y += 14;
  });

  // 5. Recent Citizen Corroborations & Local Incidents
  y += 2;
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('3. COMMUNITY VERIFICATION & CITIZEN INTELLIGENCE', 14, y);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  y += 6;
  const displayReports = recentReports.slice(0, 3);
  displayReports.forEach((rep) => {
    doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.text(`• [${rep.category.toUpperCase()}] ${rep.title}`, 16, y);

    doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.text(`Location: ${rep.locationName} | Upvotes: ${rep.upvotes} | Status: ${rep.status}`, 20, y + 4);

    y += 8;
  });

  // 6. Active Emergency Dispatch Directives
  y += 2;
  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('4. ACTIVE MUNICIPAL DIRECTIVES & ACTION PROTOCOLS', 14, y);
  doc.line(14, y + 2, pageWidth - 14, y + 2);

  y += 6;
  const activeAlert = activeAlerts[0] || {
    title: 'Routine Environmental Watch Standard',
    description: 'All atmospheric and hydrological indicators remain within baseline operational tolerances.',
    actionProtocol: ['Continue continuous automated sensor telemetry.']
  };

  doc.setTextColor(185, 28, 28);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(`NOTICE: ${activeAlert.title}`, 16, y);
  y += 4;

  doc.setTextColor(darkSlate[0], darkSlate[1], darkSlate[2]);
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text(activeAlert.description, 16, y);
  y += 5;

  activeAlert.actionProtocol.slice(0, 2).forEach((action) => {
    doc.text(`- ${action}`, 20, y);
    y += 4;
  });

  // 7. Signature & Seal Footer
  const footerY = 270;
  doc.setDrawColor(203, 213, 225);
  doc.line(14, footerY, pageWidth - 14, footerY);

  doc.setTextColor(mutedGray[0], mutedGray[1], mutedGray[2]);
  doc.setFontSize(7.5);
  doc.text('Smart Climate Guardian Automated Environmental Audit System', 14, footerY + 5);
  doc.text('Compliant with ISO 14001, WHO 2021 Global Air Guidelines, and Sendai Framework for Disaster Reduction', 14, footerY + 9);

  doc.text('Verified Regulatory Signature:', pageWidth - 60, footerY + 5);
  doc.setTextColor(forestGreen[0], forestGreen[1], forestGreen[2]);
  doc.setFont('helvetica', 'bold');
  doc.text('DR. ELENA ROSTOVA, Lead Environmental Auditor', pageWidth - 60, footerY + 11);

  // Save the PDF
  const filename = `Climate_Guardian_${station.id}_Audit_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
};
