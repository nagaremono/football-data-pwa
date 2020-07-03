const path = require('path');

module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: {
    app: './src/js/service-worker.js',
  },
  module: {
    rules: [
    ],
  },
  output: {
    filename: 'service-worker.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
