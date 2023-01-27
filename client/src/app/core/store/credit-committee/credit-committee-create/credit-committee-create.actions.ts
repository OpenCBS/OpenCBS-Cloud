import { Action } from '@ngrx/store';

export const CREATE_CC_RULE = '[CC_RULES] CREATE_CC_RULE';
export const CREATE_CC_RULE_LOADING = '[CC_RULES] CREATE_CC_RULE_LOADING';
export const CREATE_CC_RULE_SUCCESS = '[CC_RULES] CREATE_CC_RULE_SUCCESS';
export const CREATE_CC_RULE_FAILURE = '[CC_RULES] CREATE_CC_RULE_FAILURE';
export const CREATE_CC_RULE_RESET = '[CC_RULES] CREATE_CC_RULE_RESET';

export class CreateCCRule implements Action {
  readonly type = CREATE_CC_RULE;

  constructor(public payload: any) {
  }
}

export class CreateCCRuleLoading implements Action {
  readonly type = CREATE_CC_RULE_LOADING;
}

export class CreateCCRuleSuccess implements Action {
  readonly type = CREATE_CC_RULE_SUCCESS;

  constructor(public payload: any) {
  }
}

export class CreateCCRuleFailure implements Action {
  readonly type = CREATE_CC_RULE_FAILURE;

  constructor(public payload: any) {
  }
}

export class CreateCCRuleReset implements Action {
  readonly type = CREATE_CC_RULE_RESET;
}

export type CCRuleCreateActions = CreateCCRule | CreateCCRuleLoading | CreateCCRuleSuccess | CreateCCRuleFailure | CreateCCRuleReset;
