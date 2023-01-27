import { Action } from '@ngrx/store';

export const DELETE_LOAN_ATTACH = '[LOAN_ATTACH_DELETE] DELETE_LOAN_ATTACH';
export const DELETE_LOAN_ATTACH_LOADING = '[LOAN_ATTACH_DELETE] DELETE_LOAN_ATTACH_LOADING';
export const DELETE_LOAN_ATTACH_SUCCESS = '[LOAN_ATTACH_DELETE] DELETE_LOAN_ATTACH_SUCCESS';
export const DELETE_LOAN_ATTACH_FAILURE = '[LOAN_ATTACH_DELETE] DELETE_LOAN_ATTACH_FAILURE';
export const DELETE_LOAN_ATTACH_RESET = '[LOAN_ATTACH_DELETE] DELETE_LOAN_ATTACH_RESET';


export class DeleteLoanAttachment implements Action {
  readonly type = DELETE_LOAN_ATTACH;

  constructor(public payload?: any) {
  }
}

export class DeleteLoanAttachmentLoading implements Action {
  readonly type = DELETE_LOAN_ATTACH_LOADING;

  constructor(public payload?: any) {
  }
}

export class DeleteLoanAttachmentSuccess implements Action {
  readonly type = DELETE_LOAN_ATTACH_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class DeleteLoanAttachmentFailure implements Action {
  readonly type = DELETE_LOAN_ATTACH_FAILURE;

  constructor(public payload?: any) {
  }
}

export class DeleteLoanAttachmentReset implements Action {
  readonly type = DELETE_LOAN_ATTACH_RESET;

  constructor(public payload?: any) {
  }
}

export type LoanAttachmentDelActions =
  DeleteLoanAttachment
  | DeleteLoanAttachmentLoading
  | DeleteLoanAttachmentSuccess
  | DeleteLoanAttachmentFailure
  | DeleteLoanAttachmentReset;
