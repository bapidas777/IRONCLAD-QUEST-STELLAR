/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forge: {
          abyssal: '#0a0a0c',
          iron: '#1e1e24',
          ironLight: '#2c2c35',
          blood: '#8b0000',
          bloodLight: '#ff4d4d',
          copper: '#b87333',
          copperGlow: '#d99058',
          steel: '#71797E',
          rust: '#8b4513'
        }
      },
      backgroundImage: {
        'forge-texture': "url('https://www.transparenttextures.com/patterns/dark-matter.png')", // Or similar subtle texture
        'rusty-metal': "linear-gradient(to right bottom, #1e1e24, #0a0a0c)",
      },
      fontFamily: {
        cinematic: ['"Cinzel Decorative"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'neon-blood': '0 0 15px 2px rgba(139, 0, 0, 0.6)',
        'neon-copper': '0 0 15px 2px rgba(184, 115, 51, 0.4)',
        'forge-inset': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.8), inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
      }
    },
  },
  plugins: [],
}
