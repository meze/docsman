// @flow
import api from '../../../middleware/api';
import { success } from '../../../utils/notification';
import type { DocumentType } from '../document';
import type { DocumentStateType } from './state';
import types from './types';

// ------------------------------------
// Actions
// ------------------------------------
export const request = (projectId: number) => ({
  type: types.REQUEST_DOCUMENTS,
  projectId
});

export const receive = (projectId: number, { documents }: { documents: DocumentType[] }) => ({
  type: types.RECEIVE_DOCUMENTS,
  projectId,
  items: documents
});

export const requestOne = (projectId: number, documentId: number) => ({
  type: types.REQUEST_DOCUMENT,
  projectId,
  documentId
});

export const receiveOne = (document: DocumentType) => ({
  type: types.RECEIVE_DOCUMENT,
  document
});

export const invalidate = () => ({
  type: types.INVALIDATE_DOCUMENTS
});

const doFetch = (projectId: number) => (dispatch: Function) => {
  dispatch(request(projectId));

  return api.documents.get(projectId)
    .then((data) => dispatch(receive(projectId, data)))
    .catch(() => {
      dispatch({
        type: types.RECEIVE_DOCUMENTS_ERROR,
        projectId
      });
    });
};

const shouldFetch = (projectId: number, state: { documents: DocumentStateType }) => {
  const documents = state.documents;

  if (documents.isLoading) {
    return false;
  }

  if (!documents || parseInt(projectId, 10) !== parseInt(documents.projectId, 10)) {
    return true;
  }

  return documents.didInvalidate;
};

export const fetchIfNeeded = (projectId: number) => (dispatch: Function, getState: Function) => {
  if (shouldFetch(projectId, getState())) {
    return dispatch(doFetch(projectId));
  }

  return Promise.resolve();
};

export const fetchOne = (projectId: number, documentId: number) => (dispatch: Function) => {
  dispatch(requestOne(projectId, documentId));

  return api.documents.getOne(projectId, documentId)
    .then((data) => dispatch(receiveOne(data)))
    .catch(() => {
      dispatch({
        type: types.RECEIVE_DOCUMENTS_ERROR,
        projectId
      });
    });
};

export const receiveNew = (document: DocumentType) => {
  success('A document was created.');

  return {
    type: types.NEW_DOCUMENT,
    document
  };
};

export const save = (document: DocumentType) => (dispatch: Function) => {
  dispatch({
    type: types.NEW_DOCUMENT_REQUEST
  });

  return api.documents.save(document.projectId, document)
    .then((data) => dispatch(receiveNew(data)));
};

export const receiveUpdated = (document: DocumentType) => {
  success('A document content was updated.');

  return {
    type: types.UPDATE_DOCUMENT,
    document
  };
};

export const update = (updatedDocument: DocumentType) => (dispatch: Function) => {
  dispatch({
    type: types.REQUEST_UPDATE_DOCUMENT
  });

  return api.documents.save(updatedDocument.projectId, updatedDocument, updatedDocument.id)
    .then((data) => dispatch(receiveUpdated(data)));
};
