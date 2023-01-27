import { ActionReducer } from '@ngrx/store';
import * as fromRoleList from './role-list.actions';

export interface RoleListState {
  roles: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialRoleListState: RoleListState = {
  roles: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function roleListReducer(state = initialRoleListState,
                                action: fromRoleList.RoleListActions) {
  switch (action.type) {
    case fromRoleList.LOADING_ROLES:
      return Object.assign({}, state, {
        loading: true
      });
    case fromRoleList.LOAD_ROLES_SUCCESS:
      return Object.assign({}, state, {
        roles: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromRoleList.LOAD_ROLES_FAILURE:
      return Object.assign({}, state, {
        roles: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting roles'
      });
    case fromRoleList.RESET_ROLES:
      return initialRoleListState;
    default:
      return state;
  }
};
