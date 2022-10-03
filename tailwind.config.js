/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {

      colors: {
        "black-color": "#030303",
        "gray-color": "#1c1c1c",
        "gray-color-light": "#2c2c2c",
        "gray-color-lighter": "#9c9c9c",
      },
    },
  },
  plugins: [],
}