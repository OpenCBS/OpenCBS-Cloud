import { Action } from '@ngrx/store';

export const LOAD_ROLES = '[ROLES] LOAD_ROLES';
export const LOADING_ROLES = '[ROLES] LOADING_ROLES';
export const LOAD_ROLES_SUCCESS = '[ROLES] LOAD_ROLES_SUCCESS';
export const LOAD_ROLES_FAILURE = '[ROLES] LOAD_ROLES_FAILURE';
export const RESET_ROLES = '[ROLES] RESET_ROLES';

export class LoadRoleList implements Action {
  readonly type = LOAD_ROLES;

  constructor(public payload?: any) {
  }
}

export class LoadingRoleList implements Action {
  readonly type = LOADING_ROLES;

  constructor(public payload?: any) {
  }
}

export class LoadRoleListSuccess implements Action {
  readonly type = LOAD_ROLES_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadRoleListFail implements Action {
  readonly type = LOAD_ROLES_FAILURE;

  constructor(public payload?: any) {
  }
}

export class RoleListReset implements Action {
  readonly type = RESET_ROLES;

  constructor(public payload?: any) {
  }
}

export type RoleListActions = LoadRoleList | LoadingRoleList | LoadRoleListSuccess | LoadRoleListFail | RoleListReset;
