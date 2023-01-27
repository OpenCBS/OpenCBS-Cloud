import { ActionReducer } from '@ngrx/store';
import * as fromRoleUpdate from './role-update.actions';

export interface UpdateRoleState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateRoleState: UpdateRoleState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function roleUpdateReducer(state = initialUpdateRoleState,
                                  action: fromRoleUpdate.RoleUpdateActions) {
  switch (action.type) {
    case fromRoleUpdate.UPDATE_ROLE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromRoleUpdate.UPDATE_ROLE_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromRoleUpdate.UPDATE_ROLE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving Role-state data'
      });
    case fromRoleUpdate.UPDATE_ROLE_RESET:
      return initialUpdateRoleState;
    default:
      return state;
  }
};
