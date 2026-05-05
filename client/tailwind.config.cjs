/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
      colors: {
        brand: {
          50:  '#f4f6f4',
          100: '#e1e7e1',
          200: '#c3cfc3',
          300: '#99aa99',
          400: '#6d816d',
          500: '#1B3022',
          600: '#15251a',
          700: '#101c14',
          800: '#0c150f',
          900: '#070c09',
        },
        warm: {
          50: '#faf7f2',
          100: '#f5efe6',
          200: '#ede0cd',
          300: '#e5d1b4',
          400: '#ddc29b',
          500: '#3E2723',
          600: '#321f1c',
          700: '#261715',
          800: '#1a100e',
          900: '#0e0807',
        },
        highlight: {
          DEFAULT: '#1B3022',
          hover: '#264330',
        },
        cream: {
          DEFAULT: '#FDF5E6',
        }
      },
    },
  },
  plugins: [],
}
