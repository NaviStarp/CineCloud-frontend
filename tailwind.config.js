// tailwind.config.js
const colors = require('tailwindcss/colors');

module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        // Paleta de colores variada
        primary: {
          50: colors.indigo[50],
          100: colors.indigo[100],
          200: colors.indigo[200],
          300: colors.indigo[300],
          400: colors.indigo[400],
          500: colors.indigo[500],
          600: colors.indigo[600],
          700: colors.indigo[700],
          800: colors.indigo[800],
          900: colors.indigo[900],
        },
        secondary: {
          50: colors.emerald[50],
          100: colors.emerald[100],
          200: colors.emerald[200],
          300: colors.emerald[300],
          400: colors.emerald[400],
          500: colors.emerald[500],
          600: colors.emerald[600],
          700: colors.emerald[700],
          800: colors.emerald[800],
          900: colors.emerald[900],
        },
        accent: {
          50: colors.amber[50],
          100: colors.amber[100],
          200: colors.amber[200],
          300: colors.amber[300],
          400: colors.amber[400],
          500: colors.amber[500],
          600: colors.amber[600],
          700: colors.amber[700],
          800: colors.amber[800],
          900: colors.amber[900],
        },
        neutral: {
          50: colors.coolGray[50],
          100: colors.coolGray[100],
          200: colors.coolGray[200],
          300: colors.coolGray[300],
          400: colors.coolGray[400],
          500: colors.coolGray[500],
          600: colors.coolGray[600],
          700: colors.coolGray[700],
          800: colors.coolGray[800],
          900: colors.coolGray[900],
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
