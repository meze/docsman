// @flow
import api from '../../../middleware/api';
import type { ActionType, AsyncActionType } from '../../../types/redux';
import types from './types';

// ------------------------------------
// Actions
// ------------------------------------
export const loginError = (): ActionType => ({
  type: types.LOGIN_ERROR,
  payload: null
});

export const loginRequest = (): ActionType => ({
  type: types.LOGIN_REQUEST,
  payload: null
});

export const logout = (): ActionType => {
  localStorage.removeItem('token');

  return {
    type: types.LOGOUT,
    payload: null
  }
};

export const loggedIn = (): ActionType => ({
  type: types.LOGIN,
  payload: null
});

export const login = (email: string, password: string): AsyncActionType => (dispatch, getState): ?Promise<Object> => {
  dispatch(loginRequest());

  return api.security.login(email, password)
    .then((data) => {
      localStorage.setItem('token', data.token);

      return dispatch(loggedIn());
    })
    .catch(() => dispatch({
      type: types.LOGIN_ERROR,
      payload: null
    }));
};
