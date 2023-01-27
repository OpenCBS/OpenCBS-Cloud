import { ActionReducer } from '@ngrx/store';
import * as fromProfileUpdate from './profile-update.actions';

export interface UpdateProfileState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateProfileState: UpdateProfileState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function updateProfileReducer(state = initialUpdateProfileState,
                                     action: fromProfileUpdate.ProfileUpdateActions) {
  switch (action.type) {
    case fromProfileUpdate.UPDATE_PROFILE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromProfileUpdate.UPDATE_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromProfileUpdate.UPDATE_PROFILE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving profile-state data'
      });
    case fromProfileUpdate.UPDATE_PROFILE_RESET:
      return initialUpdateProfileState;
    default:
      return state;
  }
};
