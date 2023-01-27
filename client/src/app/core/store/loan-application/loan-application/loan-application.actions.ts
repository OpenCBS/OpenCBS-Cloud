import { Action } from '@ngrx/store';

export const LOAD_LOAN_APPLICATION = '[LOAN_APPLICATION] LOAD_LOAN_APPLICATION';
export const LOADING_LOAN_APPLICATION = '[LOAN_APPLICATION] LOADING_LOAN_APPLICATION';
export const LOAD_LOAN_APPLICATION_SUCCESS = '[LOAN_APPLICATION] LOAD_LOAN_APPLICATION_SUCCESS';
export const LOAD_LOAN_APPLICATION_FAILURE = '[LOAN_APPLICATION] LOAD_LOAN_APPLICATION_FAILURE';
export const RESET_LOAN_APPLICATION = '[LOAN_APPLICATION] RESET_LOAN_APPLICATION';
export const CHANGE_CC_STATUS = '[LOAN_APPLICATION] CHANGE_CC_STATUS';
export const SUBMIT_LOAN_APPLICATION = '[LOAN_APPLICATION] SUBMIT_LOAN_APPLICATION';
export const DISBURSE_LOAN_APPLICATION = '[LOAN_APPLICATION] DISBURSE_LOAN_APPLICATION';

export class LoadLoanApplication implements Action {
  readonly type = LOAD_LOAN_APPLICATION;

  constructor(public payload: any) {
  }
}

export class LoadingLoanApplication implements Action {
  readonly type = LOADING_LOAN_APPLICATION;
}

export class LoadLoanApplicationSuccess implements Action {
  readonly type = LOAD_LOAN_APPLICATION_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadLoanApplicationFailure implements Action {
  readonly type = LOAD_LOAN_APPLICATION_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetLoanApplication implements Action {
  readonly type = RESET_LOAN_APPLICATION;

  constructor(public payload?: any) {
  }
}

export class ChangeCCStatus implements Action {
  readonly type = CHANGE_CC_STATUS;

  constructor(public payload?: any) {
  }
}

export class SubmitLoanApp implements Action {
  readonly type = SUBMIT_LOAN_APPLICATION;

  constructor(public payload?: any) {
  }
}

export class DisburseLoanApp implements Action {
  readonly type = DISBURSE_LOAN_APPLICATION;

  constructor(public payload?: any) {
  }
}

export type LoanApplicationActions =
  LoadLoanApplication
  | LoadingLoanApplication
  | LoadLoanApplicationSuccess
  | LoadLoanApplicationFailure
  | ResetLoanApplication
  | ChangeCCStatus
  | SubmitLoanApp
  | DisburseLoanApp;
