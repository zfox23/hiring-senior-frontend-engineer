const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'black': "#000000",
        'white': '#FFFFFF',
        'gray-light': '#F9FAFB',
        'gray-medium': '#F3F4F6',
        'gray-dark': '#E5E7EB',
        'gray-darker': "#D1D5DB",
        'dark-gray-lighter-still': '#999999',
        'dark-gray-lighter': '#555555',
        'dark-gray-lightish': '#4D4E50',
        'dark-gray-light': '#3B3B3C',
        'dark-gray-medium': '#333333',
        'dark-gray-dark': '#2B2B2B',
        'dark-gray-darker': '#242424',
        'dark-blue': '#111827',
        'blue': "#0981C3",
        'slate-blue': "#6B7280",
        'dark-purple': "#1C1F37",
        'light-teal': "#5eead4",
        'teal': "#2DD4BF",
        'dark-teal': "#0D9488",
        'lilac': "#818CF8",
        'purple': "#4F46E5",
        'orange': "#F59E0B",
        'burnt-orange': "#B45309",
        'red': '#F33F5E',
      },
      fontFamily: {
        'sans': ['Metropolis', ...defaultTheme.fontFamily.sans]
      },
    },
  },
  variants: {
    extend: { backgroundImage: ['dark'] },
  },
  plugins: [],
}
