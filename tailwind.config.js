/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        darkBg: '#090D1A',       // Custom deep black/blue canvas background
        darkCard: '#121829',     // Glass background color for cards
        glowIndigo: '#6366f1',   // Neon highlights
        glowPurple: '#a855f7'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(99, 102, 241, 0.15)',
        glowEmerald: '0 0 20px rgba(16, 185, 129, 0.15)'
      }
    },
  },
  plugins: [],
}
