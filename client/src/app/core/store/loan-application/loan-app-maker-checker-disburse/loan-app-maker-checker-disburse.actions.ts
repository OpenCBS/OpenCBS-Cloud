import { Action } from '@ngrx/store';

export const LOAD_LOAN_APP_MAKER_CHECKER_DISBURSE = '[LOAN_APP_MAKER_CHECKER_DISBURSE] LOAD_LOAN_APP_MAKER_CHECKER_DISBURSE';
export const LOADING_LOAN_APP_MAKER_CHECKER_DISBURSE = '[LOAN_APP_MAKER_CHECKER_DISBURSE] LOADING_LOAN_APP_MAKER_CHECKER_DISBURSE';
export const LOAD_LOAN_APP_MAKER_CHECKER_DISBURSE_SUCCESS = '[LOAN_APP_MAKER_CHECKER_DISBURSE] LOAD_LOAN_APP_MAKER_CHECKER_DISBURSE_SUCCESS';
export const LOAD_LOAN_APP_MAKER_CHECKER_DISBURSE_FAILURE = '[LOAN_APP_MAKER_CHECKER_DISBURSE] LOAD_LOAN_APP_MAKER_CHECKER_DISBURSE_FAILURE';
export const RESET_LOAN_APP_MAKER_CHECKER_DISBURSE = '[LOAN_APP_MAKER_CHECKER_DISBURSE] RESET_LOAN_APP_MAKER_CHECKER_DISBURSE';

export class LoadLoanAppMakerCheckerDisburse implements Action {
  readonly type = LOAD_LOAN_APP_MAKER_CHECKER_DISBURSE;

  constructor(public payload: any) {
  }
}

export class LoadingLoanAppMakerCheckerDisburse implements Action {
  readonly type = LOADING_LOAN_APP_MAKER_CHECKER_DISBURSE;
}

export class LoadLoanAppMakerCheckerDisburseSuccess implements Action {
  readonly type = LOAD_LOAN_APP_MAKER_CHECKER_DISBURSE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadLoanAppMakerCheckerDisburseFailure implements Action {
  readonly type = LOAD_LOAN_APP_MAKER_CHECKER_DISBURSE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetLoanAppMakerCheckerDisburse implements Action {
  readonly type = RESET_LOAN_APP_MAKER_CHECKER_DISBURSE;

  constructor(public payload?: any) {
  }
}

export type LoanAppMakerCheckerDisburseActions =
  LoadLoanAppMakerCheckerDisburse
  | LoadingLoanAppMakerCheckerDisburse
  | LoadLoanAppMakerCheckerDisburseSuccess
  | LoadLoanAppMakerCheckerDisburseFailure
  | ResetLoanAppMakerCheckerDisburse;
