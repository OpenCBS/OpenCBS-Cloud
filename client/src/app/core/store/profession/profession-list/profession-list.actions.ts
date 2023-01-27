import { Action } from '@ngrx/store';

export const LOAD_PROFESSIONS = '[PROFESSION_LIST] LOAD_PROFESSIONS';
export const LOAD_PROFESSIONS_SUCCESS = '[PROFESSION_LIST] LOAD_PROFESSIONS_SUCCESS';
export const LOAD_PROFESSIONS_FAILURE = '[PROFESSION_LIST] LOAD_PROFESSIONS_FAILURE';
export const LOADING_PROFESSIONS = '[PROFESSION_LIST] LOADING_PROFESSIONS';

export class LoadProfessions implements Action {
  readonly type = LOAD_PROFESSIONS;

  constructor(public payload?: any) {
  }
}

export class LoadingProfessions implements Action {
  readonly type = LOADING_PROFESSIONS;

  constructor(public payload?: any) {
  }
}

export class LoadProfessionsSuccess implements Action {
  readonly type = LOAD_PROFESSIONS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadProfessionsFailure implements Action {
  readonly type = LOAD_PROFESSIONS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type ProfessionListActions = LoadProfessions | LoadingProfessions | LoadProfessionsSuccess | LoadProfessionsFailure;
