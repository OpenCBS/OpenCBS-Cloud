import * as fromUserUpdate from './user-update.actions';

export interface UpdateUserState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateUserState: UpdateUserState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function userUpdateReducer(state = initialUpdateUserState,
                                  action: fromUserUpdate.UserUpdateActions) {
  switch (action.type) {
    case fromUserUpdate.UPDATE_USER_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromUserUpdate.UPDATE_USER_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromUserUpdate.UPDATE_USER_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving User-state data'
      });
    case fromUserUpdate.UPDATE_USER_RESET:
      return initialUpdateUserState;
    default:
      return state;
  }
}
