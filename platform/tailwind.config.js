/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#F59E0B',
          light: '#FCD34D',
          dark: '#D97706',
        },
        secondary: {
          DEFAULT: '#1F2937',
          light: '#374151',
          dark: '#111827',
        }
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #FCD34D, #F59E0B)',
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      fontSize: {
        'logo': ['2.5rem', { lineHeight: '1', fontWeight: '800' }],
      }
    },
  },
  plugins: [],
}
