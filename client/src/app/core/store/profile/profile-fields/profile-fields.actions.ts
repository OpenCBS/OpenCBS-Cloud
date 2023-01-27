import { Action } from '@ngrx/store';

export const LOAD_PROFILE_FIELDS_META = '[PROFILE_FIELDS] LOAD_PROFILE_FIELDS_META';
export const LOADING_PROFILE_FIELDS_META = '[PROFILE_FIELDS] LOADING_PROFILE_FIELDS_META';
export const LOAD_PROFILE_FIELDS_META_SUCCESS = '[PROFILE_FIELDS] LOAD_PROFILE_FIELDS_META_SUCCESS';
export const LOAD_PROFILE_FIELDS_META_FAILURE = '[PROFILE_FIELDS] LOAD_PROFILE_FIELDS_META_FAILURE';
export const RESET_PROFILE_FIELDS_META = '[PROFILE_FIELDS] RESET_PROFILE_FIELDS_META';

export class LoadProfileFieldsMeta implements Action {
  readonly type = LOAD_PROFILE_FIELDS_META;

  constructor(public payload?: any) {
  }
}

export class LoadingProfileFieldsMeta implements Action {
  readonly type = LOADING_PROFILE_FIELDS_META;

  constructor(public payload?: any) {
  }
}

export class LoadProfileFieldsMetaSuccess implements Action {
  readonly type = LOAD_PROFILE_FIELDS_META_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadProfileFieldsMetaFailure implements Action {
  readonly type = LOAD_PROFILE_FIELDS_META_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetProfileFieldsMeta implements Action {
  readonly type = RESET_PROFILE_FIELDS_META;

  constructor(public payload?: any) {
  }
}

export type ProfileFieldsAction =
  LoadProfileFieldsMeta
  | LoadingProfileFieldsMeta
  | LoadProfileFieldsMetaSuccess
  | LoadProfileFieldsMetaFailure
  | ResetProfileFieldsMeta;
