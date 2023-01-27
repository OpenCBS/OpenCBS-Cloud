import { Action } from '@ngrx/store';

export const LOAD_LOAN_MAKER_CHECKER_ROLLBACK = '[LOAD_LOAN_MAKER_CHECKER_ROLLBACK] LOAD_LOAN_MAKER_CHECKER_ROLLBACK';
export const LOAN_MAKER_CHECKER_ROLLBACK_LOADING = '[LOAD_LOAN_MAKER_CHECKER_ROLLBACK] LOAN_MAKER_CHECKER_ROLLBACK_LOADING';
export const LOAN_MAKER_CHECKER_ROLLBACK_SUCCESS = '[LOAD_LOAN_MAKER_CHECKER_ROLLBACK] LOAN_MAKER_CHECKER_ROLLBACK_SUCCESS';
export const LOAN_MAKER_CHECKER_ROLLBACK_FAILURE = '[LOAD_LOAN_MAKER_CHECKER_ROLLBACK] LOAN_MAKER_CHECKER_ROLLBACK_FAILURE';
export const LOAN_MAKER_CHECKER_ROLLBACK_RESET = '[LOAD_LOAN_MAKER_CHECKER_ROLLBACK] LOAN_MAKER_CHECKER_ROLLBACK_RESET';

export class LoadLoanMakerCheckerRollback implements Action {
  readonly type = LOAD_LOAN_MAKER_CHECKER_ROLLBACK;
  constructor(public payload?: any) {
  }
}

export class LoanMakerCheckerRollbackLoading implements Action {
  readonly type = LOAN_MAKER_CHECKER_ROLLBACK_LOADING;

  constructor(public payload?: any) {
  }
}

export class LoanMakerCheckerRollbackSuccess implements Action {
  readonly type = LOAN_MAKER_CHECKER_ROLLBACK_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoanMakerCheckerRollbackFailure implements Action {
  readonly type = LOAN_MAKER_CHECKER_ROLLBACK_FAILURE;

  constructor(public payload?: any) {
  }
}

export class LoanMakerCheckerRollbackReset implements Action {
  readonly type = LOAN_MAKER_CHECKER_ROLLBACK_RESET;

  constructor(public payload?: any) {
  }
}

export type LoanMakerCheckerRollbackActions =
  LoadLoanMakerCheckerRollback
  | LoanMakerCheckerRollbackLoading
  | LoanMakerCheckerRollbackSuccess
  | LoanMakerCheckerRollbackFailure
  | LoanMakerCheckerRollbackReset;
