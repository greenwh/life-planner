/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        'base': '18px',
        'lg': '20px',
        'xl': '22px',
        '2xl': '24px',
        '3xl': '28px',
        '4xl': '32px',
      },
    },
  },
  plugins: [],
}
