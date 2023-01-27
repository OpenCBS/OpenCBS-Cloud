import { ActionReducer } from '@ngrx/store';
import * as fromLocationUpdate from './location-update.actions';

export interface UpdateLocationState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateLocationState: UpdateLocationState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function locationUpdateReducer(state = initialUpdateLocationState,
                                      action: fromLocationUpdate.LocationUpdateActions) {
  switch (action.type) {
    case fromLocationUpdate.UPDATE_LOCATION_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLocationUpdate.UPDATE_LOCATION_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLocationUpdate.UPDATE_LOCATION_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new location data'
      });
    case fromLocationUpdate.UPDATE_LOCATION_RESET:
      return initialUpdateLocationState;
    default:
      return state;
  }
};
