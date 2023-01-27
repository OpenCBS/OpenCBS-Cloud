import { Action } from '@ngrx/store';

export const CREATE_LOAN_APPLICATION = '[LOAN_APPLICATION_CREATE] CREATE_LOAN_APPLICATION';
export const CREATE_LOAN_APPLICATION_LOADING = '[LOAN_APPLICATION_CREATE] CREATE_LOAN_APPLICATION_LOADING';
export const CREATE_LOAN_APPLICATION_SUCCESS = '[LOAN_APPLICATION_CREATE] CREATE_LOAN_APPLICATION_SUCCESS';
export const CREATE_LOAN_APPLICATION_FAILURE = '[LOAN_APPLICATION CREATE] CREATE_LOAN_APPLICATION_FAILURE';
export const CREATE_LOAN_APPLICATION_RESET = '[LOAN_APPLICATION_CREATE] CREATE_LOAN_APPLICATION_RESET';

export class CreateLoanApplication implements Action {
  readonly type = CREATE_LOAN_APPLICATION;

  constructor(public payload?: any) {
  }
}

export class CreateLoanApplicationLoading implements Action {
  readonly type = CREATE_LOAN_APPLICATION_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateLoanApplicationSuccess implements Action {
  readonly type = CREATE_LOAN_APPLICATION_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateLoanApplicationFailure implements Action {
  readonly type = CREATE_LOAN_APPLICATION_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateLoanApplicationReset implements Action {
  readonly type = CREATE_LOAN_APPLICATION_RESET;

  constructor(public payload?: any) {
  }
}

export type LoanApplicationCreateActions =
  CreateLoanApplication
  | CreateLoanApplicationLoading
  | CreateLoanApplicationSuccess
  | CreateLoanApplicationFailure
  | CreateLoanApplicationReset;
