import * as fromLoanAppCollateralCreate from './loan-application-collateral-create.actions';

export interface ILoanAppCollateralCreate {
  response: {};
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateCollateralState: ILoanAppCollateralCreate = {
  response: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function loanAppCreateCollateralReducer(state = initialCreateCollateralState,
                                               action: fromLoanAppCollateralCreate.LoanAppCollateralCreateActions) {
  switch (action.type) {
    case fromLoanAppCollateralCreate.CREATE_COLLATERAL_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanAppCollateralCreate.CREATE_COLLATERAL_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanAppCollateralCreate.CREATE_COLLATERAL_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving collateral'
      });
    case fromLoanAppCollateralCreate.CREATE_COLLATERAL_RESET:
      return initialCreateCollateralState;
    default:
      return state;
  }
};
