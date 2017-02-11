// @flow
import { combineReducers } from 'redux';
import locationReducer from './location';

export const makeRootReducer = (asyncReducers: ?Object) => {
  return combineReducers({
    location: locationReducer,
    ...asyncReducers
  });
};

export const injectReducer = (store: Object, { key, reducer }: { key: string, reducer: Object }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
