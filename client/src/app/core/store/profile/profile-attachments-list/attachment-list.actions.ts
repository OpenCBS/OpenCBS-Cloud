import { Action } from '@ngrx/store';

export const LOAD_PROFILE_ATTACHMENTS = '[PROFILE_ATTACHMENT_LIST] LOAD_PROFILE_ATTACHMENTS';
export const LOAD_PROFILE_ATTACHMENTS_SUCCESS = '[PROFILE_ATTACHMENT_LIST] LOAD_PROFILE_ATTACHMENTS_SUCCESS';
export const LOAD_PROFILE_ATTACHMENTS_FAILURE = '[PROFILE_ATTACHMENT_LIST] LOAD_PROFILE_ATTACHMENTS_FAILURE';
export const LOADING_PROFILE_ATTACHMENTS = '[PROFILE_ATTACHMENT_LIST] LOADING_PROFILE_ATTACHMENTS';
export const RESET_PROFILE_ATTACHMENTS = '[PROFILE_ATTACHMENT_LIST] RESET_PROFILE_ATTACHMENTS';
export const PIN_PROFILE_ATTACHMENT = '[PROFILE_ATTACHMENT_LIST] PIN_PROFILE_ATTACHMENT';
export const UNPIN_PROFILE_ATTACHMENT = '[PROFILE_ATTACHMENT_LIST] UNPIN_PROFILE_ATTACHMENT';

export class LoadProfileAttachments implements Action {
  readonly type = LOAD_PROFILE_ATTACHMENTS;

  constructor(public payload?: any) {
  }
}

export class LoadingProfileAttachments implements Action {
  readonly type = LOADING_PROFILE_ATTACHMENTS;

  constructor(public payload?: any) {
  }
}

export class LoadProfileAttachmentsSuccess implements Action {
  readonly type = LOAD_PROFILE_ATTACHMENTS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadProfileAttachmentsFailure implements Action {
  readonly type = LOAD_PROFILE_ATTACHMENTS_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetProfileAttachments implements Action {
  readonly type = RESET_PROFILE_ATTACHMENTS;

  constructor(public payload?: any) {
  }
}

export class PinProfileAttachment implements Action {
  readonly type = PIN_PROFILE_ATTACHMENT;

  constructor(public payload?: any) {
  }
}

export class UnpinProfileAttachment implements Action {
  readonly type = UNPIN_PROFILE_ATTACHMENT;

  constructor(public payload?: any) {
  }
}

export type ProfileAttachmentListActions =
  LoadProfileAttachments
  | LoadingProfileAttachments
  | LoadProfileAttachmentsSuccess
  | LoadProfileAttachmentsFailure
  | ResetProfileAttachments
  | PinProfileAttachment
  | UnpinProfileAttachment;
