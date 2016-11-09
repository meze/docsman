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
    .then((data) => dispatch(receiveNew(data)));
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
