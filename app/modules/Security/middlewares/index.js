// @flow
import { logout } from '../actions/handlers';

import type { ActionType } from '../../../types/redux';

export default (store: Object) => (next: Function) => (action: ActionType) => {
  if (action.error && action.error.status === 401) {
    next(action);
    store.dispatch(logout());
  } else {
    next(action);
  }
};
