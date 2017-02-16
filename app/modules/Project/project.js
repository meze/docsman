// @flow
export type ProjectType = {
  id: number,
  name: string,
  isLoading: boolean
}

export type ProjectSettingsType = {
  name: string
}

export type ProjectsPayloadType = {
  projects: ProjectType[]
}

export type ProjectPayloadType = {
  project: ProjectType
}

export type ProjectRemovePayloadType = {
  id: number
}
