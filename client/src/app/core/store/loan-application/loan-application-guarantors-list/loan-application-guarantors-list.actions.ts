import { Action } from '@ngrx/store';

export const LOAD_GUARANTORS = '[GUARANTORS_LIST] LOAD_GUARANTORS';
export const LOAD_GUARANTORS_SUCCESS = '[GUARANTORS_LIST] LOAD_GUARANTORS_SUCCESS';
export const LOAD_GUARANTORS_FAILURE = '[GUARANTORS_LIST] LOAD_GUARANTORS_FAILURE';
export const LOADING_GUARANTORS = '[GUARANTORS_LIST] LOADING_GUARANTORS';

export class LoadGuarantors implements Action {
  readonly type = LOAD_GUARANTORS;

  constructor(public payload?: any) {
  }
}

export class LoadingGuarantors implements Action {
  readonly type = LOADING_GUARANTORS;
}

export class LoadGuarantorsSuccess implements Action {
  readonly type = LOAD_GUARANTORS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadGuarantorsFailure implements Action {
  readonly type = LOAD_GUARANTORS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type LoanAppGuarantorsListActions = LoadGuarantors | LoadingGuarantors | LoadGuarantorsSuccess | LoadGuarantorsFailure;
