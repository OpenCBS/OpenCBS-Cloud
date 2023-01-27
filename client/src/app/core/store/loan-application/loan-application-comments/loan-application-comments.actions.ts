import { Action } from '@ngrx/store';

export const LOAD_LOAN_APPLICATION_COMMENTS = '[LOAN_APPLICATION_COMMENTS] LOAD_LOAN_APPLICATION_COMMENTS';
export const LOAD_LOAN_APPLICATION_COMMENTS_SUCCESS = '[LOAN_APPLICATION_COMMENTS] LOAD_LOAN_APPLICATION_COMMENTS_SUCCESS';
export const LOAD_LOAN_APPLICATION_COMMENTS_FAILURE = '[LOAN_APPLICATION_COMMENTS] LOAD_LOAN_APPLICATION_COMMENTS_FAILURE';
export const LOADING_LOAN_APPLICATION_COMMENTS = '[LOAN_APPLICATION_COMMENTS] LOADING_LOAN_APPLICATION_COMMENTS';
export const SET_LOAN_APPLICATION_COMMENTS = '[LOAN_APPLICATION_COMMENTS] SET_LOAN_APPLICATION_COMMENTS';

export class LoadLoanApplicationComments implements Action {
  readonly type = LOAD_LOAN_APPLICATION_COMMENTS;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanApplicationComments implements Action {
  readonly type = LOADING_LOAN_APPLICATION_COMMENTS;
}

export class LoadLoanApplicationCommentsSuccess implements Action {
  readonly type = LOAD_LOAN_APPLICATION_COMMENTS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanApplicationCommentsFailure implements Action {
  readonly type = LOAD_LOAN_APPLICATION_COMMENTS_FAILURE;

  constructor(public payload?: any) {
  }
}

export class SetLoanApplicationComments implements Action {
  readonly type = SET_LOAN_APPLICATION_COMMENTS;

  constructor(public payload?: any) {
  }
}

export type LoanApplicationCommentsActions =
  LoadLoanApplicationComments |
  LoadingLoanApplicationComments |
  LoadLoanApplicationCommentsSuccess |
  LoadLoanApplicationCommentsFailure |
  SetLoanApplicationComments;
