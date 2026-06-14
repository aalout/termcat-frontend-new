// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

module.exports = {
  plugins: {
    'postcss-mixins': {
      mixinsDir: path.join(__dirname, 'src/shared/styles/mixins'),
    },
    autoprefixer: {},
  },
};

