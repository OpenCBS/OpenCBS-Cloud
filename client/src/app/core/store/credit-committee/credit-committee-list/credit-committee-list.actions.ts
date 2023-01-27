import { Action } from '@ngrx/store';

export const LOAD_CC_RULES = '[CC_RULES] LOAD_CC_RULES';
export const LOAD_CC_RULES_SUCCESS = '[CC_RULES] LOAD_CC_RULES_SUCCESS';
export const LOAD_CC_RULES_FAILURE = '[CC_RULES] LOAD_CC_RULES_FAILURE';
export const LOADING_CC_RULES = '[CC_RULES] LOADING_CC_RULES';

export class LoadCCRules implements Action {
  readonly type = LOAD_CC_RULES;
}

export class LoadingCCRules implements Action {
  readonly type = LOADING_CC_RULES;
}

export class LoadCCRulesSuccess implements Action {
  readonly type = LOAD_CC_RULES_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadCCRulesFailure implements Action {
  readonly type = LOAD_CC_RULES_FAILURE;

  constructor(public payload: any) {
  }
}

export type CCRulesListActions = LoadCCRules | LoadingCCRules | LoadCCRulesSuccess | LoadCCRulesFailure;
