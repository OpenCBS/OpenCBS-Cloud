import { Action } from '@ngrx/store';

export const LOAD_SYSTEM_SETTING = '[SYSTEM_SETTING] LOAD_SYSTEM_SETTING';
export const LOADING_SYSTEM_SETTING = '[SYSTEM_SETTING] LOADING_SYSTEM_SETTING';
export const LOAD_SYSTEM_SETTING_SUCCESS = '[SYSTEM_SETTING] LOAD_SYSTEM_SETTING_SUCCESS';
export const LOAD_SYSTEM_SETTING_FAILURE = '[SYSTEM_SETTING] LOAD_SYSTEM_SETTING_FAILURE';
export const RESET_SYSTEM_SETTING = '[SYSTEM_SETTING] RESET_SYSTEM_SETTING';
export const SYSTEM_SETTING_SET_BREADCRUMB = '[SYSTEM_SETTING] SYSTEM_SETTING_SET_BREADCRUMB';

export class LoadSystemSetting implements Action {
  readonly type = LOAD_SYSTEM_SETTING;
  constructor(public payload?: any) {
  }
}

export class LoadingSystemSetting implements Action {
  readonly type = LOADING_SYSTEM_SETTING;
}

export class LoadSystemSettingSuccess implements Action {
  readonly type = LOAD_SYSTEM_SETTING_SUCCESS;
  constructor(public payload: any) {
  }
}

export class LoadSystemSettingFailure implements Action {
  readonly type = LOAD_SYSTEM_SETTING_FAILURE;
  constructor(public payload?: any) {
  }
}

export class ResetSystemSetting implements Action {
  readonly type = RESET_SYSTEM_SETTING;
  constructor(public payload?: any) {
  }
}

export class SetSystemSettingBreadcrumb implements Action {
  readonly type = SYSTEM_SETTING_SET_BREADCRUMB;
  constructor(public payload?: any) {
  }
}

export type SystemSettingActions =
  LoadSystemSetting
  | LoadingSystemSetting
  | LoadSystemSettingSuccess
  | LoadSystemSettingFailure
  | ResetSystemSetting
  | SetSystemSettingBreadcrumb;
