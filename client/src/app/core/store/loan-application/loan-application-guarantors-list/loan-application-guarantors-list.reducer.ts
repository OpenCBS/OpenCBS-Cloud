import { ActionReducer } from '@ngrx/store';

import * as fromLoanAppGuarantors from './loan-application-guarantors-list.actions';

export interface ILoanAppGuarantorList {
  guarantors: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanAppGuarantorsState: ILoanAppGuarantorList = {
  guarantors: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanAppGuarantorsListReducer(state = initialLoanAppGuarantorsState,
                                             action: fromLoanAppGuarantors.LoanAppGuarantorsListActions) {
  switch (action.type) {
    case fromLoanAppGuarantors.LOADING_GUARANTORS:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromLoanAppGuarantors.LOAD_GUARANTORS_SUCCESS:
      return Object.assign({}, state, {
        guarantors: action.payload,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppGuarantors.LOAD_GUARANTORS_FAILURE:
      return Object.assign({}, state, {
        guarantors: [],
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting loan appGuarantors guarantors list'
      });
    default:
      return state;
  }
};
