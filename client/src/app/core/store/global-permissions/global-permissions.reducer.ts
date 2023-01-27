import { Map } from 'immutable';
import { GlobalPermissions, GlobalPermissionsRecord } from './global-permissions.model';
import * as fromGlobalPermissions from './global-permissions.actions';


export type GlobalPermissionsState = Map<string, any>;

const initialState: GlobalPermissionsState = new GlobalPermissionsRecord() as GlobalPermissions;

export function globalPermissionsReducer(state = initialState,
                                         action: fromGlobalPermissions.GlobalPermissionsActions) {
  switch (action.type) {
    case fromGlobalPermissions.LOAD_GLOBAL_PERMISSIONS_SUCCESS:
      const permissions = action.payload;
      return state.withMutations(permissionState => {
        permissionState
        .set('permissions', permissions)
        .set('error', false)
        .set('errorMessage', '')
        .set('loaded', true)
        .set('success', true);
      });
    case fromGlobalPermissions.LOAD_GLOBAL_PERMISSIONS_FAILURE:
      return state.withMutations(permissionState => {
        permissionState
        .set('permissions', [])
        .set('error', true)
        .set('loaded', true)
        .set('success', false)
        .set('errorMessage', action.payload.message ? action.payload.message : 'Error getting global permissions');
      });
    default:
      return state;
  }
}
