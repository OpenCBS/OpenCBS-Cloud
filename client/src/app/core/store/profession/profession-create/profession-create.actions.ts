import { Action } from '@ngrx/store';

export const CREATE_PROFESSION = '[PROFESSION_CREATE] CREATE_PROFESSION';
export const CREATE_PROFESSION_LOADING = '[PROFESSION_CREATE] CREATE_PROFESSION_LOADING';
export const CREATE_PROFESSION_SUCCESS = '[PROFESSION_CREATE] CREATE_PROFESSION_SUCCESS';
export const CREATE_PROFESSION_FAILURE = '[PROFESSION_CREATE] CREATE_PROFESSION_FAILURE';
export const CREATE_PROFESSION_RESET = '[PROFESSION_CREATE] CREATE_PROFESSION_RESET';

export class CreateProfession implements Action {
  readonly type = CREATE_PROFESSION;

  constructor(public payload?: any) {
  }
}

export class CreateProfessionLoading implements Action {
  readonly type = CREATE_PROFESSION_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateProfessionSuccess implements Action {
  readonly type = CREATE_PROFESSION_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateProfessionFailure implements Action {
  readonly type = CREATE_PROFESSION_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateProfessionReset implements Action {
  readonly type = CREATE_PROFESSION_RESET;

  constructor(public payload?: any) {
  }
}

export type ProfessionCreateActions =
  CreateProfession
  | CreateProfessionLoading
  | CreateProfessionSuccess
  | CreateProfessionFailure
  | CreateProfessionReset;
