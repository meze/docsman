// @flow
import type { TypedActionType } from '../../../types/redux';
import type { ProjectsPayloadType, ProjectPayloadType, ProjectRemovePayloadType } from '../project';
import types from './types';
import initialState from './state';

// ------------------------------------
// Action Handlers
// ------------------------------------
// ------------------------------------
// Reducer
// ------------------------------------
type StateType = typeof initialState
export default (state: StateType = initialState, action: TypedActionType<*>): StateType => {
  switch (action.type) {
    case types.INVALIDATE_PROJECTS:
      return {
        ...state,
        didInvalidate: true
      };
    case types.REQUEST_PROJECTS:
      return {
        ...state,
        isLoading: true,
        didInvalidate: false
      };
    case types.RECEIVE_PROJECTS: {
      const payload: ProjectsPayloadType = action.payload;

      return {
        ...state,
        isLoading: false,
        didInvalidate: false,
        items: payload.projects
      };
    }
    case types.RECEIVE_PROJECTS_ERROR:
      return {
        ...state,
        isLoading: false
      };
    case types.UPDATE_PROJECT_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case types.UPDATE_PROJECT_ERROR:
      return {
        ...state,
        isLoading: false
      };
    case types.UPDATE_PROJECT: {
      const payload: ProjectPayloadType = action.payload;
      const project = payload.project;
      if (!project) {
        return state;
      }

      const items = Array.from(state.items);
      const key = items.findIndex((x) => x && x.id === project.id);
      if (key >= 0) {
        items[key] = project;
      }

      return {
        ...state,
        items,
        isLoading: false,
        currentProject: state.currentProject && state.currentProject.id === project.id ? project : state.currentProject
      };
    }
    case types.NEW_PROJECT_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case types.NEW_PROJECT: {
      const payload: ProjectPayloadType = action.payload;
      const project = payload.project;

      return {
        ...state,
        isLoading: false,
        items: [
          project,
          ...state.items
        ]
      };
    }
    case types.REMOVE_PROJECT: {
      const payload: ProjectRemovePayloadType = action.payload;
      const id = payload.id;
      const itemsWithoutRemoved = state.items.filter((x) => x.id !== id);

      return {
        ...state,
        items: itemsWithoutRemoved
      };
    }
    case types.SWITCH_PROJECT_REQUEST:
      return {
        ...state,
        currentProject: initialState.currentProject
      };
    case types.SWITCH_PROJECT: {
      const payload: ProjectPayloadType = action.payload;
      const project = payload.project;

      return {
        ...state,
        currentProject: project
      };
    }
    case types.SWITCH_PROJECT_ERROR:
      return state;
    default:
      return state;
  }
};
