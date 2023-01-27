import { ActionReducer } from '@ngrx/store';
import * as fromProfileEvents from './profile-events-list.actions';

export interface ProfileEventListState {
  events: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialProfileEventListState: ProfileEventListState = {
  events: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function profileEventListReducer(state = initialProfileEventListState,
                                        action: fromProfileEvents.ProfileEventsListActions) {
  switch (action.type) {
    case fromProfileEvents.LOADING_PROFILE_EVENTS:
      return Object.assign({}, state, {
        loading: true
      });

    case fromProfileEvents.LOAD_PROFILE_EVENTS_SUCCESS:
      return Object.assign({}, state, {
        events: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });

    case fromProfileEvents.LOAD_PROFILE_EVENTS_FAILURE:
      return Object.assign({}, state, {
        events: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting profile event list'
      });

    default:
      return state;
  }
};
