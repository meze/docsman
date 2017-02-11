// @flow
import type { DocumentType } from '../document';

export type SelectedDocumentStateType = {
    id: number,
    projectId: number,
    name: string,
    content: string,
    isLoading: boolean
}

export type DocumentStateType = {
  isLoading: boolean,
  didInvalidate: boolean,
  items: DocumentType[],
  projectId: number,
  lastItemId: number,
  selectedDocument: SelectedDocumentStateType
}

const initialState: DocumentStateType = {
  isLoading: false,
  didInvalidate: true,
  items: [],
  projectId: 0,
  lastItemId: 0,
  selectedDocument: {
    id: 0,
    projectId: 0,
    name: '',
    content: '',
    isLoading: true
  }
};

export default initialState;
