declare var process: any;
declare var require: any;
declare var module: any;

// tslint:disable
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./AppContainer.prod');
} else {
  module.exports = require('./AppContainer.dev');
}
// tslint:enable
