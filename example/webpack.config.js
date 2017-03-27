 /* eslint no-console: 0, global-require: 0, import/no-extraneous-dependencies: 0 */

const path = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const isDebug = !(process.argv.includes('--release') || process.argv.includes('-r'));
const isVerbose = process.argv.includes('--verbose') || process.argv.includes('-v');

const cssLoaderConfig = 'css-loader?-minimize&-import&-modules!postcss-loader!sass-loader';
/**
 * Webpack configuration
 * http://webpack.github.io/docs/configuration.html
 */
const config = {

  // The base directory
  context: path.join(__dirname, 'src'),

  // The entry point for the bundle
  entry: {
    app: ['./js/app/index.js'],
    vendor: [
      'react',
      'react-dom',
      'redux',
      'react-redux',
    ],
  },

  resolve: {
    extensions: ['', '.js', '.jsx'],
  },

  // Options affecting the output of the compilation
  output: {
    path: path.join(__dirname, 'build'),
    filename: isDebug ? 'js/[name].js' : 'js/[name].[chunkhash].js',
    publicPath: '/', // MUST HAVE TRAILING SLASH IF NOT /
    sourceMapFileName: isDebug ? 'js/[name].js' : 'js/[name].[chunkhash].js.map',
    chunkFilename: isDebug ? '' : 'js/[name].[chunkhash].js',
  },

  // Switch loaders to debug or release mode
  debug: isDebug,

  devtool: isDebug ? 'source-map' : false,

  // What information should be printed to the console
  stats: {
    colors: true,
    reasons: isDebug,
    hash: isVerbose,
    version: isVerbose,
    timings: true,
    chunks: isVerbose,
    chunkModules: isVerbose,
    cached: isVerbose,
    cachedAssets: isVerbose,
  },

  // The list of plugins for Webpack compiler
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({ name: 'vendor', minChunks: Infinity, chunks: ['vendor', 'app'] }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new HtmlWebpackPlugin({
      template: 'index.html',
      inject: false,
      minify: { collapseWhitespace: true }
    }),
    new webpack.DefinePlugin({
      API_HOST: isDebug ? '"http://localhost:1337"' : '""',
      __DEV__: isDebug,
    }),
  ],

  // Options affecting the normal modules
  module: {
    loaders: [
      {
        test: /\.json$/, loader: 'json',
      },
      {
        test: /\.jsx?$/,
        loader: `babel-loader?babelrc=false&extends=${path.join(__dirname, '/.babelrc')}`,
        exclude: /(node_modules|\/js\/vendor)/,
      },
      {
        test: /\.scss$/,
        loader:
          isDebug
          ?
            `style-loader!${cssLoaderConfig}` //Inline in development for HMR
          :
            ExtractTextPlugin.extract('style-loader', `!${cssLoaderConfig}`) //output to CSS file for production
      },
    ],
  },

  // The list of plugins for PostCSS
  // https://github.com/postcss/postcss
  postcss() {
    return [
      // cssnano takes your nicely formatted CSS and runs it through many focused optimisations
      // http://cssnano.co/
      require('cssnano')({
        autoprefixer: false,
        discardComments: { removeAll: true },
      }),
      // Add vendor prefixes to CSS rules using values from caniuse.com
      // https://github.com/postcss/autoprefixer
      require('autoprefixer')({
        remove: false,
      }),
    ];
  },
};

// Optimize the bundle in release (production) mode
if (!isDebug) {
  config.plugins.push(new ExtractTextPlugin('css/app.[hash].css'));
  config.plugins.push(new webpack.optimize.DedupePlugin());
  config.plugins.push(new webpack.optimize.UglifyJsPlugin({ compress: { warnings: isVerbose } }));
  config.plugins.push(new webpack.optimize.AggressiveMergingPlugin());
}

module.exports = config;
