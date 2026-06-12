/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // SmartCare clinical palette — clean, hospital-grade
        brand: {
          50:  '#eef7ff',
          100: '#d9eeff',
          200: '#bbdfff',
          300: '#8bcaff',
          400: '#54aeff',
          500: '#2e8fe8',
          600: '#1a71ce',
          700: '#155aa6',
          800: '#174b88',
          900: '#193f70',
          950: '#112849',
        },
        clinical: {
          50:  '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
        },
        risk: {
          low:      '#16a34a',
          moderate: '#d97706',
          high:     '#dc2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,.06), 0 4px 16px rgba(0,0,0,.04)',
        'card-md': '0 2px 8px rgba(0,0,0,.08), 0 8px 24px rgba(0,0,0,.06)',
      },
      animation: {
        'fade-in':   'fadeIn .25s ease-out',
        'slide-up':  'slideUp .3s ease-out',
        'slide-in':  'slideIn .35s ease-out',
      },
      keyframes: {
        fadeIn:  { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        slideUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        slideIn: { '0%': { opacity: 0, transform: 'translateX(24px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
}
