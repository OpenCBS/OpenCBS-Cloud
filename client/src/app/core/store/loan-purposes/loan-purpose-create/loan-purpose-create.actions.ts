import { Action } from '@ngrx/store';

export const CREATE_LOAN_PURPOSE = '[LOAN_PURPOSE_CREATE] CREATE_LOAN_PURPOSE';
export const CREATE_LOAN_PURPOSE_LOADING = '[LOAN_PURPOSE_CREATE] CREATE_LOAN_PURPOSE_LOADING';
export const CREATE_LOAN_PURPOSE_SUCCESS = '[LOAN_PURPOSE_CREATE] CREATE_LOAN_PURPOSE_SUCCESS';
export const CREATE_LOAN_PURPOSE_FAILURE = '[LOAN_PURPOSE CREATE] CREATE_LOAN_PURPOSE_FAILURE';
export const CREATE_LOAN_PURPOSE_RESET = '[LOAN_PURPOSE_CREATE] CREATE_LOAN_PURPOSE_RESET';

export class CreateLoanPurpose implements Action {
  readonly type = CREATE_LOAN_PURPOSE;

  constructor(public payload?: any) {
  }
}

export class CreateLoanPurposeLoading implements Action {
  readonly type = CREATE_LOAN_PURPOSE_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateLoanPurposeSuccess implements Action {
  readonly type = CREATE_LOAN_PURPOSE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateLoanPurposeFailure implements Action {
  readonly type = CREATE_LOAN_PURPOSE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateLoanPurposeReset implements Action {
  readonly type = CREATE_LOAN_PURPOSE_RESET;

  constructor(public payload?: any) {
  }
}

export type LoanPurposeCreateActions =
  CreateLoanPurpose
  | CreateLoanPurposeLoading
  | CreateLoanPurposeSuccess
  | CreateLoanPurposeFailure
  | CreateLoanPurposeReset;
