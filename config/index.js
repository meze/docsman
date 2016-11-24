/* eslint key-spacing:0 spaced-comment:0 */
const path = require('path'); // eslint-disable-line import/no-nodejs-modules
const debug = require('debug')('app:config');
const argv = require('yargs').argv;

debug('Creating default configuration.');
// ========================================================
// Default Configuration
// ========================================================
const config = {
  env: process.env.NODE_ENV || 'development',

  // ----------------------------------
  // Project Structure
  // ----------------------------------
  path_base: path.resolve(__dirname, '..'),
  dir_client: 'app',
  dir_dist: 'dist',
  dir_test: 'tests',

  // ----------------------------------
  // Server Configuration
  // ----------------------------------
  server_host: '127.0.0.1',
  server_port: process.env.PORT || 9000,

  // ----------------------------------
  // Compiler Configuration
  // ----------------------------------
  compiler_babel : {
    cacheDirectory : true,
    plugins        : ['transform-runtime', 'transform-es2015-modules-commonjs'],
    presets        : ['es2015', 'react', 'stage-1']
  },
  compiler_devtool         : 'source-map',
  compiler_hash_type       : 'hash',
  compiler_fail_on_warning : false,
  compiler_quiet           : false,
  compiler_public_path     : '/',
  compiler_stats           : {
    chunks : false,
    chunkModules : false,
    colors : true
  },
  compiler_vendors : [
    'react',
    'react-redux',
    'react-router',
    'redux',
    'moment',
    'notie',
    'react-dom',
    'redux-thunk',
    'whatwg-fetch'
  ],

  // ----------------------------------
  // Test Configuration
  // ----------------------------------
  coverage_reporters: [
    { type: 'text-summary' },
    { type: 'lcov', dir: 'coverage' }
  ]
};

// ------------------------------------
// Environment
// ------------------------------------
// N.B.: globals added here must _also_ be added to .eslintrc
config.globals = {
  'process.env': {
    NODE_ENV: JSON.stringify(config.env)
  },
  NODE_ENV: config.env,
  __DEV__: config.env === 'development',
  __PROD__: config.env === 'production',
  __TEST__: config.env === 'test',
  __COVERAGE__: !argv.watch && config.env === 'test',
  __BASENAME__: JSON.stringify(process.env.BASENAME || '')
};

// ------------------------------------
// Utilities
// ------------------------------------
function base() {
  const args = [config.path_base].concat([].slice.call(arguments)); // eslint-disable-line prefer-rest-params

  return path.resolve.apply(path, args);
}

config.utils_paths = {
  base: base,
  client: base.bind(null, config.dir_client),
  dist: base.bind(null, config.dir_dist)
};

// ========================================================
// Environment Configuration
// ========================================================
debug(`Looking for environment overrides for NODE_ENV "${config.env}".`);
const environments = require('./environments');

const overrides = environments[config.env];
if (overrides) {
  debug('Found overrides, applying to default configuration.');
  Object.assign(config, overrides(config));
} else {
  debug('No environment overrides found, defaults will be used.');
}

module.exports = config;
