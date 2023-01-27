import * as fromLoanAppCollateralUpdate from './loan-application-collateral-update.actions';

export interface ILoanAppCollateralUpdate {
  response: {};
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateCollateralState: ILoanAppCollateralUpdate = {
  response: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanAppCollateralUpdateReducer(state = initialUpdateCollateralState,
                                               action: fromLoanAppCollateralUpdate.LoanAppCollateralUpdateActions) {
  switch (action.type) {
    case fromLoanAppCollateralUpdate.UPDATE_COLLATERAL_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromLoanAppCollateralUpdate.UPDATE_COLLATERAL_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppCollateralUpdate.UPDATE_COLLATERAL_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving collateral data'
      });
    case fromLoanAppCollateralUpdate.UPDATE_COLLATERAL_RESET:
      return initialUpdateCollateralState;
    default:
      return state;
  }
};
