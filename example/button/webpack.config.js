const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Sass = require('sass');
const path = require('path');

module.exports = {
  entry: {
    bundle: './button.js'
  },
  mode: 'production',
  target: 'web',
  output: {
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
      },
      {
        test: /\.scss$/,
        use: [
          'css-loader',
          'postcss-loader',
          {
            loader: 'sass-loader',
            options: {
              implementation: Sass
            },
          },
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin(),
  ]
};
