import { Action } from '@ngrx/store';

export const UPDATE_CC_RULE = '[CC_RULES] UPDATE_CC_RULE';
export const UPDATE_CC_RULE_LOADING = '[CC_RULES] UPDATE_CC_RULE_LOADING';
export const UPDATE_CC_RULE_SUCCESS = '[CC_RULES] UPDATE_CC_RULE_SUCCESS';
export const UPDATE_CC_RULE_FAILURE = '[CC_RULES] UPDATE_CC_RULE_FAILURE';
export const UPDATE_CC_RULE_RESET = '[CC_RULES] UPDATE_CC_RULE_RESET';


export class UpdateCCRules implements Action {
  readonly type = UPDATE_CC_RULE;

  constructor(public payload?: any) {
  }
}

export class UpdateCCRulesLoading implements Action {
  readonly type = UPDATE_CC_RULE_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateCCRulesSuccess implements Action {
  readonly type = UPDATE_CC_RULE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateCCRulesFailure implements Action {
  readonly type = UPDATE_CC_RULE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateCCRulesReset implements Action {
  readonly type = UPDATE_CC_RULE_RESET;

  constructor(public payload?: any) {
  }
}

export type CCRulesUpdateActions = UpdateCCRules | UpdateCCRulesLoading | UpdateCCRulesSuccess | UpdateCCRulesFailure | UpdateCCRulesReset;
