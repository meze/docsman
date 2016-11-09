import expect from 'expect';
import 'whatwg-fetch';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { API_ENDPOINT } from 'config/api';
import types from 'modules/Project/actions/types';
import { fetchIfNeeded, invalidate, update, save } from 'modules/Project/actions/handlers';

describe('(Modules - Project) Handlers', () => {
  const middleware = [thunk];
  const mockStore = configureMockStore(middleware);

  afterEach(() => {
    fetchMock.restore();
  });

  beforeEach(() => {
    fetchMock.get(`${API_ENDPOINT}/projects`, [{ name: 'Test', id: 2 }]);
  });

  it('gets projects if not loaded', (done) => {
    const store = mockStore({
      projects: {
        items: [],
        isLoading: false
      }
    });

    store.dispatch(fetchIfNeeded()).then(() => {
      const actions = store.getActions();
      expect(actions.length).toEqual(2);
      expect(actions[0].type).toEqual(types.REQUEST_PROJECTS);
      expect(actions[1].type).toEqual(types.RECEIVE_PROJECTS);
      expect(actions[1].projects).toEqual([{ name: 'Test', id: 2 }]);

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('gets projects if invalidated loaded', (done) => {
    const store = mockStore({
      projects: {
        items: [{ name: 'test', id: 1 }],
        isLoading: false,
        didInvalidate: true
      }
    });

    store.dispatch(fetchIfNeeded()).then(() => {
      const actions = store.getActions();
      expect(actions.length).toEqual(2);
      expect(actions[0].type).toEqual(types.REQUEST_PROJECTS);
      expect(actions[1].type).toEqual(types.RECEIVE_PROJECTS);
      expect(actions[1].projects).toEqual([{ name: 'Test', id: 2 }]);

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('does not get projects if another request is in progress', (done) => {
    const store = mockStore({
      projects: {
        items: [],
        isLoading: true
      }
    });

    store.dispatch(fetchIfNeeded()).then(() => {
      const actions = store.getActions();
      expect(actions.length).toEqual(0);

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('does not get projects if already loaded', (done) => {
    const store = mockStore({
      projects: {
        items: [{ name: 'test', id: 1 }],
        isLoading: false
      }
    });

    store.dispatch(fetchIfNeeded()).then(() => {
      const actions = store.getActions();
      expect(actions.length).toEqual(0);

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('projects can be invalidated', () => {
    const store = mockStore({
      projects: {
        items: [{ name: 'test', id: 1 }],
        isLoading: false
      }
    });
    store.dispatch(invalidate());
    const actions = store.getActions();

    expect(actions.length).toEqual(1);
    expect(actions[0].type).toEqual(types.INVALIDATE_PROJECTS);
  });

  it('project can be updated', (done) => {
    fetchMock.put(`${API_ENDPOINT}/projects/1`, { name: 'newname', id: 1 });

    const store = mockStore({
      projects: {
        items: [{ name: 'test', id: 1 }],
        isLoading: false,
        didInvalidate: true
      }
    });

    store.dispatch(update({ name: 'newname', id: 1 })).then(() => {
      const actions = store.getActions();
      expect(actions.length).toEqual(2);
      expect(actions[0].type).toEqual(types.UPDATE_PROJECT_REQUEST);
      expect(actions[1].type).toEqual(types.UPDATE_PROJECT);
      expect(actions[1].project).toEqual({ name: 'newname', id: 1 });
      expect(actions[1].projectId).toEqual(1);

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('project can be added', (done) => {
    fetchMock.post(`${API_ENDPOINT}/projects`, { name: 'new', id: 1 });

    const store = mockStore({
      projects: {
        items: [],
        isLoading: false,
        didInvalidate: true
      }
    });

    store.dispatch(save({ name: 'new' })).then(() => {
      const actions = store.getActions();
      expect(actions.length).toEqual(2);
      expect(actions[0].type).toEqual(types.NEW_PROJECT_REQUEST);
      expect(actions[1].type).toEqual(types.NEW_PROJECT);
      expect(actions[1].project).toEqual({ name: 'new', id: 1 });

      return done();
    }).catch((err) => {
      return done(err);
    });
  });
});
