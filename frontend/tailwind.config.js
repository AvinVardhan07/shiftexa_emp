/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        google: {
          blue: '#1A73E8',
          blueHover: '#1557B0',
          blueSoft: '#E8F0FE',
          bgLight: '#F0F4F9',
          textDark: '#1F1F1F',
          textMuted: '#5F6368',
          borderSubtle: '#E3E3E3',
        },
        brand: {
          50: '#e8f0fe',
          100: '#d2e3fc',
          400: '#4285f4',
          500: '#1a73e8',
          600: '#1557b0',
          700: '#104d9c',
          800: '#0c3b78',
          900: '#082852',
          accent: '#1A73E8',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Outfit', 'Google Sans', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Outfit', 'sans-serif'],
        mono: ['monospace'],
      },
      borderRadius: {
        'gemini': '28px',
        'gemini-lg': '32px',
      }
    },
  },
  plugins: [],
}

