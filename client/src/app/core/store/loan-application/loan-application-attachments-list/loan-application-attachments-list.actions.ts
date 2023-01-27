import { Action } from '@ngrx/store';

export const LOAD_LOAN_APP_ATTACHMENTS = '[LOAN_APP_ATTACHMENT_LIST] LOAD_LOAN_APP_ATTACHMENTS';
export const LOAD_LOAN_APP_ATTACHMENTS_SUCCESS = '[LOAN_APP_ATTACHMENT_LIST] LOAD_LOAN_APP_ATTACHMENTS_SUCCESS';
export const LOAD_LOAN_APP_ATTACHMENTS_FAILURE = '[LOAN_APP_ATTACHMENT_LIST] LOAD_LOAN_APP_ATTACHMENTS_FAILURE';
export const LOADING_LOAN_APP_ATTACHMENTS = '[LOAN_APP_ATTACHMENT_LIST] LOADING_LOAN_APP_ATTACHMENTS';
export const RESET_LOAN_APP_ATTACHMENTS = '[LOAN_APP_ATTACHMENT_LIST] RESET_LOAN_APP_ATTACHMENTS';

export class LoadLoanAppAttachments implements Action {
  readonly type = LOAD_LOAN_APP_ATTACHMENTS;

  constructor(public payload: any) {
  }
}

export class LoadingLoanAppAttachments implements Action {
  readonly type = LOADING_LOAN_APP_ATTACHMENTS;
}

export class LoadLoanAppAttachmentsSuccess implements Action {
  readonly type = LOAD_LOAN_APP_ATTACHMENTS_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadLoanAppAttachmentsFailure implements Action {
  readonly type = LOAD_LOAN_APP_ATTACHMENTS_FAILURE;

  constructor(public payload: any) {
  }
}

export class ResetLoanAppAttachmentsFailure implements Action {
  readonly type = RESET_LOAN_APP_ATTACHMENTS;

  constructor(public payload: any) {
  }
}


export type LoanAppAttachmentListActions =
  LoadLoanAppAttachments
  | LoadingLoanAppAttachments
  | LoadLoanAppAttachmentsSuccess
  | LoadLoanAppAttachmentsFailure
  | ResetLoanAppAttachmentsFailure;
