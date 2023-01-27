import { Action } from '@ngrx/store';

export const UPDATE_LOAN_APPLICATION = '[LOAN_APPLICATION_UPDATE] ';
export const UPDATE_LOAN_APPLICATION_LOADING = '[LOAN_APPLICATION_UPDATE] UPDATE_LOAN_APPLICATION_LOADING';
export const UPDATE_LOAN_APPLICATION_SUCCESS = '[LOAN_APPLICATION_UPDATE] UPDATE_LOAN_APPLICATION_SUCCESS';
export const UPDATE_LOAN_APPLICATION_FAILURE = '[LOAN_APPLICATION_UPDATE] UPDATE_LOAN_APPLICATION_FAILURE';
export const UPDATE_LOAN_APPLICATION_RESET = '[LOAN_APPLICATION_UPDATE] UPDATE_LOAN_APPLICATION_RESET';
export const DISBURSE_LOAN_PAYEE = '[LOAN_INFO] DISBURSE_LOAN_PAYEE';

export class UpdateLoanApplication implements Action {
  readonly type = UPDATE_LOAN_APPLICATION;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanApplicationLoading implements Action {
  readonly type = UPDATE_LOAN_APPLICATION_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanApplicationSuccess implements Action {
  readonly type = UPDATE_LOAN_APPLICATION_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanApplicationFailure implements Action {
  readonly type = UPDATE_LOAN_APPLICATION_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanApplicationReset implements Action {
  readonly type = UPDATE_LOAN_APPLICATION_RESET;

  constructor(public payload?: any) {
  }
}

export class DisburseLoanPayee implements Action {
  readonly type = DISBURSE_LOAN_PAYEE;

  constructor(public payload?: any) {
  }
}

export type LoanApplicationUpdateActions =
  UpdateLoanApplication
  | UpdateLoanApplicationLoading
  | UpdateLoanApplicationSuccess
  | UpdateLoanApplicationFailure
  | UpdateLoanApplicationReset
  | DisburseLoanPayee
