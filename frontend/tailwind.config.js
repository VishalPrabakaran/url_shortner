/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wixBg: '#F9F9FA',
        wixBorder: '#EAEAEA',
        wixTextPrimary: '#111111',
        wixTextSecondary: '#666666',
        wixBlue: '#0057FF',
        wixBlueHover: '#0046CC',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
