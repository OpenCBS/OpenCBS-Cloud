import { ActionReducer } from '@ngrx/store';
import * as fromCCEdit from './credit-committee-edit.actions'


export interface UpdateCCRulesState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateCCRulesState: UpdateCCRulesState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function ccRulesUpdateReducer(state = initialUpdateCCRulesState,
                                     action: fromCCEdit.CCRulesUpdateActions) {
  switch (action.type) {
    case fromCCEdit.UPDATE_CC_RULE_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCCEdit.UPDATE_CC_RULE_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromCCEdit.UPDATE_CC_RULE_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new credit committee rules data'
      });
    case fromCCEdit.UPDATE_CC_RULE_RESET:
      return initialUpdateCCRulesState;
    default:
      return state;
  }
};
