import { Action } from '@ngrx/store';

export const LOAD_TELLERS = '[TELLERS] LOAD_TELLERS';
export const LOADING_TELLERS = '[TELLERS] LOADING_TELLERS';
export const LOAD_TELLERS_SUCCESS = '[TELLERS] LOAD_TELLERS_SUCCESS';
export const LOAD_TELLERS_FAILURE = '[TELLERS] LOAD_TELLERS_FAILURE';
export const TELLERS_SET_BREADCRUMB = '[TELLERS] TELLERS_SET_BREADCRUMB';

export class LoadTellerList implements Action {
  readonly type = LOAD_TELLERS;

  constructor(public payload?: any) {
  }
}

export class LoadingTellerList implements Action {
  readonly type = LOADING_TELLERS;

  constructor(public payload?: any) {
  }
}

export class LoadTellerListSuccess implements Action {
  readonly type = LOAD_TELLERS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadTellerListFail implements Action {
  readonly type = LOAD_TELLERS_FAILURE;

  constructor(public payload?: any) {
  }
}

export class SetTellerBreadcrumb implements Action {
  readonly type = TELLERS_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type TellerListActions =
  LoadTellerList
  | LoadingTellerList
  | LoadTellerListSuccess
  | LoadTellerListFail
  | SetTellerBreadcrumb;
