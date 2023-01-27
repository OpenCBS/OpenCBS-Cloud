import { ActionReducer } from '@ngrx/store';
import * as fromRoleCreate from './role-create.actions';

export interface CreateRoleState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateRoleState: CreateRoleState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function roleCreateReducer(state = initialCreateRoleState, action: fromRoleCreate.RoleCreateActions) {
  switch (action.type) {
    case fromRoleCreate.CREATE_ROLE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromRoleCreate.CREATE_ROLE_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromRoleCreate.CREATE_ROLE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new role data'
      });
    case fromRoleCreate.CREATE_ROLE_RESET:
      return initialCreateRoleState;
    default:
      return state;
  }
};
