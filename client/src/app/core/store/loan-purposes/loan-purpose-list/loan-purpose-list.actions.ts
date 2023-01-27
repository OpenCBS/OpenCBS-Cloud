import { Action } from '@ngrx/store';

export const LOAD_LOAN_PURPOSES = '[LOAN_PURPOSE_LIST] LOAD_LOAN_PURPOSES';
export const LOAD_LOAN_PURPOSES_SUCCESS = '[LOAN_PURPOSE_LIST] LOAD_LOAN_PURPOSES_SUCCESS';
export const LOAD_LOAN_PURPOSES_FAILURE = '[LOAN_PURPOSE_LIST] LOAD_LOAN_PURPOSES_FAILURE';
export const LOADING_LOAN_PURPOSES = '[LOAN_PURPOSE_LIST] LOADING_LOAN_PURPOSES';

export class LoadLoanPurposes implements Action {
  readonly type = LOAD_LOAN_PURPOSES;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanPurposes implements Action {
  readonly type = LOADING_LOAN_PURPOSES;

  constructor(public payload?: any) {
  }
}

export class LoadLoanPurposesSuccess implements Action {
  readonly type = LOAD_LOAN_PURPOSES_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanPurposesFailure implements Action {
  readonly type = LOAD_LOAN_PURPOSES_FAILURE;

  constructor(public payload?: any) {
  }
}

export type LoanPurposeListActions = LoadLoanPurposes | LoadingLoanPurposes | LoadLoanPurposesSuccess | LoadLoanPurposesFailure;
