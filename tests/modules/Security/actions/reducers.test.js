import expect from 'expect';
import { createStore } from 'redux';
import reducer from 'modules/Security/actions/reducer';
import { loggedIn, loginError, logout, loginRequest } from 'modules/Security/actions/handlers';

describe('(Modules - Security) Reducers', () => {
  let store = null;

  beforeEach(() => {
    store = createStore(reducer);
  });

  afterEach(() => {
    store = null;
  });

  it('logins', () => {
    store.dispatch(loggedIn());

    const actual = store.getState();
    const expected = { isLoading: false, isAuthenticated: true, isError: false };

    expect(actual).toEqual(expected);
  });

  it('logouts', () => {
    store.dispatch(logout());

    const actual = store.getState();
    const expected = { isLoading: false, isAuthenticated: false, isError: false };

    expect(actual).toEqual(expected);
  });

  it('requests login', () => {
    store.dispatch(loginRequest());

    const actual = store.getState();
    const expected = { isLoading: true, isAuthenticated: false, isError: false };

    expect(actual).toEqual(expected);
  });

  it('handlers error', () => {
    store.dispatch(loginError());

    const actual = store.getState();
    const expected = { isLoading: false, isAuthenticated: false, isError: true };

    expect(actual).toEqual(expected);
  });
});
