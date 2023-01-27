import { Action } from '@ngrx/store';

export const UPDATE_PROFESSION = '[PROFESSION_UPDATE] UPDATE_PROFESSION';
export const UPDATE_PROFESSION_LOADING = '[PROFESSION_UPDATE] UPDATE_PROFESSION_LOADING';
export const UPDATE_PROFESSION_SUCCESS = '[PROFESSION_UPDATE] UPDATE_PROFESSION_SUCCESS';
export const UPDATE_PROFESSION_FAILURE = '[PROFESSION_UPDATE] UPDATE_PROFESSION_FAILURE';
export const UPDATE_PROFESSION_RESET = '[PROFESSION_UPDATE] UPDATE_PROFESSION_RESET';

export class UpdateProfession implements Action {
  readonly type = UPDATE_PROFESSION;

  constructor(public payload?: any) {
  }
}

export class UpdateProfessionLoading implements Action {
  readonly type = UPDATE_PROFESSION_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateProfessionSuccess implements Action {
  readonly type = UPDATE_PROFESSION_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateProfessionFailure implements Action {
  readonly type = UPDATE_PROFESSION_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateProfessionReset implements Action {
  readonly type = UPDATE_PROFESSION_RESET;

  constructor(public payload?: any) {
  }
}

export type ProfessionUpdateActions =
  UpdateProfession
  | UpdateProfessionLoading
  | UpdateProfessionSuccess
  | UpdateProfessionFailure
  | UpdateProfessionReset;
