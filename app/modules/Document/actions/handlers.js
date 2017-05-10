// @flow
import api from '../../../middleware/api';
import { success } from '../../../utils/notification';
import type { TypedActionType, AsyncActionType, StateType, ActionType } from '../../../types/redux';
import type { DocumentType, DocumentsPayloadType, DocumentPayloadType, DocumentRemovePayloadType } from '../document';
import types from './types';

// ------------------------------------
// Actions
// ------------------------------------
export const request = (campaignId: number): TypedActionType<DocumentsPayloadType> => ({
  type: types.REQUEST_DOCUMENTS,
  payload: {
    campaignId
  }
});

export const receive = (campaignId: number, { documents }: { documents: DocumentType[] }): TypedActionType<DocumentsPayloadType> => ({
  type: types.RECEIVE_DOCUMENTS,
  payload: {
    documents,
    campaignId
  }
});

export const requestOne = (campaignId: number, documentId: number): ActionType => ({
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

const onReceiveError = (campaignId: number): TypedActionType<DocumentsPayloadType> => ({
  type: types.RECEIVE_DOCUMENTS_ERROR,
  payload: {
    campaignId
  }
});

const doFetch = (campaignId: number): AsyncActionType => (dispatch, getState): Promise<?DocumentType[]> => {
  dispatch(request(campaignId));

  return api.documents.get(campaignId)
    .then((data) => dispatch(receive(campaignId, data)))
    .catch(() => {
      dispatch(onReceiveError(campaignId));
    });
};

const shouldFetch = (campaignId: number, { documents }: StateType): boolean => {
  if (documents.isLoading) {
    return false;
  }

  if (!documents || parseInt(campaignId, 10) !== parseInt(documents.campaignId, 10)) {
    return true;
  }

  return documents.didInvalidate;
};

export const fetchIfNeeded = (campaignId: number): AsyncActionType => (dispatch, getState): ?Promise<?DocumentType[]> => {
  if (shouldFetch(campaignId, getState())) {
    return dispatch(doFetch(campaignId));
  }

  return Promise.resolve();
};

export const fetchOne = (campaignId: number, documentId: number): AsyncActionType => (dispatch, getState): Promise<?DocumentType> => {
  dispatch(requestOne(campaignId, documentId));

  return api.documents.getOne(campaignId, documentId)
    .then((data: DocumentType) => dispatch(receiveOne(data)))
    .catch(() => {
      dispatch(onReceiveError(campaignId));
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

  return api.documents.save(document.campaignId, document)
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

  return api.documents.save(updatedDocument.campaignId, updatedDocument, updatedDocument.id)
    .then((data) => dispatch(receiveUpdated(data)));
};

const receiveRemovedError = (err: Error): AsyncActionType => (dispatch, getState): void => {
  dispatch({
    type: types.REMOVE_DOCUMENT_ERROR,
    payload: null
  });

  throw err;
};

export const receiveRemoved = (documentId: number): TypedActionType<DocumentRemovePayloadType> => {
  success('A document was removed. You can still restore it on the trash page.');

  return {
    type: types.REMOVE_DOCUMENT,
    payload: {
      id: documentId
    }
  };
};

export const remove = (campaignId: number, documentId: number): AsyncActionType => (dispatch): Promise<?DocumentType> => {
  dispatch({
    type: types.REMOVE_DOCUMENT_REQUEST,
    payload: null
  });

  return api.documents.remove(campaignId, documentId)
    .then((data) => dispatch(receiveRemoved(data)))
    .catch((err) => dispatch(receiveRemovedError(err)));
};
