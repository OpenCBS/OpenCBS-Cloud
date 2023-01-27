import { Action } from '@ngrx/store';

export const CREATE_ROLE = '[ROLE_CREATE] CREATE_ROLE';
export const CREATE_ROLE_LOADING = '[ROLE_CREATE] CREATE_ROLE_LOADING';
export const CREATE_ROLE_SUCCESS = '[ROLE_CREATE] CREATE_ROLE_SUCCESS';
export const CREATE_ROLE_FAILURE = '[ROLE_CREATE] CREATE_ROLE_FAILURE';
export const CREATE_ROLE_RESET = '[ROLE_CREATE] CREATE_ROLE_RESET';

export class CreateRole implements Action {
  readonly type = CREATE_ROLE;

  constructor(public payload?: any) {
  }
}

export class CreateRoleLoading implements Action {
  readonly type = CREATE_ROLE_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateRoleSuccess implements Action {
  readonly type = CREATE_ROLE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateRoleFailure implements Action {
  readonly type = CREATE_ROLE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateRoleReset implements Action {
  readonly type = CREATE_ROLE_RESET;

  constructor(public payload?: any) {
  }
}

export type RoleCreateActions = CreateRole | CreateRoleLoading | CreateRoleSuccess | CreateRoleFailure | CreateRoleReset;
