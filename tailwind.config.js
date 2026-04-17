/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './config/*.json',
    './layout/*.liquid',
    './assets/*.liquid',
    './sections/*.liquid',
    './snippets/*.liquid',
    './templates/*.liquid',
    './templates/*.json',
    './templates/customers/*.liquid'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
          main: 'rgb(var(--color-primary-main) / <alpha-value>)',
          gold: "#F2AE4B"
        },
        secondary: {
          light: 'rgb(var(--color-secondary-light) / <alpha-value>)',
          dark: '#000000',
          gray: '#F5F5F5'
        }
      },
      fontFamily: {
        body: ['var(--font-family-body)', 'sans-serif']
      },
      aspectRatio: {
        '1/1': '1 / 1',
        '1728/2516': '1728 / 2516',
      },
      spacing: {
        '4.5': '1.125rem',
      },
      maxHeight: {
        '61': '15.25rem'
      },
      maxWidth: {
        'page': 'var(--page-width)'
      }
    },
  },
  plugins: [
      require('@tailwindcss/aspect-ratio')
  ],
}

