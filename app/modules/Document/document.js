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