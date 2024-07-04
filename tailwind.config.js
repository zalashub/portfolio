/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,md,njk,ejs,pug}", "_site/**/*.{html,md,njk,ejs,pug}"],
  theme: {
    fontSize: {
      'xxs': '.625rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',

      12: '0.75rem',
			14: '0.875rem',
			16: '1rem',
			18: '1.125rem',
			20: '1.25rem',
			24: '1.5rem',
			32: '2rem',
      36: '2.25rem',
      40: '2.5rem',
      44: '2.75rem',
			48: '3rem',
      56: '3.5rem',
			64: '4rem',
			72: '4.5rem',
      80: '5rem',
      88: '5.5rem',
			100: '6.25rem',
      112: '7rem',
      120: '7.5rem',
      160: '10rem',
			240: '15rem'
    },
    extend: {
      colors: {
        'main-orange': 'rgb(255 205 18)'
      },
    },
  },
  plugins: [],
}