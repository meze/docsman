const webpack = require('webpack');
const debug = require('debug')('app:webpack:config');
const WebpackNotifierPlugin = require('webpack-notifier');
const config = require('../config');

const paths = config.utils_paths;
const __DEV__ = config.globals.__DEV__;
const __PROD__ = config.globals.__PROD__;
const __TEST__ = config.globals.__TEST__;

debug('Creating configuration.');
const webpackConfig = {
  target: 'web',
  devtool: config.compiler_devtool,
  module: {},
  resolve: {
    modules: [paths.client(), 'node_modules'],
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx', '.']
  }
};

// ------------------------------------
// Entry Points
// ------------------------------------
const APP_ENTRY = paths.client('./index.js');

webpackConfig.entry = {
  app: [APP_ENTRY],
  vendor: config.compiler_vendors
};

webpackConfig.externals = {
  fs: {}
};

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: `[name]_bundle.js`,
  path: paths.dist(),
  publicPath: config.compiler_public_path
};

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(config.globals)
];

if (__DEV__) {
  debug('Enable plugins for live development (Notifier, HMR, NoErrors).');
  webpackConfig.plugins.push(
    new WebpackNotifierPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
  debug('Enable dev server');
  webpackConfig.devServer = {
    contentBase: paths.client(),
    host: config.server_host,
    port: config.server_port,
    colors: true,
    historyApiFallback: true,
    inline: true,
    hot: true
  };
} else if (__PROD__) {
  debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).');
  webpackConfig.plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    })
  );
}

// Don't split bundles during testing, since we only want import one bundle
if (!__TEST__) {
  webpackConfig.plugins.push(
    new webpack.optimize.CommonsChunkPlugin({
      names: ['editor', 'vendor'],
      minChunks: Infinity
    })
  );
}

// ------------------------------------
// Rules
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.rules = [{
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: config.compiler_babel
}, { 
  test: /\.tsx?$/, 
  loader: 'awesome-typescript-loader' 
}, {
  test: /\.json$/,
  loader: 'json'
}];

// ------------------------------------
// Style rules
// ------------------------------------
const BASE_CSS_LOADER = 'css?sourceMap';

webpackConfig.module.rules.push({
  test: /\.less$/,
  exclude: null,
  loaders: [
    'style',
    BASE_CSS_LOADER,
    'less'
  ]
});

webpackConfig.module.rules.push({
  test: /\.css$/,
  exclude: null,
  loaders: [
    'style',
    BASE_CSS_LOADER
  ]
});

// File rules
webpackConfig.module.rules.push(
  { test: /\.woff(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/, loader: 'file?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/, loader: 'file?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.svg(\?.*)?$/, loader: 'url?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg)$/, loader: 'url?limit=8192' }
);

module.exports = webpackConfig;
