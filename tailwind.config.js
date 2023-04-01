/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customOrange:'#FB923C',
        customYellow:'#FEF08A',
        customGreen:'#4ADE80',
        customPink:'#FCA5A5',
      }
    },
    container: {
      center: true,
    },
  },
  plugins: [],
}
