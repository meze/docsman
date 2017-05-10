// @flow
export type DocumentType = {
  id: number,
  name: string,
  content: string,
  campaignId: number,
  creationDate: Date,
  isLoading: boolean
}

export type DocumentSettingsType = {
  name: string
}

export type DocumentsPayloadType = {
  documents?: DocumentType[],
  campaignId: number
}

export type DocumentPayloadType = {
  document: DocumentType
}

export type DocumentRemovePayloadType = {
  id: number
}
