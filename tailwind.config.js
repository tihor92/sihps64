/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aicte: {
          primary: '#0B3B60', // AICTE Navy Blue
          secondary: '#D97706', // Gold / Amber
          dark: '#08253D',
          light: '#F0F4F8',
          accent: '#0284C7',
          surface: '#FFFFFF',
          border: '#E2E8F0'
        }
      }
    },
  },
  plugins: [],
};

