// @flow
import type { TypedActionType } from '../../../types/redux';
import initialState from './state';
import types from './types';

// ------------------------------------
// Action Handlers
// ------------------------------------
// ------------------------------------
// Reducer
// ------------------------------------
type StateType = typeof initialState
export default (state: StateType = initialState, action: TypedActionType<*>): StateType => {
  switch (action.type) {
    case types.LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false
      };
    case types.LOGIN_REQUEST:
      return {
        ...state,
        isLoading: true,
        isError: false
      };
    case types.LOGIN:
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false
      };
    case types.LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        isLoading: false,
        isError: true
      };
    default:
      return state;
  }
};
