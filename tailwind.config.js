/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 5px 0 rgba(0, 0, 0, 0.05)',
        dropdown: '0 2px 5px 0 rgba(0, 0, 0, 0.1)',
      },
      fontSize: {
        '2xs': '0.625rem',
        'xxs': '0.625rem',
      },
      screens: {
        'xs': '480px',  // Pour les très petits appareils mobiles
        'sm': '640px',  // Petits appareils mobiles (par défaut)
        'md': '768px',  // Tablettes (par défaut)
        'lg': '1024px', // Petits ordinateurs portables (par défaut)
        'xl': '1280px', // Ordinateurs portables et desktops (par défaut)
        '2xl': '1536px', // Grands écrans (par défaut)
        '3xl': '1920px', // Très grands écrans
        'print': {'raw': 'print'}, // Media query pour l'impression
      },
      spacing: {
        '72': '18rem',
        '84': '21rem',
        '96': '24rem',
        '112': '28rem',
        '128': '32rem',
      },
      maxWidth: {
        '8xl': '88rem', // 1408px
        '9xl': '96rem', // 1536px
      },
      minHeight: {
        'screen-75': '75vh',
        'screen-50': '50vh',
      },
      gridTemplateColumns: {
        'auto-fit-200': 'repeat(auto-fit, minmax(200px, 1fr))',
        'auto-fit-250': 'repeat(auto-fit, minmax(250px, 1fr))',
        'auto-fit-300': 'repeat(auto-fit, minmax(300px, 1fr))',
      },
    },
  },
  plugins: [
    // @ts-expect-error - Ignore le require pour les plugins Tailwind
    // eslint-disable-next-line
    require('@tailwindcss/forms')
  ],
  safelist: [
    // Classes pour les différents statuts
    'bg-gray-100',
    'text-gray-800',
    'bg-blue-100',
    'text-blue-800',
    'bg-green-100',
    'text-green-800',
    'bg-red-100',
    'text-red-800',
    'bg-yellow-100',
    'text-yellow-800',
    'bg-purple-100',
    'text-purple-800',
  ],
} 