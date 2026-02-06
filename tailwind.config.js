/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0B0E14',
        mint: '#2DD4BF',
        lemon: '#FACC15',
        coral: '#F97316',
        slate: '#111827',
        fog: '#E5E7EB'
      }
    }
  },
  plugins: []
};
