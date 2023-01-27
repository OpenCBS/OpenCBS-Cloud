import { Action } from '@ngrx/store';

export const UPDATE_SYSTEM_SETTING = '[SYSTEM_SETTING] UPDATE_SYSTEM_SETTING';
export const UPDATE_SYSTEM_SETTING_LOADING = '[SYSTEM_SETTING] UPDATE_SYSTEM_SETTING_LOADING';
export const UPDATE_SYSTEM_SETTING_SUCCESS = '[SYSTEM_SETTING] UPDATE_SYSTEM_SETTING_SUCCESS';
export const UPDATE_SYSTEM_SETTING_FAILURE = '[SYSTEM_SETTING] UPDATE_SYSTEM_SETTING_FAILURE';
export const UPDATE_SYSTEM_SETTING_RESET = '[SYSTEM_SETTING] UPDATE_SYSTEM_SETTING_RESET';

export class UpdateSystemSetting implements Action {
  readonly type = UPDATE_SYSTEM_SETTING;

  constructor(public payload?: any) {
  }
}

export class UpdateSystemSettingLoading implements Action {
  readonly type = UPDATE_SYSTEM_SETTING_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateSystemSettingSuccess implements Action {
  readonly type = UPDATE_SYSTEM_SETTING_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateSystemSettingFailure implements Action {
  readonly type = UPDATE_SYSTEM_SETTING_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateSystemSettingReset implements Action {
  readonly type = UPDATE_SYSTEM_SETTING_RESET;

  constructor(public payload?: any) {
  }
}

export type SystemSettingUpdateActions =
  UpdateSystemSetting |
  UpdateSystemSettingLoading |
  UpdateSystemSettingSuccess |
  UpdateSystemSettingFailure |
  UpdateSystemSettingReset;
