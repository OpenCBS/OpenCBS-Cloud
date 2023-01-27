import { ActionReducer } from '@ngrx/store';
import * as fromLoanAppGuarantor from './loan-application-guarantor.actions';


export interface ILoanAppGuarantor {
  guarantor: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanAppGuarantorState: ILoanAppGuarantor = {
  guarantor: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function loanAppGuarantorReducer(state = initialLoanAppGuarantorState,
                                        action: fromLoanAppGuarantor.LoanAppGuarantorActions) {
  switch (action.type) {
    case fromLoanAppGuarantor.LOAD_GUARANTOR:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanAppGuarantor.LOAD_GUARANTOR_SUCCESS:
      return Object.assign({}, state, {
        guarantor: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppGuarantor.LOAD_GUARANTOR_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting guarantor'
      });
    case fromLoanAppGuarantor.RESET_GUARANTOR:
      return initialLoanAppGuarantorState;
    default:
      return state;
  }
};
