/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        forge: {
          bg: '#0a0a0b',
          surface: '#111114',
          card: '#16161a',
          border: '#1e1e24',
          ember: '#f97316',
          amber: '#f59e0b',
          glow: '#fb923c',
          muted: '#52525b',
          text: '#e4e4e7',
          dim: '#a1a1aa',
        },
      },
      fontFamily: {
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        display: ['"Syne"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        ember: '0 0 20px rgba(249,115,22,0.15)',
        'ember-lg': '0 0 40px rgba(249,115,22,0.2)',
        glow: '0 0 60px rgba(249,115,22,0.1)',
      },
      animation: {
        'pulse-ember': 'pulse-ember 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.3s ease-out',
        'fade-up': 'fadeUp 0.4s ease-out',
      },
      keyframes: {
        'pulse-ember': {
          '0%, 100%': { boxShadow: '0 0 10px rgba(249,115,22,0.1)' },
          '50%': { boxShadow: '0 0 25px rgba(249,115,22,0.3)' },
        },
        slideIn: {
          from: { transform: 'translateX(-10px)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        fadeUp: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
