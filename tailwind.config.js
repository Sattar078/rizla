/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050505',
        accent: '#34D399',
        surface: '#111111',
        muted: '#9ca3af',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        poppins: ['"Poppins"', 'sans-serif'],
        montserrat: ['"Montserrat"', 'sans-serif'],
      },
    },
  },
    colors: {
        background: '#0D0D0D',
        text: '#F5F5F5',
        accent: '#4CAF50', // A nice, vibrant green
        accent: '#34D399', // A nice, vibrant green (Emerald 400)
      },
  plugins: [],
};