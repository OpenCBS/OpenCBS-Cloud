import { Action } from '@ngrx/store';

export const UPDATE_LOAN_PURPOSE = '[LOAN_PURPOSE_UPDATE] ';
export const UPDATE_LOAN_PURPOSE_LOADING = '[LOAN_PURPOSE_UPDATE] UPDATE_LOAN_PURPOSE_LOADING';
export const UPDATE_LOAN_PURPOSE_SUCCESS = '[LOAN_PURPOSE_UPDATE] UPDATE_LOAN_PURPOSE_SUCCESS';
export const UPDATE_LOAN_PURPOSE_FAILURE = '[LOAN_PURPOSE_UPDATE] UPDATE_LOAN_PURPOSE_FAILURE';
export const UPDATE_LOAN_PURPOSE_RESET = '[LOAN_PURPOSE_UPDATE] UPDATE_LOAN_PURPOSE_RESET';

export class UpdateLoanPurpose implements Action {
  readonly type = UPDATE_LOAN_PURPOSE;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanPurposeLoading implements Action {
  readonly type = UPDATE_LOAN_PURPOSE_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanPurposeSuccess implements Action {
  readonly type = UPDATE_LOAN_PURPOSE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanPurposeFailure implements Action {
  readonly type = UPDATE_LOAN_PURPOSE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanPurposeReset implements Action {
  readonly type = UPDATE_LOAN_PURPOSE_RESET;

  constructor(public payload?: any) {
  }
}

export type LoanPurposeUpdateActions =
  UpdateLoanPurpose
  | UpdateLoanPurposeLoading
  | UpdateLoanPurposeSuccess
  | UpdateLoanPurposeFailure
  | UpdateLoanPurposeReset;
