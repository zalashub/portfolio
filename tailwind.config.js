/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,md,njk,ejs,pug}"],
  theme: {
    fontSize: {
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
			48: '3rem',
      56: '3.5rem',
			64: '4rem',
			72: '4.5rem',
			100: '6.25rem',
			240: '15rem'
    },
    extend: {},
  },
  plugins: [],
}