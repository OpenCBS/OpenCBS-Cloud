import { Action } from '@ngrx/store';

export const LOAD_GLOBAL_PERMISSIONS_FAILURE = '[GLOBAL_PERMISSIONS] FAILURE';
export const LOAD_GLOBAL_PERMISSIONS_SUCCESS = '[GLOBAL_PERMISSIONS] SUCCESS';
export const LOAD_GLOBAL_PERMISSIONS = '[GLOBAL_PERMISSIONS] LOAD';

export class LoadGlobalPermissions implements Action {
  readonly type = LOAD_GLOBAL_PERMISSIONS;
}

export class LoadGlobalPermissionsSuccess implements Action {
  readonly type = LOAD_GLOBAL_PERMISSIONS_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadGlobalPermissionsFailure implements Action {
  readonly type = LOAD_GLOBAL_PERMISSIONS_FAILURE;

  constructor(public payload: any) {
  }
}

export type GlobalPermissionsActions = LoadGlobalPermissions | LoadGlobalPermissionsSuccess | LoadGlobalPermissionsFailure;
