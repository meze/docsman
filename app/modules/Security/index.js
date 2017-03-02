// @flow
import { injectReducer } from '../../store/reducers';
import reducer from './actions/reducer';

export default (store: Object) => {
  injectReducer(store, { key: 'security', reducer });

  return [];
};
