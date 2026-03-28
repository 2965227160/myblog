/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'tajawal': ['Tajawal', 'sans-serif'],
        'fira': ['Fira Code', 'monospace'],
      },
      colors: {
        'primary': '#c084fc',
        'secondary': '#a78bfa',
        'accent': '#fbbf24',
        'cyan': '#67e8f9',
        'purple': '#a78bfa',
        'green': '#86efac',
      }
    },
  },
  plugins: [],
}
