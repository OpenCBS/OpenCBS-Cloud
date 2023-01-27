import * as fromLoanAppCollateralDel from './loan-app-collateral-delete.actions';

export interface ILoanAppCollateralDelete {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialDeleteLoanAppCollateralState: ILoanAppCollateralDelete = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanAppCollateralDelReducer(state = initialDeleteLoanAppCollateralState,
                                            action: fromLoanAppCollateralDel.LoanAppCollateralDelActions) {
  switch (action.type) {
    case fromLoanAppCollateralDel.DELETE_LOAN_APP_COLLATERAL_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanAppCollateralDel.DELETE_LOAN_APP_COLLATERAL_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppCollateralDel.DELETE_LOAN_APP_COLLATERAL_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error deleting file'
      });
    case fromLoanAppCollateralDel.DELETE_LOAN_APP_COLLATERAL_RESET:
      return initialDeleteLoanAppCollateralState;
    default:
      return state;
  }
};
