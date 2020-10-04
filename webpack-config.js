const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'index.html', to: 'dist/index.html' },
        { from: 'data/', to: 'dist/data/' },
      ],
    }),
  ],
};
