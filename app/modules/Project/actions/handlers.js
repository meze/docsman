import api from '../../../middleware/api';
import { success } from '../../../utils/notification';
import types from './types';

export const request = () => ({
  type: types.REQUEST_PROJECTS
});

export const invalidate = () => ({
  type: types.INVALIDATE_PROJECTS
});

export const receive = (data) => ({
  type: types.RECEIVE_PROJECTS,
  projects: data
});

const doFetch = () => (dispatch) => {
  dispatch(request());

  return api.projects.get()
    .then((data) => dispatch(receive(data)))
    .catch(() => {
      dispatch({
        type: types.RECEIVE_PROJECTS_ERROR
      });
    });
};

const shouldFetch = (state) => {
  const projects = state.projects;

  if (projects.isLoading) {
    return false;
  }

  if (!projects || projects.items.length === 0) {
    return true;
  }

  return projects.didInvalidate;
};

export const fetchIfNeeded = () => (dispatch, getState) => {
  if (shouldFetch(getState())) {
    return dispatch(doFetch());
  }

  return Promise.resolve();
};

// single

const shouldSwitch = (newProjectId, state) => {
  const projects = state.projects;

  if (projects.currentProject && projects.currentProject.id === newProjectId) {
    return false;
  }

  return true;
};

export const switchReceive = (data) => ({
  type: types.SWITCH_PROJECT,
  project: data
});

export const switchTo = (projectId) => (dispatch, getState) => {
  if (!shouldSwitch(projectId, getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: types.SWITCH_PROJECT_REQUEST
  });

  return api.projects.getOne(projectId)
    .then((data) => dispatch(switchReceive(data)))
    .catch(() => {
      dispatch({
        type: types.SWITCH_PROJECT_ERROR
      });
    });
};

//
// Updaters
//

export const receiveNew = (project) => {
  success('A project was created.');

  return {
    type: types.NEW_PROJECT,
    project: project
  };
};

export const save = (project) => (dispatch) => {
  dispatch({
    type: types.NEW_PROJECT_REQUEST
  });

  return api.projects.save(project)
    .then((data) => dispatch(receiveNew(data)))
    .catch(() => dispatch({
      type: types.NEW_PROJECT_ERROR
    }));
};

export const receiveUpdated = (project) => {
  success('A project name was changed.');

  return {
    type: types.UPDATE_PROJECT,
    projectId: project.id,
    project: project
  };
};

export const update = (project) => (dispatch) => {
  dispatch({
    type: types.UPDATE_PROJECT_REQUEST
  });

  return api.projects.update(project.id, project)
    .then((data) => dispatch(receiveUpdated(data)))
    .catch(() => dispatch({
      type: types.UPDATE_PROJECT_ERROR
    }));
};

const receiveRemovedError = (err) => (dispatch) => {
  dispatch({
    type: types.REMOVE_PROJECT_ERROR
  });

  throw err;
};

export const receiveRemoved = (id) => {
  success('A project was removed.');

  return {
    type: types.REMOVE_PROJECT,
    id: id
  };
};

export const remove = (id) => (dispatch) => {
  dispatch({
    type: types.REMOVE_PROJECT_REQUEST
  });

  return api.projects.remove(id)
    .then((data) => dispatch(receiveRemoved(data)))
    .catch((err) => dispatch(receiveRemovedError(err)));
};
