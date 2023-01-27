import * as fromProfileCreate from './profile-create.actions';

export interface CreateProfileState {
  response: {};
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateProfileState: CreateProfileState = {
  response: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function createProfileReducer(state = initialCreateProfileState,
                                     action: fromProfileCreate.ProfileCreateActions) {
  switch (action.type) {
    case fromProfileCreate.CREATE_PROFILE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromProfileCreate.CREATE_PROFILE_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromProfileCreate.CREATE_PROFILE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error profile'
      });
    case fromProfileCreate.CREATE_PROFILE_RESET:
      return initialCreateProfileState;
    default:
      return state;
  }
};
