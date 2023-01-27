import { Action } from '@ngrx/store';

export const LOAD_MAKER_CHECKERS = '[MAKER_CHECKERS_LIST] LOAD_MAKER_CHECKERS';
export const LOAD_MAKER_CHECKERS_SUCCESS = '[MAKER_CHECKERS_LIST] LOAD_MAKER_CHECKERS_SUCCESS';
export const LOAD_MAKER_CHECKERS_FAILURE = '[MAKER_CHECKERS_LIST] LOAD_MAKER_CHECKERS_FAILURE';
export const LOADING_MAKER_CHECKERS = '[MAKER_CHECKERS_LIST] LOADING_MAKER_CHECKERS';

export class LoadMakerCheckerList implements Action {
  readonly type = LOAD_MAKER_CHECKERS;

  constructor(public payload?: any) {
  }
}

export class LoadingMakerCheckerList implements Action {
  readonly type = LOADING_MAKER_CHECKERS;

  constructor(public payload?: any) {
  }
}

export class LoadMakerCheckerListSuccess implements Action {
  readonly type = LOAD_MAKER_CHECKERS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadMakerCheckerListFailure implements Action {
  readonly type = LOAD_MAKER_CHECKERS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type MakerCheckerListActions =
  LoadMakerCheckerList |
  LoadingMakerCheckerList |
  LoadMakerCheckerListSuccess |
  LoadMakerCheckerListFailure;
