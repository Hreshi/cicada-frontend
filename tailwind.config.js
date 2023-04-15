/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0071C5',
      },
      
    },
    fontFamily: {
      sans: 'Segoe UI,Roboto, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif',
    },
    container: {
      center: true,
    }
  },
  plugins: [],
}
