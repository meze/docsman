import expect from 'expect';
import 'whatwg-fetch';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { API_ENDPOINT } from 'config/api';
import initialState from 'modules/Security/actions/state';
import types from 'modules/Security/actions/types';
import { login, logout } from 'modules/Security/actions/handlers';

describe('(Modules - Project) Handlers', () => {
  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);

  afterEach(() => {
    fetchMock.restore();
  });

  beforeEach(() => {
  });

  it('logins with a user', (done) => {
    fetchMock.post(`${API_ENDPOINT}/api/login_check`, { token: 'authtoken' });
    const store = mockStore({
      security: initialState
    });

    store.dispatch(login('test@example.com', 'pwd')).then(() => {
      const actions = store.getActions();
      expect(actions.length).toEqual(2);
      expect(actions[0].type).toEqual(types.LOGIN_REQUEST);
      expect(actions[1].type).toEqual(types.LOGIN);
      expect(actions[1].payload).toEqual(null);

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('handles error if password is incorrect', (done) => {
    fetchMock.post(`${API_ENDPOINT}/api/login_check`, 401);
    const store = mockStore({
      security: initialState
    });

    store.dispatch(login('test@example.com', 'pwd')).then(() => {
      const actions = store.getActions();
      expect(actions.length).toEqual(2);
      expect(actions[0].type).toEqual(types.LOGIN_REQUEST);
      expect(actions[1].type).toEqual(types.LOGIN_ERROR);

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('logouts', () => {
    const store = mockStore({
      security: initialState
    });

    store.dispatch(logout());

    const actions = store.getActions();
    expect(actions.length).toEqual(1);
    expect(actions[0].type).toEqual(types.LOGOUT);
  });
});
