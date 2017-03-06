// @flow
import api from '../../../middleware/api';
import { success } from '../../../utils/notification';
import type { TypedActionType, AsyncActionType, StateType, ActionType } from '../../../types/redux';
import type { DocumentType, DocumentsPayloadType, DocumentPayloadType } from '../document';
import types from './types';

// ------------------------------------
// Actions
// ------------------------------------
export const request = (projectId: number): TypedActionType<DocumentsPayloadType> => ({
  type: types.REQUEST_DOCUMENTS,
  payload: {
    projectId
  }
});

export const receive = (projectId: number, { documents }: { documents: DocumentType[] }): TypedActionType<DocumentsPayloadType> => ({
  type: types.RECEIVE_DOCUMENTS,
  payload: {
    documents,
    projectId
  }
});

export const requestOne = (projectId: number, documentId: number): ActionType => ({
  type: types.REQUEST_DOCUMENT,
  payload: null
});

export const receiveOne = (document: DocumentType): TypedActionType<DocumentPayloadType> => ({
  type: types.RECEIVE_DOCUMENT,
  payload: {
    document
  }
});

export const invalidate = (): ActionType => ({
  type: types.INVALIDATE_DOCUMENTS,
  payload: null
});

const onReceiveError = (projectId: number): TypedActionType<DocumentsPayloadType> => ({
  type: types.RECEIVE_DOCUMENTS_ERROR,
  payload: {
    projectId
  }
});

const doFetch = (projectId: number): AsyncActionType => (dispatch, getState): Promise<?DocumentType[]> => {
  dispatch(request(projectId));

  return api.documents.get(projectId)
    .then((data) => dispatch(receive(projectId, data)))
    .catch(() => {
      dispatch(onReceiveError(projectId));
    });
};

const shouldFetch = (projectId: number, { documents }: StateType): boolean => {
  if (documents.isLoading) {
    return false;
  }

  if (!documents || parseInt(projectId, 10) !== parseInt(documents.projectId, 10)) {
    return true;
  }

  return documents.didInvalidate;
};

export const fetchIfNeeded = (projectId: number): AsyncActionType => (dispatch, getState): ?Promise<?DocumentType[]> => {
  if (shouldFetch(projectId, getState())) {
    return dispatch(doFetch(projectId));
  }

  return Promise.resolve();
};

export const fetchOne = (projectId: number, documentId: number): AsyncActionType => (dispatch, getState): Promise<?DocumentType> => {
  dispatch(requestOne(projectId, documentId));

  return api.documents.getOne(projectId, documentId)
    .then((data: DocumentType) => dispatch(receiveOne(data)))
    .catch(() => {
      dispatch(onReceiveError(projectId));
    });
};

export const receiveNew = (document: DocumentType): TypedActionType<DocumentPayloadType> => {
  success('A document was created.');

  return {
    type: types.NEW_DOCUMENT,
    payload: {
      document
    }
  };
};

const newDocumentRequest: ActionType = ({
  type: types.NEW_DOCUMENT_REQUEST,
  payload: null
});

export const save = (document: DocumentType): AsyncActionType => (dispatch, getState): Promise<?DocumentType> => {
  dispatch(newDocumentRequest);

  return api.documents.save(document.projectId, document)
    .then((data) => {
      dispatch(receiveNew(data));

      return data;
    });
};

export const receiveUpdated = (document: DocumentType): TypedActionType<DocumentPayloadType> => {
  success('A document content was updated.');

  return {
    type: types.UPDATE_DOCUMENT,
    payload: {
      document
    }
  };
};

const requestUpdateDocument: ActionType = ({
  type: types.REQUEST_UPDATE_DOCUMENT,
  payload: null
});

export const update = (updatedDocument: DocumentType): AsyncActionType => (dispatch, getState): Promise<?DocumentType> => {
  dispatch(requestUpdateDocument);

  return api.documents.save(updatedDocument.projectId, updatedDocument, updatedDocument.id)
    .then((data) => dispatch(receiveUpdated(data)));
};

const receiveRemovedError = (err: Error): AsyncActionType => (dispatch, getState): void => {
  dispatch({
    type: types.REMOVE_DOCUMENT_ERROR,
    payload: null
  });

  throw err;
};

export const receiveRemoved = (documentId: number): TypedActionType<ProjectRemovePayloadType> => {
  success('A document was removed. You can still restore it on the trash page.');

  return {
    type: types.REMOVE_DOCUMENT,
    payload: {
      id: documentId
    }
  };
};

export const remove = (projectId: number, documentId: number): AsyncActionType => (dispatch): Promise<?ProjectType> => {
  dispatch({
    type: types.REMOVE_DOCUMENT_REQUEST,
    payload: null
  });

  return api.documents.remove(projectId, documentId)
    .then((data) => dispatch(receiveRemoved(data)))
    .catch((err) => dispatch(receiveRemovedError(err)));
};
