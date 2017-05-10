// @flow
import type { DocumentType } from '../document';

export type SelectedDocumentStateType = {
    id: number,
    campaignId: number,
    name: string,
    content: string,
    isLoading: boolean
}

export type DocumentStateType = {
  isLoading: boolean,
  didInvalidate: boolean,
  items: DocumentType[],
  campaignId: number,
  lastItemId: number,
  selectedDocument: SelectedDocumentStateType
}

const initialState: DocumentStateType = {
  isLoading: false,
  didInvalidate: true,
  items: [],
  campaignId: 0,
  lastItemId: 0,
  selectedDocument: {
    id: 0,
    campaignId: 0,
    name: '',
    content: '',
    isLoading: true
  }
};

export default initialState;
