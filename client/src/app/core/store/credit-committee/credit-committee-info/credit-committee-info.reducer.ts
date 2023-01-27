import { ActionReducer } from '@ngrx/store';
import * as fromCCInfo from './credit-committee-info.actions'


export interface CCRulesInfoState {
  ccRules: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCCRulesInfoState: CCRulesInfoState = {
  ccRules: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function ccRulesInfoReducer(state = initialCCRulesInfoState,
                                   action: fromCCInfo.CCRulesInfoActions) {
  switch (action.type) {
    case fromCCInfo.LOADING_CC_RULES_INFO:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCCInfo.LOAD_CC_RULES_INFO_SUCCESS:
      return Object.assign({}, state, {
        ccRules: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromCCInfo.LOAD_CC_RULES_INFO_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting credit committee'
      });
    case fromCCInfo.RESET_CC_RULES_INFO:
      return initialCCRulesInfoState;
    default:
      return state;
  }
};
