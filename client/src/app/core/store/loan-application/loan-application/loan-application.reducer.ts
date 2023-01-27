import * as fromLoanApp from './loan-application.actions';

export interface ILoanAppState {
  loanApplication: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanApplicationState: ILoanAppState = {
  loanApplication: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanApplicationReducer(state = initialLoanApplicationState,
                                       action: fromLoanApp.LoanApplicationActions) {
  switch (action.type) {
    case fromLoanApp.LOAD_LOAN_APPLICATION:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanApp.LOAD_LOAN_APPLICATION_SUCCESS:
      return {
        ...state,
        loanApplication: {
          ...action.payload,
          profile: {
            ...action.payload.profile,
            profileId: action.payload.profile.id,
            profileType: action.payload.profile.type,
            profileName: action.payload.profile.name,
            loanOfficer: action.payload.loanOfficer
          }
        },
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      };
    case fromLoanApp.LOAD_LOAN_APPLICATION_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan application'
      });
    case fromLoanApp.RESET_LOAN_APPLICATION:
      return initialLoanApplicationState;
    default:
      return state;
  }
}
