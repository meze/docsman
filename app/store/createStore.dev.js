// @flow
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import createLogger from 'redux-logger';
import { browserHistory } from 'react-router';
import DevTools from '../containers/DevTools';
import authenticationCheck from '../modules/Security/middlewares';
import { makeRootReducer } from './reducers';
import { updateLocation } from './location';

export default (initialState: Object = {}) => {
  const middleware = [thunk, authenticationCheck, createLogger()];
  const enhancers = [DevTools.instrument()];

  const store = createStore(
    makeRootReducer(null),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );
  store.asyncReducers = {};
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store));

  if (module.hot) {
    (module.hot: any).accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  return store;
};
