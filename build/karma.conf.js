const argv = require('yargs').argv;
const debug = require('debug')('app:karma');
const config = require('../config');
const webpackConfig = require('./webpack.config');

debug('Creating configuration.');
const karmaConfig = {
  basePath: '../',
  files: [
    {
      pattern: `./${config.dir_test}/test-bundler.js`,
      watched: false,
      served: true,
      included: true
    }
  ],
  singleRun: !argv.watch,
  frameworks: ['mocha'],
  reporters: ['dots'],
  preprocessors: {
    [`${config.dir_test}/test-bundler.js`]: ['webpack']
  },
  browsers: ['PhantomJS'],
  webpack: {
    devtool: 'cheap-module-source-map',
    resolve: Object.assign({}, webpackConfig.resolve, {
      alias: Object.assign({}, (webpackConfig.resolve ? webpackConfig.resolve.alias : {}))
    }),
    plugins: webpackConfig.plugins,
    module: {
      rules: webpackConfig.module.rules
    },
    // Enzyme fix, see:
    // https://github.com/airbnb/enzyme/issues/47
    externals: Object.assign({}, webpackConfig.externals, {
      'react/addons': true,
      'react/lib/ExecutionEnvironment': true,
      'react/lib/ReactContext': 'window'
    })
  },
  webpackMiddleware: {
    noInfo: true
  },
  coverageReporter: {
    reporters: config.coverage_reporters
  }
};

if (config.globals.__COVERAGE__) {
  karmaConfig.reporters.push('coverage');
  karmaConfig.webpack.module.rules.push({
    enforce: 'pre',
    test: /\.(js|jsx)$/,
    include: new RegExp(config.dir_client),
    loader: 'babel',
    query: Object.assign({}, config.compiler_babel, {
      plugins: (config.compiler_babel.plugins || []).concat('istanbul')
    })
  });
}

module.exports = (cfg) => cfg.set(karmaConfig);
