import { ActionReducer } from '@ngrx/store';
import * as fromUsers from './user-list.actions';

export interface UserListState {
  users: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUserListState: UserListState = {
  users: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function userListReducer(state = initialUserListState,
                                action: fromUsers.UserListActions) {
  switch (action.type) {
    case fromUsers.LOADING_USERS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromUsers.LOAD_USERS_SUCCESS:
      return Object.assign({}, state, {
        users: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromUsers.LOAD_USERS_FAILURE:
      return Object.assign({}, state, {
        users: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting user list'
      });
    default:
      return state;
  }
};
