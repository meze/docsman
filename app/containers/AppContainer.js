// @flow
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./AppContainer.prod').default;
} else {
  module.exports = require('./AppContainer.dev').default;
}
