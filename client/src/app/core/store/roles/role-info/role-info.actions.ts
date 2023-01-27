import { Action } from '@ngrx/store';

export const LOAD_ROLE = '[ROLE] LOAD_ROLE';
export const LOADING_ROLE = '[ROLE] LOADING_ROLE';
export const LOAD_ROLE_SUCCESS = '[ROLE] LOAD_ROLE_SUCCESS';
export const LOAD_ROLE_FAILURE = '[ROLE] LOAD_ROLE_FAILURE';
export const RESET_ROLE = '[ROLE] RESET_ROLE';
export const ROLE_SET_BREADCRUMB = '[ROLE ] ROLE _SET_BREADCRUMB';

export class LoadRole implements Action {
  readonly type = LOAD_ROLE;

  constructor(public payload?: any) {
  }
}

export class LoadingRole implements Action {
  readonly type = LOADING_ROLE;

  constructor(public payload?: any) {
  }
}

export class LoadRoleSuccess implements Action {
  readonly type = LOAD_ROLE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadRoleFailure implements Action {
  readonly type = LOAD_ROLE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetRole implements Action {
  readonly type = RESET_ROLE;

  constructor(public payload?: any) {
  }
}

export class SetRoleBreadcrumb implements Action {
  readonly type = ROLE_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type RoleActions = LoadRole | LoadingRole | LoadRoleSuccess | LoadRoleFailure | ResetRole | SetRoleBreadcrumb;
