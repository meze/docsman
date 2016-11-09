import api from '../../../middleware/api';
import { success } from '../../../utils/notification';
import types from './types';

// ------------------------------------
// Actions
// ------------------------------------
export const request = (projectId) => ({
  type: types.REQUEST_DOCUMENTS,
  projectId
});

export const receive = (projectId, { documents }) => ({
  type: types.RECEIVE_DOCUMENTS,
  projectId,
  items: documents
});

export const requestOne = (projectId, documentId) => ({
  type: types.REQUEST_DOCUMENT,
  projectId,
  documentId
});

export const receiveOne = (document) => ({
  type: types.RECEIVE_DOCUMENT,
  document
});

export const invalidate = () => ({
  type: types.INVALIDATE_DOCUMENTS
});

const doFetch = (projectId) => (dispatch) => {
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

const shouldFetch = (projectId, state) => {
  const documents = state.documents;

  if (documents.isLoading) {
    return false;
  }

  if (!documents || parseInt(projectId, 10) !== parseInt(documents.projectId, 10)) {
    return true;
  }

  return documents.didInvalidate;
};

export const fetchIfNeeded = (projectId) => (dispatch, getState) => {
  if (shouldFetch(projectId, getState())) {
    return dispatch(doFetch(projectId));
  }

  return Promise.resolve();
};

export const fetchOne = (projectId, documentId) => (dispatch) => {
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

export const receiveNew = (document) => {
  success('A document was created.');

  return {
    type: types.NEW_DOCUMENT,
    document
  };
};

export const save = (document) => (dispatch) => {
  dispatch({
    type: types.NEW_DOCUMENT_REQUEST
  });

  return api.documents.save(document.projectId, document)
    .then((data) => dispatch(receiveNew(data)));
};

export const receiveUpdated = (document) => {
  success('A document content was updated.');

  return {
    type: types.UPDATE_DOCUMENT,
    document
  };
};

export const update = (documentId, updatedDocument) => (dispatch) => {
  dispatch({
    type: types.REQUEST_UPDATE_DOCUMENT
  });

  return api.documents.save(updatedDocument.projectId, updatedDocument, documentId)
    .then((data) => dispatch(receiveUpdated(data)));
};
