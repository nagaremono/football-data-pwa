const path = require('path');

module.exports = {
  entry: {
    app: './src/js/index.js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: [
          'file-loader',
        ],
      },
    ],
  },
  output: {
    filename: 'appbundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};
