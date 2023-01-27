import * as fromLoanMakerCheckerRollbackActions from './loan-maker-checker-rollback.actions';

export interface ILoanMakerCheckerRollback {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
  loanMakerCheckerRollback: any;
}

const initialLoanState: ILoanMakerCheckerRollback = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: '',
  loanMakerCheckerRollback: null
};

export function loanMakerCheckerRollbackReducer(state = initialLoanState,
                                                action: fromLoanMakerCheckerRollbackActions.LoanMakerCheckerRollbackActions) {
  switch (action.type) {
    case fromLoanMakerCheckerRollbackActions.LOAN_MAKER_CHECKER_ROLLBACK_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromLoanMakerCheckerRollbackActions.LOAN_MAKER_CHECKER_ROLLBACK_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        loanMakerCheckerRollback: action.payload
      });
    case fromLoanMakerCheckerRollbackActions.LOAN_MAKER_CHECKER_ROLLBACK_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan maker/checker rollback',
        loanMakerCheckerRollback: null
      });
    case fromLoanMakerCheckerRollbackActions.LOAN_MAKER_CHECKER_ROLLBACK_RESET:
      return initialLoanState;
    default:
      return state;
  }
}
