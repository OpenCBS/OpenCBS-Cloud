import { Action } from '@ngrx/store';

export const LOAD_LOAN_PAYEE = '[LOAN_PAYEE] LOAD_LOAN_PAYEE';
export const LOADING_LOAN_PAYEE = '[LOAN_PAYEE] LOADING_LOAN_PAYEE';
export const LOAD_LOAN_PAYEE_SUCCESS = '[LOAN_PAYEE] LOAD_LOAN_PAYEE_SUCCESS';
export const LOAD_LOAN_PAYEE_FAILURE = '[LOAN_PAYEE] LOAD_LOAN_PAYEE_FAILURE';
export const RESET_LOAN_PAYEE = '[LOAN_PAYEE] RESET_LOAN_PAYEE';
export const LOAN_PAYEE_SET_BREADCRUMB = '[LOAN_PAYEE] LOAN_PAYEE_SET_BREADCRUMB';

export class LoadLoanPayee implements Action {
  readonly type = LOAD_LOAN_PAYEE;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanPayee implements Action {
  readonly type = LOADING_LOAN_PAYEE;
}

export class LoadLoanPayeeSuccess implements Action {
  readonly type = LOAD_LOAN_PAYEE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanPayeeFailure implements Action {
  readonly type = LOAD_LOAN_PAYEE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetLoanPayee implements Action {
  readonly type = RESET_LOAN_PAYEE;

  constructor(public payload?: any) {
  }
}

export class SetLoanPayeeBreadcrumb implements Action {
  readonly type = LOAN_PAYEE_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export type LoanPayeeActions =
  LoadLoanPayee
  | LoadingLoanPayee
  | LoadLoanPayeeSuccess
  | LoadLoanPayeeFailure
  | ResetLoanPayee
  | SetLoanPayeeBreadcrumb;
