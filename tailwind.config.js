/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["/src/index.html"],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
            '0%': { opacity: '0', transform: 'translateY(10px)' },
            '100%': { opacity: '1', transform: 'translateY(0)' },
        }
    },
      animation: {
        'bounce-short': 'bounce 0.5s ease-in-out 2',
        fadeIn: 'fadeIn 0.5s ease-out forwards',
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

