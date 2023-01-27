import { ActionReducer } from '@ngrx/store';
import * as fromLocationList from './location-list.actions';

export interface LocationListState {
  locations: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLocationListState: LocationListState = {
  locations: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function locationListReducer(state = initialLocationListState,
                                    action: fromLocationList.LocationListActions) {
  switch (action.type) {
    case fromLocationList.LOADING_LOCATIONS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLocationList.LOAD_LOCATIONS_SUCCESS:
      return Object.assign({}, state, {
        locations: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLocationList.LOAD_LOCATIONS_FAILURE:
      return Object.assign({}, state, {
        locations: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting location list'
      });
    default:
      return state;
  }
};

