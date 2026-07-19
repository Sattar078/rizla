/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': '#0B0B0B',
        'accent': '#F97316', // A vibrant orange
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'poppins': ['"Poppins"', 'sans-serif'],
        'montserrat': ['"Montserrat"', 'sans-serif'],
      },
    },
  },
  plugins: [],
}