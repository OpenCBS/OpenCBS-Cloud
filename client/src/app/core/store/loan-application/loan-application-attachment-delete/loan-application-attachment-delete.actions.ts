import { Action } from '@ngrx/store';

export const DELETE_LOAN_APP_ATTACH = '[LOAN_APP_ATTACH_DELETE] DELETE_LOAN_APP_ATTACH';
export const DELETE_LOAN_APP_ATTACH_LOADING = '[LOAN_APP_ATTACH_DELETE] DELETE_LOAN_APP_ATTACH_LOADING';
export const DELETE_LOAN_APP_ATTACH_SUCCESS = '[LOAN_APP_ATTACH_DELETE] DELETE_LOAN_APP_ATTACH_SUCCESS';
export const DELETE_LOAN_APP_ATTACH_FAILURE = '[LOAN_APP_ATTACH_DELETE] DELETE_LOAN_APP_ATTACH_FAILURE';
export const DELETE_LOAN_APP_ATTACH_RESET = '[LOAN_APP_ATTACH_DELETE] DELETE_LOAN_APP_ATTACH_RESET';

export class DeleteLoanApplicationAttachment implements Action {
  readonly type = DELETE_LOAN_APP_ATTACH;

  constructor(public payload: any) {
  }
}

export class DeleteLoanApplicationAttachmentLoading implements Action {
  readonly type = DELETE_LOAN_APP_ATTACH_LOADING;
}

export class DeleteLoanApplicationAttachmentSuccess implements Action {
  readonly type = DELETE_LOAN_APP_ATTACH_SUCCESS;
}

export class DeleteLoanApplicationAttachmentFailure implements Action {
  readonly type = DELETE_LOAN_APP_ATTACH_FAILURE;

  constructor(public payload: any) {
  }
}

export class DeleteLoanApplicationAttachmentReset implements Action {
  readonly type = DELETE_LOAN_APP_ATTACH_RESET;
}

export type LoanApplicationAttachmentDelActions =
  DeleteLoanApplicationAttachment
  | DeleteLoanApplicationAttachmentLoading
  | DeleteLoanApplicationAttachmentSuccess
  | DeleteLoanApplicationAttachmentFailure
  | DeleteLoanApplicationAttachmentReset;
