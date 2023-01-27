import * as fromLoanAppCollateral from './loan-application-collateral.actions';

export interface ILoanAppCollateral {
  collateral: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanAppCollateralState: ILoanAppCollateral = {
  collateral: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanAppCollateralReducer(state = initialLoanAppCollateralState,
                                         action: fromLoanAppCollateral.LoanAppCollateralActions) {
  switch (action.type) {
    case fromLoanAppCollateral.LOADING_COLLATERAL:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanAppCollateral.LOAD_COLLATERAL_SUCCESS:
      return Object.assign({}, state, {
        collateral: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppCollateral.LOAD_COLLATERAL_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting collateral'
      });
    case fromLoanAppCollateral.RESET_COLLATERAL:
      return initialLoanAppCollateralState;
    default:
      return state;
  }
};
