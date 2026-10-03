import { describe, it, expect } from 'vitest';
import {
  calculateSubIndex,
  getCPCBCategory,
  computeCPCBNAQI,
  RawPollutantConcentrations
} from './cpcbAqi';

describe('Indian CPCB NAQI Calculation Engine', () => {
  describe('calculateSubIndex', () => {
    it('calculates PM2.5 sub-index correctly across bands', () => {
      // Band 1: 0 - 30 -> 0 - 50 (Good)
      expect(calculateSubIndex('PM2.5', 15)).toBe(25);
      expect(calculateSubIndex('PM2.5', 30)).toBe(50);

      // Band 2: 31 - 60 -> 51 - 100 (Satisfactory)
      expect(calculateSubIndex('PM2.5', 45.5)).toBeGreaterThanOrEqual(75);
      expect(calculateSubIndex('PM2.5', 45.5)).toBeLessThanOrEqual(77);

      // Band 3: 61 - 90 -> 101 - 200 (Moderate)
      expect(calculateSubIndex('PM2.5', 75.5)).toBeGreaterThanOrEqual(150);
      expect(calculateSubIndex('PM2.5', 75.5)).toBeLessThanOrEqual(152);

      // Band 4: 91 - 120 -> 201 - 300 (Poor)
      expect(calculateSubIndex('PM2.5', 105.5)).toBeGreaterThanOrEqual(250);
      expect(calculateSubIndex('PM2.5', 105.5)).toBeLessThanOrEqual(252);

      // Band 5: 121 - 250 -> 301 - 400 (Very Poor)
      expect(calculateSubIndex('PM2.5', 185.5)).toBeGreaterThanOrEqual(350);
      expect(calculateSubIndex('PM2.5', 185.5)).toBeLessThanOrEqual(352);

      // Band 6: 251 - 500 -> 401 - 500 (Severe)
      expect(calculateSubIndex('PM2.5', 375.5)).toBeGreaterThanOrEqual(450);
      expect(calculateSubIndex('PM2.5', 375.5)).toBeLessThanOrEqual(452);
    });

    it('calculates PM10 sub-index correctly', () => {
      // 0 - 50 -> 0 - 50
      expect(calculateSubIndex('PM10', 25)).toBe(25);
      // 51 - 100 -> 51 - 100
      expect(calculateSubIndex('PM10', 75)).toBe(75);
      // Cap for extreme concentrations
      expect(calculateSubIndex('PM10', 800)).toBe(500);
    });

    it('handles negative or invalid concentrations gracefully', () => {
      expect(calculateSubIndex('PM2.5', -10)).toBe(0);
      expect(calculateSubIndex('PM2.5', NaN)).toBe(0);
    });
  });

  describe('getCPCBCategory', () => {
    it('maps AQI values to official CPCB categories', () => {
      expect(getCPCBCategory(0)).toBe('Good');
      expect(getCPCBCategory(50)).toBe('Good');
      expect(getCPCBCategory(51)).toBe('Satisfactory');
      expect(getCPCBCategory(100)).toBe('Satisfactory');
      expect(getCPCBCategory(101)).toBe('Moderate');
      expect(getCPCBCategory(200)).toBe('Moderate');
      expect(getCPCBCategory(201)).toBe('Poor');
      expect(getCPCBCategory(300)).toBe('Poor');
      expect(getCPCBCategory(301)).toBe('Very Poor');
      expect(getCPCBCategory(400)).toBe('Very Poor');
      expect(getCPCBCategory(401)).toBe('Severe');
      expect(getCPCBCategory(500)).toBe('Severe');
    });
  });

  describe('computeCPCBNAQI', () => {
    it('correctly identifies dominant pollutant and overall AQI', () => {
      const sample: RawPollutantConcentrations = {
        pm25: 85,  // Moderate (~180)
        pm10: 45,  // Good (45)
        no2: 30,   // Good (38)
        so2: 12,   // Good (15)
        co: 850,   // 850 µg/m³ = 0.85 mg/m³ -> Good (~43)
        o3: 40     // Good (40)
      };

      const result = computeCPCBNAQI(sample);

      expect(result.dominantPollutant).toBe('PM2.5');
      expect(result.category).toBe('Moderate');
      expect(result.aqi).toBeGreaterThanOrEqual(180);
      expect(result.aqi).toBeLessThanOrEqual(185);
      expect(result.subIndices['PM2.5']).toBeDefined();
      expect(result.subIndices['PM10']).toBeDefined();
    });

    it('properly converts Open-Meteo CO from µg/m³ to mg/m³', () => {
      const sample: RawPollutantConcentrations = {
        co: 4500, // 4.5 mg/m³ -> CPCB Band 3: 2.1-10.0 -> 101-200 (Moderate)
      };

      const result = computeCPCBNAQI(sample);
      expect(result.subIndices['CO'].unit).toBe('mg/m³');
      expect(result.subIndices['CO'].concentration).toBe(4.5);
      expect(result.subIndices['CO'].subIndex).toBeGreaterThanOrEqual(125);
    });

    it('returns empty result safely when no concentrations provided', () => {
      const result = computeCPCBNAQI({});
      expect(result.aqi).toBe(0);
      expect(result.dominantPollutant).toBe('None');
      expect(result.category).toBe('Good');
    });
  });
});
