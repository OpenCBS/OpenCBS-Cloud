import * as fromLoanAppGuarantorDelete from './loan-app-guarantor-delete.actions';

export interface ILoanAppGuarantorDelete {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialDeleteLoanAppGuarantorState: ILoanAppGuarantorDelete = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanAppGuarantorDelReducer(state = initialDeleteLoanAppGuarantorState,
                                           action: fromLoanAppGuarantorDelete.LoanAppGuarantorDeleteActions) {
  switch (action.type) {
    case fromLoanAppGuarantorDelete.DELETE_LOAN_APP_GUARANTOR_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanAppGuarantorDelete.DELETE_LOAN_APP_GUARANTOR_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppGuarantorDelete.DELETE_LOAN_APP_GUARANTOR_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error deleting file'
      });
    case fromLoanAppGuarantorDelete.DELETE_LOAN_APP_GUARANTOR_RESET:
      return initialDeleteLoanAppGuarantorState;
    default:
      return state;
  }
};
