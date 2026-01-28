/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue',
    './content/**/*.md',
  ],
  theme: {
    extend: {
      // Swiss Design System - Color Palette
      colors: {
        // Background
        'swiss-bg': '#FFFFFF',
        'swiss-bg-soft': '#F5F5F7',
        'swiss-bg-dark': '#000000',
        // Text
        'swiss-text': '#1D1D1F',
        'swiss-text-muted': '#86868b',
        'swiss-text-dark': '#FFFFFF',
        // Accent (Subtle, mostly monochrome)
        'swiss-accent': '#000000',
        'swiss-accent-blue': '#0071e3', // Keep for small interactions only
      },

      // Typography
      fontFamily: {
        sans: [
          'HarmonyOS Sans SC',
          'HarmonyOS Sans TC',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        display: [
          'HarmonyOS Sans SC',
          'HarmonyOS Sans TC',
          'Inter', // Use Inter for both for that consistent Swiss look
          'system-ui',
          'sans-serif',
        ],
      },

      // Grid System - 12 columns
      gridTemplateColumns: {
        '12': 'repeat(12, minmax(0, 1fr))',
      },

      // Spacing scale for Swiss grid
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
      },
      keyframes: {
        'slide-right': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(4px)' },
        },
        'scale-sm': {
          '0%': { transform: 'scale(1)' },
          '100%': { transform: 'scale(1.02)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'underline-expand': {
          '0%': { width: '0%', left: '0' },
          '100%': { width: '100%', left: '0' },
        }
      },
      animation: {
        'slide-right': 'slide-right 0.3s ease-out forwards',
        'scale-sm': 'scale-sm 0.3s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
    },
  },
  plugins: [],
}
