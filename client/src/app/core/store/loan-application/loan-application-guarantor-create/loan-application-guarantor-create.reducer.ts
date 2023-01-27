import * as fromLoanAppGuarantorCreate from './loan-application-guarantor-create.actions';

export interface ILoanAppGuarantorCreate {
  response: {};
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateGuarantorState: ILoanAppGuarantorCreate = {
  response: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanAppCreateGuarantorReducer(state = initialCreateGuarantorState,
                                              action: fromLoanAppGuarantorCreate.LoanAppGuarantorCreateActions) {
  switch (action.type) {
    case fromLoanAppGuarantorCreate.CREATE_GUARANTOR_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanAppGuarantorCreate.CREATE_GUARANTOR_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppGuarantorCreate.CREATE_GUARANTOR_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving guarantor'
      });
    case fromLoanAppGuarantorCreate.CREATE_GUARANTOR_RESET:
      return initialCreateGuarantorState;
    default:
      return state;
  }
}
