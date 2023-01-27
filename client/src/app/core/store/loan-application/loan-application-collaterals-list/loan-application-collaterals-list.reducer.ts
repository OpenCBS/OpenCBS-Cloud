import * as fromLoanAppCollateralList from './loan-application-collaterals-list.actions';

export interface ILoanAppCollateralList {
  collaterals: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialLoanAppCollateralsState: ILoanAppCollateralList = {
  collaterals: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanAppCollateralsListReducer(state = initialLoanAppCollateralsState,
                                              action: fromLoanAppCollateralList.LoanAppCollateralsListActions) {
  switch (action.type) {
    case fromLoanAppCollateralList.LOADING_COLLATERALS:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromLoanAppCollateralList.LOAD_COLLATERALS_SUCCESS:
      return Object.assign({}, state, {
        collaterals: action.payload,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppCollateralList.LOAD_COLLATERALS_FAILURE:
      return Object.assign({}, state, {
        collaterals: [],
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting loan application collateral list'
      });
    default:
      return state;
  }
}
