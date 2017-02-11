// @flow
import type { ProjectType } from '../project';

export type SelectedProjectType = {
  id: number,
  name: string,
  isLoading: boolean
}

export type ProjectStateType = {
  isLoading: boolean,
  didInvalidate: boolean,
  items: ProjectType[],
  currentProject: SelectedProjectType
}

const initialState: ProjectStateType = {
  isLoading: false,
  didInvalidate: true,
  items: [],
  currentProject: { id: 0, name: '', isLoading: true }
};

export default initialState;
