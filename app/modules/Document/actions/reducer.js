// @flow
import type { DocumentType } from '../document';
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
  items?: DocumentType[],
  projectId?: number,
  documentId?: number,
  document?: DocumentType
}

export default (state: typeof initialState = initialState, action: ActionType) => {
  switch (action.type) {
    case types.INVALIDATE_DOCUMENTS:
      return {
        ...state,
        lastItemId: 0,
        didInvalidate: true
      };
    case types.REQUEST_DOCUMENTS:
      return {
        ...state,
        isLoading: true,
        didInvalidate: false
      };
    case types.RECEIVE_DOCUMENTS:
      return {
        ...state,
        isLoading: false,
        didInvalidate: false,
        items: action.items,
        projectId: action.projectId
      };
    case types.RECEIVE_DOCUMENTS_ERROR:
      return {
        ...state,
        items: [],
        projectId: action.projectId,
        isLoading: false
      };
    case types.NEW_DOCUMENT_REQUEST:
      return {
        ...state,
        isLoading: true,
        lastItemId: 0
      };
    case types.NEW_DOCUMENT:
      if (!action.document) {
        return state;
      }

      return {
        ...state,
        isLoading: false,
        lastItemId: action.document.id,
        items: [
          action.document,
          ...state.items
        ]
      };
    case types.REQUEST_DOCUMENT:
      return {
        ...state,
        isLoading: true,
        selectedDocument: initialState.selectedDocument
      };
    case types.RECEIVE_DOCUMENT:
      return {
        ...state,
        isLoading: false,
        selectedDocument: action.document
      };
    case types.REQUEST_UPDATE_DOCUMENT:
      return {
        ...state,
        isLoading: true
      };
    case types.UPDATE_DOCUMENT_ERROR:
      return {
        ...state,
        isLoading: false
      };
    case types.UPDATE_DOCUMENT:
      const document = action.document;
      if (!document) {
        return state;
      }
      const items = Array.from(state.items);
      const key = items.findIndex((x) => x && x.id === document.id);

      if (key >= 0) {
        items[key] = document;
      }

      return {
        ...state,
        items,
        isLoading: false,
        selectedDocument: state.selectedDocument.id !== document.id ? state.selectedDocument : document
      };
    default:
      return state;
  }
};
