import expect from 'expect';
import 'whatwg-fetch';
import fetchMock from 'fetch-mock';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { API_ENDPOINT } from 'config/api';
import types from 'modules/Project/actions/types';
import { fetchIfNeeded, invalidate, update, save, remove, switchTo } from 'modules/Project/actions/handlers';

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
      expect(actions[1].payload.projects).toEqual([{ name: 'Test', id: 2 }]);

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('switches to project', (done) => {
    fetchMock.get(`${API_ENDPOINT}/projects/1`, { name: 'Test', id: 1 });
    const store = mockStore({
      projects: {
        items: [],
        isLoading: false,
        currentProject: { name: '', id: 0 }
      }
    });

    store.dispatch(switchTo(1)).then(() => {
      const actions = store.getActions();
      expect(actions.length).toEqual(2);
      expect(actions[0].type).toEqual(types.SWITCH_PROJECT_REQUEST);
      expect(actions[1].type).toEqual(types.SWITCH_PROJECT);
      expect(actions[1].payload.project).toEqual({ name: 'Test', id: 1 });

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('does not switch to project if it is current', (done) => {
    fetchMock.get(`${API_ENDPOINT}/projects/1`, { name: 'Test', id: 1 });
    const store = mockStore({
      projects: {
        items: [],
        isLoading: false,
        currentProject: { name: 'Test', id: 1 }
      }
    });

    store.dispatch(switchTo(1)).then(() => {
      const actions = store.getActions();
      expect(actions.length).toEqual(0);

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
      expect(actions[1].payload.projects).toEqual([{ name: 'Test', id: 2 }]);

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

  it('invalidates project list', () => {
    const store = mockStore();
    store.dispatch(invalidate());
    const actions = store.getActions();

    expect(actions.length).toEqual(1);
    expect(actions[0].type).toEqual(types.INVALIDATE_PROJECTS);
  });

  it('updates project', (done) => {
    fetchMock.put(`${API_ENDPOINT}/projects/1`, { name: 'newname', id: 1 });

    const store = mockStore();

    store.dispatch(update({ name: 'newname', id: 1 })).then(() => {
      const actions = store.getActions();
      expect(actions.length).toEqual(2);
      expect(actions[0].type).toEqual(types.UPDATE_PROJECT_REQUEST);
      expect(actions[1].type).toEqual(types.UPDATE_PROJECT);
      expect(actions[1].payload.project).toEqual({ name: 'newname', id: 1 });

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('handles error when updates project', (done) => {
    fetchMock.put(`${API_ENDPOINT}/projects/1`, { status: 500, throws: 'error' });
    const store = mockStore();

    store.dispatch(update({ name: 'newname', id: 1 })).then(() => {
      const actions = store.getActions();
      expect(actions[1].type).toBe(types.UPDATE_PROJECT_ERROR);

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('adds project', (done) => {
    fetchMock.post(`${API_ENDPOINT}/projects`, { name: 'new', id: 1 });
    const store = mockStore();

    store.dispatch(save({ name: 'new' })).then(() => {
      const actions = store.getActions();
      expect(actions.length).toEqual(2);
      expect(actions[0].type).toEqual(types.NEW_PROJECT_REQUEST);
      expect(actions[1].type).toEqual(types.NEW_PROJECT);
      expect(actions[1].payload.project).toEqual({ name: 'new', id: 1 });

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('handles error when adds project', (done) => {
    fetchMock.post(`${API_ENDPOINT}/projects`, { status: 500, throws: 'error' });
    const store = mockStore();

    store.dispatch(save({ name: 'new' })).then(() => {
      const actions = store.getActions();
      expect(actions[1].type).toBe(types.NEW_PROJECT_ERROR);

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('deletes project', (done) => {
    fetchMock.delete(`${API_ENDPOINT}/projects/1`, '1');

    const store = mockStore({
      projects: {
        items: [
          { id: 1, name: 'deleteme' }
        ],
        isLoading: false,
        didInvalidate: true
      }
    });

    store.dispatch(remove(1)).then(() => {
      const actions = store.getActions();
      expect(actions.length).toBe(2);
      expect(actions[0].type).toBe(types.REMOVE_PROJECT_REQUEST);
      expect(actions[1].type).toBe(types.REMOVE_PROJECT);
      expect(actions[1].payload.id).toBe(1);

      return done();
    }).catch((err) => {
      return done(err);
    });
  });

  it('handles error when removes project', (done) => {
    fetchMock.delete(`${API_ENDPOINT}/projects/1`, { status: 500, throws: 'error' });
    const store = mockStore();

    store.dispatch(remove(1)).catch(() => {
      const actions = store.getActions();
      expect(actions[1].type).toBe(types.REMOVE_PROJECT_ERROR);

      return done();
    }).catch((err) => {
      return done(err);
    });
  });
});
