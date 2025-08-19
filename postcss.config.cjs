const tailwindcss = require('@tailwindcss/postcss')({ config: './tailwind.config.js' });
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [tailwindcss, autoprefixer],
};