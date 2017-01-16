import { browserHistory } from 'react-router';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { IRootStore } from './IRootStore';
import { updateLocation } from './location';
import { makeRootReducer } from './reducers';

export default (initialState = {}) => {
  const middleware = [thunk];

  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware)
    )
  ) as IRootStore<{}>;
  store.asyncReducers = {};
  store.unsubscribeHistory = browserHistory.listen(updateLocation(store));

  return store;
};
