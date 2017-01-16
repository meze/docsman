import { ReducersMapObject, Store } from 'redux';

export interface IRootStore<S> extends Store<S> {
  asyncReducers: ReducersMapObject;
  unsubscribeHistory: any;
}
