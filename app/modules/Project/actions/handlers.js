// @flow
import api from '../../../middleware/api';
import { success } from '../../../utils/notification';
import type { TypedActionType, AsyncActionType, StateType, ActionType } from '../../../types/redux';
import type { ProjectType, ProjectsPayloadType, ProjectRemovePayloadType, ProjectPayloadType } from '../project';
import types from './types';

export const request = (): ActionType => ({
  type: types.REQUEST_PROJECTS,
  payload: null
});

export const invalidate = (): ActionType => ({
  type: types.INVALIDATE_PROJECTS,
  payload: null
});

export const receive = (projects: ProjectType[]): TypedActionType<ProjectsPayloadType> => ({
  type: types.RECEIVE_PROJECTS,
  payload: {
    projects
  }
});

const doFetch = (): AsyncActionType => (dispatch, getState): Promise<?ProjectType[]> => {
  dispatch(request());

  return api.projects.get()
    .then((data) => dispatch(receive(data)))
    .catch(() => {
      dispatch({
        type: types.RECEIVE_PROJECTS_ERROR,
        payload: null
      });
    });
};

const shouldFetch = ({ projects }: StateType): boolean => {
  if (projects.isLoading) {
    return false;
  }

  if (!projects || projects.items.length === 0) {
    return true;
  }

  return projects.didInvalidate;
};

export const fetchIfNeeded = (): AsyncActionType => (dispatch, getState): ?Promise<?ProjectType[]> => {
  if (shouldFetch(getState())) {
    return dispatch(doFetch());
  }

  return Promise.resolve();
};

// single

const shouldSwitch = (newProjectId: number, { projects }: StateType): boolean => !(projects.currentProject && projects.currentProject.id === newProjectId);

export const switchReceive = (project: ProjectType): TypedActionType<ProjectPayloadType> => ({
  type: types.SWITCH_PROJECT,
  payload: {
    project
  }
});

export const switchTo = (projectId: number): AsyncActionType => (dispatch, getState): Promise<?ProjectType> => {
  if (!shouldSwitch(projectId, getState())) {
    return Promise.resolve();
  }

  dispatch({
    type: types.SWITCH_PROJECT_REQUEST,
    payload: null
  });

  return api.projects.getOne(projectId)
    .then((data) => dispatch(switchReceive(data)))
    .catch(() => {
      dispatch({
        type: types.SWITCH_PROJECT_ERROR,
        payload: null
      });
    });
};

//
// Updaters
//

export const receiveNew = (project: ProjectType): TypedActionType<ProjectPayloadType> => {
  success('A project was created.');

  return {
    type: types.NEW_PROJECT,
    payload: {
      project
    }
  };
};

export const save = (project: ProjectType): AsyncActionType => (dispatch, getState): Promise<?ProjectType> => {
  dispatch({
    type: types.NEW_PROJECT_REQUEST,
    payload: null
  });

  return api.projects.save(project)
    .then((data) => dispatch(receiveNew(data)))
    .catch(() => dispatch({
      type: types.NEW_PROJECT_ERROR,
      payload: null
    }));
};

export const receiveUpdated = (project: ProjectType): TypedActionType<ProjectPayloadType> => {
  success('A project name was changed.');

  return {
    type: types.UPDATE_PROJECT,
    // todo check id?
    payload: {
      project
    }
  };
};

export const update = (project: ProjectType): AsyncActionType => (dispatch): Promise<?ProjectType> => {
  dispatch({
    type: types.UPDATE_PROJECT_REQUEST,
    payload: null
  });

  return api.projects.update(project.id, project)
    .then((data) => dispatch(receiveUpdated(data)))
    .catch(() => dispatch({
      type: types.UPDATE_PROJECT_ERROR,
      payload: null
    }));
};

const receiveRemovedError = (err: Error): AsyncActionType => (dispatch, getState): void => {
  dispatch({
    type: types.REMOVE_PROJECT_ERROR,
    payload: null
  });

  throw err;
};

export const receiveRemoved = (id: number): TypedActionType<ProjectRemovePayloadType> => {
  success('A project was removed.');

  return {
    type: types.REMOVE_PROJECT,
    payload: {
      id
    }
  };
};

export const remove = (id: number): AsyncActionType => (dispatch): Promise<?ProjectType> => {
  dispatch({
    type: types.REMOVE_PROJECT_REQUEST,
    payload: null
  });

  return api.projects.remove(id)
    .then((data) => dispatch(receiveRemoved(data)))
    .catch((err) => dispatch(receiveRemovedError(err)));
};
