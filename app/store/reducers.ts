import { combineReducers, Reducer, ReducersMapObject } from 'redux';
import { IRootStore } from './IRootStore';
import locationReducer from './location';

export const makeRootReducer = (asyncReducers?: ReducersMapObject): Reducer<any> => {
  return combineReducers({
    location: locationReducer,
    ...asyncReducers
  });
};

export const injectReducer = (store: IRootStore<{}>, { key, reducer }) => {
  store.asyncReducers[key] = reducer;
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
