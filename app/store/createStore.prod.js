// @flow
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import { makeRootReducer } from './reducers';
import { updateLocation } from './location';

export default (initialState: Object = {}) => {
  const middleware = [thunk];

  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware)
    )
  );
  store.asyncReducers = {};
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store));

  return store;
};
