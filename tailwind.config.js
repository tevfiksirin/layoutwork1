const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ['./src/**/*.njk', './src/**/*.js', './src/**/*.vue'],
  theme: {
    container: false,

    maxWidth: {
      '1/12': '8.333333%',
      '2/12': '16.666667%',
      '3/12': '25%',
      '4/12': '33.333333%',
      '5/12': '41.666667%',
      '6/12': '50%',
      '7/12': '58.333333%',
      '8/12': '66.666667%',
      '9/12': '75%',
      '10/12': '83.333333%',
      'full': '100%',
      'xs': '20rem',
      'sm': '24rem',
      'md': '28rem',
      'lg': '32rem',
      'xl': '36rem',
      '2xl': '42rem',
      '3xl': '48rem',
      '4xl': '56rem',
      '5xl': '64rem',
      '6xl': '72rem',
      '7xl': '80rem'
    },

    extend: {
      spacing: {
        '1/12': '8.333333%',
        '2/12': '16.666667%',
        '3/12': '25%',
        '4/12': '33.333333%',
      },

      typography: (theme) => ({


        DEFAULT: {
          css: {
            // color: theme('colors.white'),
            // opacity: 0.5,
            h2: {
              'font-family': theme('fontFamily.lowan') + '!important',
              'font-size': theme('fontSize.2xl'),
              'text-transform': 'uppercase',
            },
            img: {
              'max-width': '70%',
              'margin-left': 'auto',
              'margin-right': 'auto',
            }
          },
        },
      }),
    },

    colors: {
      transparent: 'transparent',
      current: 'currentColor',
    },

    fontFamily: {
    },

    transitionTimingFunction: {
      'basic-ease': 'cubic-bezier(0.33, 0, 0.13, 1)',
      'secondary-ease': 'cubic-bezier(0.33, 0, 0.67, 1)',
      'linear': 'linear',
    },

    screens: {
      'xs': '340px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1366px',
      '3xl': '1536px',
      '4xl': '1680px',
      '5xl': '1800px',
    },
  },

  plugins: [
    plugin(function ({ addVariant }) {
      addVariant('optional', '&:optional')
      addVariant('hocus', ['&:hover', '&:focus'])
      addVariant('supports-grid', '@supports (display: grid)')
    }),
    plugin(({ addVariant }) => {
      addVariant('device-hover', '@media (pointer: fine) and (hover: hover)')
      addVariant('device-touch', '@media (pointer: coarse) and (hover: none)')
    }),
  ],
}
