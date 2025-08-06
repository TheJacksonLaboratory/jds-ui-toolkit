const { createGlobPatternsForDependencies } = require('@nx/angular/tailwind');
const { join } = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './apps/**/*.{html,ts}',
    './libs/**/*.{html,ts}',
  ],
  prefix: 'tw-',
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-primeui')],
};
