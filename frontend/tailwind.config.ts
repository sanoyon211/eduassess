import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class", // Configured as class mode, but dark mode is globally disabled and class is never applied
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium Deep Indigo Palette
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          500: '#6366f1',
          600: '#4f46e5', // Primary Deep Indigo
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
        },
        // Teal/Emerald Accent for Status & Success actions
        accent: {
          50: '#ecfdf5',
          100: '#d1fae5',
          500: '#10b981',
          600: '#059669',
        },
        // Warm Gray for background and subtle borders
        surface: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
        }
      },
      boxShadow: {
        // Soft, diffused shadows for the SaaS aesthetic
        sm: '0 2px 4px 0 rgb(0 0 0 / 0.02)',
        card: '0 4px 6px -1px rgb(0 0 0 / 0.04), 0 2px 4px -2px rgb(0 0 0 / 0.04)',
        soft: '0 10px 25px -3px rgb(0 0 0 / 0.05), 0 4px 6px -4px rgb(0 0 0 / 0.02)',
        glow: '0 0 15px rgba(79, 70, 229, 0.3)', // Subtle indigo glow for focused inputs/buttons
      },
      borderRadius: {
        // Modern rounded corners
        'xl': '0.75rem',
        '2xl': '1rem',
      }
    },
  },
  plugins: [],
};

export default config;