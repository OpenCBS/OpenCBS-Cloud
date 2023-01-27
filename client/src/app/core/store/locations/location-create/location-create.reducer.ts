import { ActionReducer } from '@ngrx/store';
import * as fromLocationCreate from './location-create.actions';

export interface CreateLocationState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateLocationState: CreateLocationState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function locationCreateReducer(state = initialCreateLocationState,
                                      action: fromLocationCreate.LocationCreateActions) {
  switch (action.type) {
    case fromLocationCreate.CREATE_LOCATION_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLocationCreate.CREATE_LOCATION_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLocationCreate.CREATE_LOCATION_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new location data'
      });
    case fromLocationCreate.CREATE_LOCATION_RESET:
      return initialCreateLocationState;
    default:
      return state;
  }
};
