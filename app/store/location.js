// @flow
// Constants
export const LOCATION_CHANGE = 'LOCATION_CHANGE';

// Actions
export function locationChange(location: string = '/') {
  return {
    type: LOCATION_CHANGE,
    payload: location
  };
}

// Specialized Action Creator
export const updateLocation = ({ dispatch }: { dispatch: Function }) => {
  return (nextLocation: string) => dispatch(locationChange(nextLocation));
};

// Reducer
const initialState = null;
export default function locationReducer(state: ?Object = initialState, action: Object) {
  return action.type === LOCATION_CHANGE
    ? action.payload
    : state;
}
