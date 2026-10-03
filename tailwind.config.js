/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0effe',
          200: '#bae0fd',
          300: '#7cc4fa',
          400: '#36a4f5',
          500: '#2F80ED', // Exact User Reference Blue
          600: '#2563eb',
          700: '#1d4ed8',
        },
        peach: {
          50: '#fffaf5',
          100: '#feefe2',
          200: '#fcdbc5',
          300: '#f9bc9b',
          400: '#f58e66',
          500: '#FF8A3D', // Exact User Reference Unhealthy Orange
          600: '#ea580c',
        },
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        cpcb: {
          good: '#10b981',
          satisfactory: '#84cc16',
          moderate: '#eab308',
          poor: '#FF8A3D',
          veryPoor: '#ef4444',
          severe: '#7f1d1d',
        },
        obsidian: {
          800: '#1e293b',
          850: '#172033',
          900: '#0f172a',
          950: '#0b1120',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'sky-sm': '0 2px 10px rgba(47, 128, 237, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'sky-md': '0 8px 30px rgba(47, 128, 237, 0.12), 0 2px 8px rgba(0, 0, 0, 0.04)',
        'card-soft': '0 10px 30px -4px rgba(30, 41, 59, 0.05), 0 2px 6px -1px rgba(30, 41, 59, 0.02)',
        'eco-sm': '0 2px 8px -2px rgba(47, 128, 237, 0.15)',
        'eco-md': '0 6px 20px -4px rgba(47, 128, 237, 0.2)',
        'eco-lg': '0 12px 32px -6px rgba(47, 128, 237, 0.25)',
        'eco-glow': '0 0 25px rgba(47, 128, 237, 0.35)',
      },
    },
  },
  plugins: [],
}
