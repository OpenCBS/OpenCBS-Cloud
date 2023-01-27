import { Action } from '@ngrx/store';

export const LOAD_LOAN_MAKER_CHECKER_REPAYMENT = '[LOAN_MAKER_CHECKER_REPAYMENT] LOAD_LOAN_MAKER_CHECKER_REPAYMENT';
export const LOADING_LOAN_MAKER_CHECKER_REPAYMENT = '[LOAN_MAKER_CHECKER_REPAYMENT] LOADING_LOAN_MAKER_CHECKER_REPAYMENT';
export const LOAD_LOAN_MAKER_CHECKER_REPAYMENT_SUCCESS = '[LOAN_MAKER_CHECKER_REPAYMENT] LOAD_LOAN_MAKER_CHECKER_REPAYMENT_SUCCESS';
export const LOAD_LOAN_MAKER_CHECKER_REPAYMENT_FAILURE = '[LOAN_MAKER_CHECKER_REPAYMENT] LOAD_LOAN_MAKER_CHECKER_REPAYMENT_FAILURE';
export const RESET_LOAN_MAKER_CHECKER_REPAYMENT = '[LOAN_MAKER_CHECKER_REPAYMENT] RESET_LOAN_MAKER_CHECKER_REPAYMENT';

export class LoadLoanMakerCheckerRepayment implements Action {
  readonly type = LOAD_LOAN_MAKER_CHECKER_REPAYMENT;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanMakerCheckerRepayment implements Action {
  readonly type = LOADING_LOAN_MAKER_CHECKER_REPAYMENT;

  constructor(public payload?: any) {
  }
}

export class LoadLoanMakerCheckerRepaymentSuccess implements Action {
  readonly type = LOAD_LOAN_MAKER_CHECKER_REPAYMENT_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanMakerCheckerRepaymentFailure implements Action {
  readonly type = LOAD_LOAN_MAKER_CHECKER_REPAYMENT_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetLoanMakerCheckerRepayment implements Action {
  readonly type = RESET_LOAN_MAKER_CHECKER_REPAYMENT;

  constructor(public payload?: any) {
  }
}

export type LoanMakerCheckerRepaymentActions =
  LoadLoanMakerCheckerRepayment
  | LoadingLoanMakerCheckerRepayment
  | LoadLoanMakerCheckerRepaymentSuccess
  | LoadLoanMakerCheckerRepaymentFailure
  | ResetLoanMakerCheckerRepayment
