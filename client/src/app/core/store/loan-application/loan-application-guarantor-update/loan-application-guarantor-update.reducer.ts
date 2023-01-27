import { ActionReducer } from '@ngrx/store';
import * as fromLoanAppGuarantorUpdate from './loan-application-guarantor-update.actions'

export interface ILoanAppGuarantorUpdate {
  response: {};
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateGuarantorState: ILoanAppGuarantorUpdate = {
  response: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanAppUpdateGuarantorReducer(state = initialUpdateGuarantorState,
                                              action: fromLoanAppGuarantorUpdate.LoanAppUpdateGuarantorActions) {
  switch (action.type) {
    case fromLoanAppGuarantorUpdate.UPDATE_GUARANTOR_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromLoanAppGuarantorUpdate.UPDATE_GUARANTOR_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppGuarantorUpdate.UPDATE_GUARANTOR_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving guarantor data'
      });
    case fromLoanAppGuarantorUpdate.UPDATE_GUARANTOR_RESET:
      return initialUpdateGuarantorState;
    default:
      return state;
  }
};
