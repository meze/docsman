import expect from 'expect';
import { createStore } from 'redux';
import reducer from 'modules/Project/actions/reducer';
import { receive, invalidate, receiveUpdated, request, receiveNew } from 'modules/Project/actions/handlers';

describe('(Modules - Project) Reducers', () => {
  let store = null;

  beforeEach(() => {
    store = createStore(reducer);
  });

  afterEach(() => {
    store = null;
  });

  it('creates a new project', () => {
    store.dispatch(receiveNew({ id: 1, title: 'name' }));

    const actual = store.getState().items[0];
    const expected = { id: 1, title: 'name' };

    expect(actual).toEqual(expected);
    expect(store.getState().isLoading).toBe(false);
  });

  it('invalidates projects', () => {
    store.dispatch(invalidate());

    expect(store.getState().didInvalidate).toBe(true);
  });

  it('requests projects', () => {
    store.dispatch(request());

    expect(store.getState().didInvalidate).toBe(false);
  });

  it('receives projects', () => {
    store.dispatch(receive([{ id: 1, title: 'name' }]));

    const actual = store.getState().items;
    const expected = [{ id: 1, title: 'name' }];

    expect(actual).toEqual(expected);
    expect(store.getState().isLoading).toBe(false);
    expect(store.getState().didInvalidate).toBe(false);
  });

  it('updates projects', () => {
    store = createStore(reducer, {
      items: [{ id: 2, title: 'change' }, { id: 1, title: 'dontchange' }]
    });
    store.dispatch(receiveUpdated({ id: 2, title: 'newname' }));

    const actual = store.getState().items;
    const expected = [{ id: 2, title: 'newname' }, { id: 1, title: 'dontchange' }];

    expect(actual).toEqual(expected);
    expect(store.getState().isLoading).toBe(false);
  });
});
