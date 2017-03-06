// @flow
export type DocumentType = {
  id: number,
  name: string,
  content: string,
  projectId: number,
  creationDate: Date,
  isLoading: boolean
}

export type DocumentSettingsType = {
  name: string
}

export type DocumentsPayloadType = {
  documents?: DocumentType[],
  projectId: number
}

export type DocumentPayloadType = {
  document: DocumentType
}

export type DocumentRemovePayloadType = {
  id: number
}
