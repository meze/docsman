import { browserHistory } from 'react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import * as createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import DevTools from '../containers/DevTools';
import { IRootStore } from './IRootStore';
import { updateLocation } from './location';
import { makeRootReducer } from './reducers';

export default (initialState = {}) => {
  const middleware = [thunk, createLogger()];

  const enhancer = compose(
      applyMiddleware(...middleware),
      DevTools.instrument()
  );

  const store = createStore(
    makeRootReducer(),
    initialState,
    enhancer
  ) as IRootStore<{}>;
  store.asyncReducers = {};
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store));

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default;
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  return store;
};
