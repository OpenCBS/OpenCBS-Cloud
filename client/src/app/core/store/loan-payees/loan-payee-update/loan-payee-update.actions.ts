import { Action } from '@ngrx/store';

export const UPDATE_LOAN_PAYEE = '[LOAN_PAYEE_UPDATE] ';
export const UPDATE_LOAN_PAYEE_LOADING = '[LOAN_PAYEE_UPDATE] UPDATE_LOAN_PAYEE_LOADING';
export const UPDATE_LOAN_PAYEE_SUCCESS = '[LOAN_PAYEE_UPDATE] UPDATE_LOAN_PAYEE_SUCCESS';
export const UPDATE_LOAN_PAYEE_FAILURE = '[LOAN_PAYEE_UPDATE] UPDATE_LOAN_PAYEE_FAILURE';
export const UPDATE_LOAN_PAYEE_RESET = '[LOAN_PAYEE_UPDATE] UPDATE_LOAN_PAYEE_RESET';
export const SUBMIT_LOAN_PAYEE = '[LOAN_PAYEE_UPDATE] SUBMIT_LOAN_PAYEE';
export const REFUND_LOAN_PAYEE = '[LOAN_PAYEE_UPDATE] REFUND_LOAN_PAYEE';
export const DISBURSE_PAYEE = '[LOAN_PAYEE_UPDATE] DISBURSE_PAYEE';

export class UpdateLoanPayee implements Action {
  readonly type = UPDATE_LOAN_PAYEE;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanPayeeLoading implements Action {
  readonly type = UPDATE_LOAN_PAYEE_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanPayeeSuccess implements Action {
  readonly type = UPDATE_LOAN_PAYEE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanPayeeFailure implements Action {
  readonly type = UPDATE_LOAN_PAYEE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateLoanPayeeReset implements Action {
  readonly type = UPDATE_LOAN_PAYEE_RESET;

  constructor(public payload?: any) {
  }
}

export class SubmitLoanPayee implements Action {
  readonly type = SUBMIT_LOAN_PAYEE;

  constructor(public payload?: any) {
  }
}

export class DisbursePayee implements Action {
  readonly type = DISBURSE_PAYEE;

  constructor(public payload?: any) {
  }
}

export class RefundLoanPayee implements Action {
  readonly type = REFUND_LOAN_PAYEE;

  constructor(public payload?: any) {
  }
}

export type LoanPayeeUpdateActions =
  UpdateLoanPayee
  | UpdateLoanPayeeLoading
  | UpdateLoanPayeeSuccess
  | UpdateLoanPayeeFailure
  | UpdateLoanPayeeReset
  | SubmitLoanPayee
  | RefundLoanPayee
  | DisbursePayee
