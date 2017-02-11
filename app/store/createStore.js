// @flow
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./createStore.prod').default;
} else {
  module.exports = require('./createStore.dev').default;
}
