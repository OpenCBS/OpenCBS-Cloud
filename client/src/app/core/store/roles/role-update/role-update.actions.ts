import { Action } from '@ngrx/store';

export const UPDATE_ROLE = '[ROLE_UPDATE] UPDATE_ROLE';
export const UPDATE_ROLE_LOADING = '[ROLE_UPDATE] UPDATE_ROLE_LOADING';
export const UPDATE_ROLE_SUCCESS = '[ROLE_UPDATE] UPDATE_ROLE_SUCCESS';
export const UPDATE_ROLE_FAILURE = '[ROLE_UPDATE] UPDATE_ROLE_FAILURE';
export const UPDATE_ROLE_RESET = '[ROLE_UPDATE] UPDATE_ROLE_RESET';

export class UpdateRole implements Action {
  readonly type = UPDATE_ROLE;

  constructor(public payload?: any) {
  }
}

export class UpdateRoleLoading implements Action {
  readonly type = UPDATE_ROLE_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateRoleSuccess implements Action {
  readonly type = UPDATE_ROLE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateRoleFailure implements Action {
  readonly type = UPDATE_ROLE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateRoleReset implements Action {
  readonly type = UPDATE_ROLE_RESET;

  constructor(public payload?: any) {
  }
}

export type RoleUpdateActions = UpdateRole | UpdateRoleLoading | UpdateRoleSuccess | UpdateRoleFailure | UpdateRoleReset;
