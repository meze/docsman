// @flow
import type { ProjectType } from '../project';
import types from './types';
import initialState from './state';

// ------------------------------------
// Action Handlers
// ------------------------------------
// ------------------------------------
// Reducer
// ------------------------------------

type ActionType = {
  type: string,
  projects?: ProjectType[],
  id?: number,
  project?: ProjectType
}

export default (state: typeof initialState = initialState, action: ActionType) => {
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
    case types.RECEIVE_PROJECTS:
      return {
        ...state,
        isLoading: false,
        didInvalidate: false,
        items: action.projects
      };
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
    case types.UPDATE_PROJECT:
      const project = action.project;
      if (!project) {
        return state;
      }

      const items = Array.from(state.items);
      const key = items.findIndex((x) => x && x.id === action.id);
      if (key >= 0) {
        items[key] = project;
      }

      return {
        ...state,
        items,
        isLoading: false,
        currentProject: state.currentProject && state.currentProject.id === project.id ? project : state.currentProject
      };
    case types.NEW_PROJECT_REQUEST:
      return {
        ...state,
        isLoading: true
      };
    case types.NEW_PROJECT:
      return {
        ...state,
        isLoading: false,
        items: [
          action.project,
          ...state.items
        ]
      };
    case types.REMOVE_PROJECT:
      const itemsWithoutRemoved = state.items.filter((x) => x.id !== action.id);

      return {
        ...state,
        items: itemsWithoutRemoved
      };
    case types.SWITCH_PROJECT_REQUEST:
      return {
        ...state,
        currentProject: initialState.currentProject
      };
    case types.SWITCH_PROJECT:
      return {
        ...state,
        currentProject: action.project
      };
    case types.SWITCH_PROJECT_ERROR:
      return {
        ...state
      };
    default:
      return state;
  }
};
