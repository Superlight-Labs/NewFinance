/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    'src/App.{js,jsx,ts,tsx}',
    'src/screens/**/*.{js,jsx,ts,tsx}',
    'src/components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    colors: {
      white: '#ffffff',
      black: '#000000',
      slate: {
        50: '#F8FAFC',
        100: '#F8F8F8',
        200: '#F1F1F1',
        400: '#8D93A0',
        900: '#2A2434',
      },
      superred: {
        100: '#F1DFDF',
        400: '#DAA3A3',
        900: '#A33A3A',
      },
      superblue: {
        100: '#F0F3FE',
        400: '#6986F8',
        900: '#343E99',
      },
      supergreen: {
        100: '#5BB5A2',
        400: '#72B3A3',
        900: '#0B8869',
      },
    },
    fontFamily: {
      manrope: ['Manrope-Regular'],
      'manrope-medium': ['Manrope-Medium'],
      'manrope-bold': ['Manrope-Bold'],
      inter: ['Inter-Regular'],
      'inter-medium': ['Inter-Medium'],
      'inter-bold': ['Inter-Bold'],
    },
  },
  plugins: [],
};
