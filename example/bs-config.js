
/*
 |--------------------------------------------------------------------------
 | Browser-sync config file
 |--------------------------------------------------------------------------
 |
 | For up-to-date information about the options:
 |   http://www.browsersync.io/docs/options/
 |
 | There are more options than you see here, these are just the ones that are
 | set internally. See the website for more info.
 |
 |
 */
/* eslint-disable import/no-extraneous-dependencies */

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const historyApiFallback = require('connect-history-api-fallback');
const config = require('./webpack.config');

// Hot Module Replacement (HMR) + webpack hot dev server
if (config.debug) {
  config.entry.app.unshift('webpack/hot/dev-server', 'webpack-hot-middleware/client');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  config.plugins.push(new webpack.NoErrorsPlugin());
}

const bundler = webpack(config);

module.exports = {
  ui: {
    port: 3001,
    weinre: {
      port: 8080
    }
  },
  files: false,
  watchOptions: {},
  server: {
    baseDir: 'src',
    directory: true,
  },
  proxy: false,
  port: 3000,
  middleware: [
    historyApiFallback(),
    webpackDevMiddleware(bundler, {
      // IMPORTANT: dev middleware can't access config, so we should
      // provide publicPath by ourselves
      publicPath: config.output.publicPath,

      // pretty colored output
      stats: config.stats,

      // for other settings see
      // http://webpack.github.io/docs/webpack-dev-middleware.html
    }),

    // bundler should be the same as above
    webpackHotMiddleware(bundler),
  ],
  serveStatic: [],
  ghostMode: {
    clicks: true,
    scroll: true,
    forms: {
      submit: true,
      inputs: true,
      toggles: true
    }
  },
  logLevel: 'info',
  logPrefix: 'BS',
  logConnections: false,
  logFileChanges: true,
  logSnippet: true,
  rewriteRules: false,
  open: 'local',
  browser: 'default',
  xip: false,
  hostnameSuffix: false,
  reloadOnRestart: false,
  notify: true,
  scrollProportionally: true,
  scrollThrottle: 0,
  scrollRestoreTechnique: 'window.name',
  scrollElements: [],
  scrollElementMapping: [],
  reloadDelay: 0,
  reloadDebounce: 0,
  plugins: [],
  injectChanges: true,
  startPath: null,
  minify: true,
  host: null,
  codeSync: true,
  timestamps: true,
  clientEvents: [
    'scroll',
    'scroll:element',
    'input:text',
    'input:toggles',
    'form:submit',
    'form:reset',
    'click'
  ],
  socket: {
    socketIoOptions: {
      log: false
    },
    socketIoClientConfig: {
      reconnectionAttempts: 50
    },
    path: '/browser-sync/socket.io',
    clientPath: '/browser-sync',
    namespace: '/browser-sync',
    clients: {
      heartbeatTimeout: 5000
    }
  },
  tagNames: {
    less: 'link',
    scss: 'link',
    css: 'link',
    jpg: 'img',
    jpeg: 'img',
    png: 'img',
    svg: 'img',
    gif: 'img',
    js: 'script'
  }
};
