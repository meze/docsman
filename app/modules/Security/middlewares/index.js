// @flow
import { logout } from '../actions/handlers';

import type { ActionType } from '../../../types/redux';

export default (store: Object) => (next: Function) => (action: ActionType) => {
  const result = next(action);
  if (action.error && action.error.status === 401) {
    store.dispatch(logout());
  }

  return result;
};
