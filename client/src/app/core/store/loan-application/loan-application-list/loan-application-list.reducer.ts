import * as fromLoanApps from './loan-application-list.actions';

export interface ILoanAppList {
  loan_applications: any[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  numberOfElements: number;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanApplicationState: ILoanAppList = {
  loan_applications: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  size: 0,
  numberOfElements: 0,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanApplicationListReducer(state = initialLoanApplicationState,
                                           action: fromLoanApps.LoanApplicationListActions) {
  switch (action.type) {
    case fromLoanApps.LOAD_LOAN_APPLICATIONS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanApps.LOAD_LOAN_APPLICATIONS_SUCCESS:
      const loan_application = action.payload;
      return Object.assign({}, state, {
        loan_applications: loan_application.content,
        totalPages: loan_application.totalPages,
        totalElements: loan_application.totalElements,
        size: loan_application.size,
        currentPage: loan_application.number,
        numberOfElements: loan_application.numberOfElements,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanApps.LOAD_LOAN_APPLICATIONS_FAILURE:
      return Object.assign({}, state, {
        loan_applications: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting loan application list'
      });
    default:
      return state;
  }
}
