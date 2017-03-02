import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { PureAddProjectPage } from 'modules/Project/containers/AddProjectPage';
import AddProjectForm from 'modules/Project/components/AddProjectForm';

import routerMock from '../../../routerMock';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

function createWrapper(data) {
  const store = mockStore({
    projects: {
      items: [],
      isLoading: false
    }
  });
  const props = {
    isLoading: false,
    onSave: () => {},
    onBackClick: () => {},
    actions: {
      save: (...args) => {
        data.saveArgs = args;

        return Promise.resolve({ payload: { project: { id: 1 } } });
      }
    }
  };

  return shallow(
    <PureAddProjectPage {...props} />,
    {
      context: {
        store: store,
        router: data.router
      }
    }
  );
}

describe('(Modules - Project) containers/AddProjectPage', () => {
  let _data;

  beforeEach(() => {
    _data = {
      router: routerMock(),
      saveArgs: []
    };
  });

  it('updates state', () => {
    const wrapper = createWrapper(_data);
    wrapper.instance().handleChange({ name: 'test' });

    expect(wrapper.instance().state.name).toBe('test');
  });

  it('contains form', () => {
    const wrapper = createWrapper(_data);
    const form = wrapper.find(AddProjectForm);

    expect(form.length).toBe(1);
  });

  it('saves state', (done) => {
    const wrapper = createWrapper(_data);
    wrapper.instance().handleChange({ name: 'test' });

    wrapper.instance().onSave().then((...data) => {
      expect(_data.router.lastUrl()).toBe('/projects/1/documents');

      expect(_data.saveArgs[0]).toEqual({ name: 'test' });

      done();
    }).catch((err) => {
      done(err);
    });
  });
});
