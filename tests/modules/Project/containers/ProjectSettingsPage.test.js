import expect from 'expect';
import React from 'react';
import { shallow } from 'enzyme';
import thunk from 'redux-thunk';
import configureMockStore from 'redux-mock-store';
import { PureProjectSettingsPage } from 'modules/Project/containers/ProjectSettingsPage';
import DeleteProjectForm from 'modules/Project/components/DeleteProjectForm';
import ProjectSettingsForm from 'modules/Project/components/ProjectSettingsForm';
import routerMock from '../../../routerMock';

const middleware = [thunk];
const mockStore = configureMockStore(middleware);

function createWrapper(data) {
  const store = mockStore({
    projects: {
      items: {
        id: 1,
        name: 'oldname'
      }
    }
  });

  const props = {
    isLoading: false,
    onSave: () => {},
    onBackClick: () => {},
    actions: {
      update: (...args) => {
        data.saveArgs = args;

        return Promise.resolve();
      },
      remove: (...args) => {
        data.removeArgs = args;

        return Promise.resolve();
      },
      switchTo: (...args) => {
        data.switchToArgs = args;

        return Promise.resolve();
      }
    },
    project: {
      id: 1,
      name: 'oldname'
    },
    projectId: 1
  };

  return shallow(
    <PureProjectSettingsPage {...props} />,
    {
      context: {
        store: store,
        router: data.router
      }
    }
  );
}

describe('(Modules - Project) containers/ProjectSettingsPage', () => {
  let _data;

  beforeEach(() => {
    _data = {
      router: routerMock(),
      saveArgs: [],
      removeArgs: []
    };
  });

  it('updates state when props received', () => {
    const wrapper = createWrapper(_data);
    wrapper.instance().componentWillReceiveProps({ project: { name: 'newname' } });

    expect(wrapper.instance().state.settings.name).toBe('newname');
  });

  it('updates state when changed', () => {
    const wrapper = createWrapper(_data);
    wrapper.instance().onChange({ name: 'newname' });

    expect(wrapper.instance().state.settings.name).toBe('newname');
  });

  it('contains renaming form and deletion form', () => {
    const wrapper = createWrapper(_data);
    const settingsForm = wrapper.find(ProjectSettingsForm);
    const deletionForm = wrapper.find(DeleteProjectForm);

    expect(settingsForm.length).toBe(1);
    expect(deletionForm.length).toBe(1);
  });

  it('saves changes', (done) => {
    const wrapper = createWrapper(_data);
    wrapper.instance().onChange({ name: 'newname' });

    wrapper.instance().onSave().then((...data) => {
      expect(_data.saveArgs[0]).toEqual({ id: 1, name: 'newname' });

      done();
    }).catch((err) => {
      done(err);
    });
  });

  it('deletes project', (done) => {
    const wrapper = createWrapper(_data);
    wrapper.instance().onRemove().then((...data) => {
      expect(_data.removeArgs[0]).toEqual(1);
      expect(_data.router.lastUrl()).toBe('/');

      done();
    }).catch((err) => {
      done(err);
    });
  });

  it('goes back', () => {
    const wrapper = createWrapper(_data);

    wrapper.instance().onBackClick();
    expect(_data.router.lastUrl()).toBe('/projects/1/documents');
  });
});
