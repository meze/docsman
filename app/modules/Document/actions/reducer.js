// @flow
import type { TypedActionType } from '../../../types/redux';
import type { DocumentsPayloadType, DocumentPayloadType, DocumentRemovePayloadType } from '../document';
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
    case types.RECEIVE_DOCUMENTS: {
      const payload: DocumentsPayloadType = action.payload;

      return {
        ...state,
        isLoading: false,
        didInvalidate: false,
        items: payload.documents,
        campaignId: payload.campaignId
      };
    }
    case types.RECEIVE_DOCUMENTS_ERROR: {
      const payload: DocumentsPayloadType = action.payload;

      return {
        ...state,
        items: [],
        campaignId: payload.campaignId,
        isLoading: false
      };
    }
    case types.NEW_DOCUMENT_REQUEST:
      return {
        ...state,
        isLoading: true,
        lastItemId: 0
      };
    case types.NEW_DOCUMENT: {
      const payload: DocumentPayloadType = action.payload;
      if (!payload.document) {
        return state;
      }

      return {
        ...state,
        isLoading: false,
        lastItemId: payload.document.id,
        items: [
          payload.document,
          ...state.items
        ]
      };
    }
    case types.REQUEST_DOCUMENT:
      return {
        ...state,
        isLoading: true,
        selectedDocument: initialState.selectedDocument
      };
    case types.RECEIVE_DOCUMENT: {
      const payload: DocumentPayloadType = action.payload;

      return {
        ...state,
        isLoading: false,
        selectedDocument: payload.document
      };
    }
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
      const document = (action.payload: DocumentPayloadType).document;
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
    case types.REMOVE_DOCUMENT_REQUEST: {
      return {
        ...state,
        isLoading: true
      };
    }
    case types.REMOVE_DOCUMENT: {
      const payload: DocumentRemovePayloadType = action.payload;
      const id = payload.id;
      const itemsWithoutRemoved = state.items.filter((x) => x.id !== id);

      return {
        ...state,
        items: itemsWithoutRemoved,
        isLoading: false
      };
    }
    default:
      return state;
  }
};
