import { Action } from '@ngrx/store';

export const DELETE_PROFILE_ATTACH = '[PROFILE_UPDATE] DELETE_PROFILE_ATTACH';
export const DELETE_PROFILE_ATTACH_LOADING = '[PROFILE_UPDATE] DELETE_PROFILE_ATTACH_LOADING';
export const DELETE_PROFILE_ATTACH_SUCCESS = '[PROFILE_UPDATE] DELETE_PROFILE_ATTACH_SUCCESS';
export const DELETE_PROFILE_ATTACH_FAILURE = '[PROFILE_UPDATE] DELETE_PROFILE_ATTACH_FAILURE';
export const DELETE_PROFILE_ATTACH_RESET = '[PROFILE_UPDATE] DELETE_PROFILE_ATTACH_RESET';

export class DeleteProfileAttachment implements Action {
  readonly type = DELETE_PROFILE_ATTACH;

  constructor(public payload?: any) {
  }
}

export class DeleteProfileAttachmentLoading implements Action {
  readonly type = DELETE_PROFILE_ATTACH_LOADING;

  constructor(public payload?: any) {
  }
}

export class DeleteProfileAttachmentSuccess implements Action {
  readonly type = DELETE_PROFILE_ATTACH_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class DeleteProfileAttachmentFailure implements Action {
  readonly type = DELETE_PROFILE_ATTACH_FAILURE;

  constructor(public payload?: any) {
  }
}

export class DeleteProfileAttachmentReset implements Action {
  readonly type = DELETE_PROFILE_ATTACH_RESET;

  constructor(public payload?: any) {
  }
}

export type ProfileAttachmentDelActions =
  DeleteProfileAttachment
  | DeleteProfileAttachmentLoading
  | DeleteProfileAttachmentSuccess
  | DeleteProfileAttachmentFailure
  | DeleteProfileAttachmentReset;
