// @flow
export type SecurityStateType = {
  isAuthenticated: boolean,
  isLoading: boolean,
  isError: boolean
}

const initialState: SecurityStateType = {
  isAuthenticated: false,
  isLoading: false,
  isError: false
};

export default initialState;
