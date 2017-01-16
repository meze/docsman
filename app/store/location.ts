import { Action, Store } from 'redux';

export interface ILocationAction extends Action {
  type: any;
  payload: string;
}

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
export const updateLocation = ({ dispatch }: Store<{}>) => {
  return (nextLocation) => dispatch(locationChange(nextLocation));
};

// Reducer
const initialState = null;
export default function locationReducer(state = initialState, action: ILocationAction) {
  return action.type === LOCATION_CHANGE
    ? action.payload
    : state;
}
