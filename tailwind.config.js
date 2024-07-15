/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["/src/index.html"],
  theme: {
    extend: {
      animation: {
        'bounce-short': 'bounce 0.5s ease-in-out 2',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  variants: {
    extend: {
      transform: ['hover', 'focus'],
      scale: ['hover', 'focus','group-hover'],
      translate: ['group-hover'],
      opacity: ['group-hover'],
      zIndex: {
        '60': '60',
      }
    },
  },
  plugins: [],
  darkMode: 'class',

}

