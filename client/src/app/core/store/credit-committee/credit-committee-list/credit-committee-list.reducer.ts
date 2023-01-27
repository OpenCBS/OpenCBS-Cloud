import { ActionReducer } from '@ngrx/store';
import * as fromCCList from './credit-committee-list.actions'

export interface CCRulesListState {
  cc_rules: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCCRulesListState: CCRulesListState = {
  cc_rules: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function ccRulesListReducer(state = initialCCRulesListState,
                                   action: fromCCList.CCRulesListActions) {
  switch (action.type) {
    case fromCCList.LOADING_CC_RULES:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCCList.LOAD_CC_RULES_SUCCESS:
      return Object.assign({}, state, {
        cc_rules: action.payload,
        loaded: true,
        loading: false,
        error: false,
        errorMessage: ''
      });
    case fromCCList.LOAD_CC_RULES_FAILURE:
      return Object.assign({}, state, {
        cc_rules: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting credit committee rules list'
      });
    default:
      return state;
  }
};

