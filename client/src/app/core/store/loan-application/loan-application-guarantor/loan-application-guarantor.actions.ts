import { Action } from '@ngrx/store';

export const LOAD_GUARANTOR = '[GUARANTOR] LOAD_GUARANTOR';
export const LOADING_GUARANTOR = '[GUARANTOR] LOADING_GUARANTOR';
export const LOAD_GUARANTOR_SUCCESS = '[GUARANTOR] LOAD_GUARANTOR_SUCCESS';
export const LOAD_GUARANTOR_FAILURE = '[GUARANTOR] LOAD_GUARANTOR_FAILURE';
export const RESET_GUARANTOR = '[GUARANTOR] RESET_GUARANTOR';

export class LoadGuarantor implements Action {
  readonly type = LOAD_GUARANTOR;

  constructor(public payload?: any) {
  }
}

export class LoadingGuarantor implements Action {
  readonly type = LOADING_GUARANTOR;

  constructor(public payload?: any) {
  }
}

export class LoadGuarantorSuccess implements Action {
  readonly type = LOAD_GUARANTOR_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadGuarantorFailure implements Action {
  readonly type = LOAD_GUARANTOR_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetGuarantor implements Action {
  readonly type = RESET_GUARANTOR;

  constructor(public payload?: any) {
  }
}

export type LoanAppGuarantorActions = LoadGuarantor | LoadingGuarantor | LoadGuarantorSuccess | LoadGuarantorFailure | ResetGuarantor;
