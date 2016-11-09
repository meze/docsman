import types from './types';

// ------------------------------------
// Action Handlers
// ------------------------------------
// ------------------------------------
// Reducer
// ------------------------------------
const initialState = {
  isLoading: false,
  didInvalidate: true,
  items: []
};

export default (state = initialState, action) => {
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
      const items = Array.from(state.items);
      const key = items.findIndex((x) => x.id === action.projectId);
      if (key >= 0) {
        items[key] = action.project;
      }

      return {
        ...state,
        items,
        isLoading: false
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
    default:
      return state;
  }
};
