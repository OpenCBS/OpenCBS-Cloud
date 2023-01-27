import { ActionReducer } from '@ngrx/store';
import * as fromUserCreate from './user-create.actions';

export interface CreateUserState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateUserState: CreateUserState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function userCreateReducer(state = initialCreateUserState,
                                  action: fromUserCreate.UserCreateActions) {
  switch (action.type) {
    case fromUserCreate.CREATE_USER_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromUserCreate.CREATE_USER_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromUserCreate.CREATE_USER_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error creating user'
      });
    case fromUserCreate.CREATE_USER_RESET:
      return initialCreateUserState;
    default:
      return state;
  }
};
