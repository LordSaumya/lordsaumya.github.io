/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'q-bg': '#050510',
        'q-wire': '#1e1e38',
        'q-accent': '#00ffcc',
      }
    },
  },
  plugins: [],
}