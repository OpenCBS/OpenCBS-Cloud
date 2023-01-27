import { Action } from '@ngrx/store';

export const LOAD_LOAN_ATTACHMENT_LIST = '[LOAN_ATTACHMENT_LIST] LOAD_LOAN_ATTACHMENT_LIST';
export const LOADING_LOAN_ATTACHMENT_LIST = '[LOAN_ATTACHMENT_LIST] LOADING_LOAN_ATTACHMENT_LIST';
export const LOAD_LOAN_ATTACHMENT_LIST_SUCCESS = '[LOAN_ATTACHMENT_LIST] LOAD_LOAN_ATTACHMENT_LIST_SUCCESS';
export const LOAD_LOAN_ATTACHMENT_LIST_FAILURE = '[LOAN_ATTACHMENT_LIST] LOAD_LOAN_ATTACHMENT_LIST_FAILURE';

export class LoadLoanAttachmentList implements Action {
  readonly type = LOAD_LOAN_ATTACHMENT_LIST;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanAttachmentList implements Action {
  readonly type = LOADING_LOAN_ATTACHMENT_LIST;

  constructor(public payload?: any) {
  }
}

export class LoadLoanAttachmentListSuccess implements Action {
  readonly type = LOAD_LOAN_ATTACHMENT_LIST_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanAttachmentListFailure implements Action {
  readonly type = LOAD_LOAN_ATTACHMENT_LIST_FAILURE;

  constructor(public payload?: any) {
  }
}

export type LoanAttachmentListActions =
  LoadLoanAttachmentList
  | LoadingLoanAttachmentList
  | LoadLoanAttachmentListSuccess
  | LoadLoanAttachmentListFailure;
