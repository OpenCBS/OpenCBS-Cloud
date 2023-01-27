import { ActionReducer } from '@ngrx/store';
import * as fromRole from './role-info.actions';

export interface RoleState {
  role: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialRoleState: RoleState = {
  role: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function roleReducer(state = initialRoleState,
                            action: fromRole.RoleActions) {
  switch (action.type) {
    case fromRole.LOADING_ROLE:
      return Object.assign({}, state, {
        loading: true
      });
    case fromRole.LOAD_ROLE_SUCCESS:
      return Object.assign({}, state, {
        role: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromRole.ROLE_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromRole.LOAD_ROLE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting role'
      });
    case fromRole.RESET_ROLE:
      return initialRoleState;
    default:
      return state;
  }
}
