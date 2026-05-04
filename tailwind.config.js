/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)'],
        body: ['var(--font-body)'],
        mono: ['var(--font-mono)'],
      },
      colors: {
        amber: {
          DEFAULT: '#F59E0B',
          50: '#FFFBEB',
          100: '#FEF3C7',
          400: '#FBBF24',
          500: '#F59E0B',
          600: '#D97706',
        },
        risk: {
          low: '#10B981',
          medium: '#F59E0B',
          high: '#EF4444',
          critical: '#7C3AED',
        }
      },
      animation: {
        'scan-line': 'scanLine 2s ease-in-out infinite',
        'pulse-ring': 'pulseRing 1.5s ease-out infinite',
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'slide-in': 'slideIn 0.4s ease-out forwards',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        scanLine: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.5' },
          '50%': { transform: 'translateY(100%)', opacity: '1' },
        },
        pulseRing: {
          '0%': { transform: 'scale(0.8)', opacity: '1' },
          '100%': { transform: 'scale(2)', opacity: '0' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
