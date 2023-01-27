import { Action } from '@ngrx/store';

export const LOAD_CC_RULES_INFO = '[CC_RULES] LOAD_CC_RULES_INFO';
export const LOADING_CC_RULES_INFO = '[CC_RULES] LOADING_CC_RULES_INFO';
export const LOAD_CC_RULES_INFO_SUCCESS = '[CC_RULES] LOAD_CC_RULES_INFO_SUCCESS';
export const LOAD_CC_RULES_INFO_FAILURE = '[CC_RULES] LOAD_CC_RULES_INFO_FAILURE';
export const RESET_CC_RULES_INFO = '[CC_RULES] RESET_CC_RULES_INFO';

export class LoadCCRulesInfo implements Action {
  readonly type = LOAD_CC_RULES_INFO;

  constructor(public payload?: any) {
  }
}

export class LoadingCCRulesInfo implements Action {
  readonly type = LOADING_CC_RULES_INFO;
}

export class LoadCCRulesInfoSuccess implements Action {
  readonly type = LOAD_CC_RULES_INFO_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadCCRulesInfoFailure implements Action {
  readonly type = LOAD_CC_RULES_INFO_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetCCRulesInfo implements Action {
  readonly type = RESET_CC_RULES_INFO;
}

export type CCRulesInfoActions = LoadCCRulesInfo | LoadingCCRulesInfo | LoadCCRulesInfoSuccess | LoadCCRulesInfoFailure | ResetCCRulesInfo;
