import { ActionReducer } from '@ngrx/store';
import * as fromCCCreate from './credit-committee-create.actions'

export interface CreateCCRuleState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateCCRuleState: CreateCCRuleState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function ccRuleCreateReducer(state = initialCreateCCRuleState,
                                    action: fromCCCreate.CCRuleCreateActions) {
  switch (action.type) {
    case fromCCCreate.CREATE_CC_RULE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCCCreate.CREATE_CC_RULE_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromCCCreate.CREATE_CC_RULE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new credit committee rule data'
      });
    case fromCCCreate.CREATE_CC_RULE_RESET:
      return initialCreateCCRuleState;
    default:
      return state;
  }
};
