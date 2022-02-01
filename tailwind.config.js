const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    backgroundImage: {
      'cog-white': "url('/icons/cog-white.png')",
      'cog-blue': "url('/icons/cog-blue.png')",
      'office-building-white': "url('/icons/office-building-white.png')",
      'office-building-blue': "url('/icons/office-building-blue.png')",
      'chevron-down-white': "url('/icons/chevron-down-white.png')",
      'chevron-down-blue': "url('/icons/chevron-down-blue.png')",
      'chevron-up-white': "url('/icons/chevron-up-white.png')",
      'chevron-up-blue': "url('/icons/chevron-up-blue.png')",
    },
    extend: {
      colors: {
        'black': "#000000",
        'white': '#FFFFFF',
        'gray-light': '#F9FAFB',
        'gray-medium': '#F3F4F6',
        'gray-dark': '#E5E7EB',
        'dark-gray-lighter-still': '#999999',
        'dark-gray-lighter': '#555555',
        'dark-gray-light': '#3B3B3C',
        'dark-gray-medium': '#333333',
        'dark-gray-dark': '#2B2B2B',
        'dark-gray-darker': '#242424',
        'dark-blue': '#111827',
        'blue': "#0981C3",
        'slate-blue': "#6B7280",
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
