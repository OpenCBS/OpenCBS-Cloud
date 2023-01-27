import * as fromAccountMakerChecker from './account-maker-checker.actions';


export interface AccountMakerCheckerState {
  account: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialAccountMakerCheckerState: AccountMakerCheckerState = {
  account: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function accountMakerCheckerReducer(state = initialAccountMakerCheckerState,
                                               action: fromAccountMakerChecker.AccountMakerCheckerActions) {
  switch (action.type) {
    case fromAccountMakerChecker.LOADING_ACCOUNT_MAKER_CHECKER:
      return Object.assign({}, state, {
        loading: true
      });
    case fromAccountMakerChecker.LOAD_ACCOUNT_MAKER_CHECKER_SUCCESS:
      return Object.assign({}, state, {
        account: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromAccountMakerChecker.ACCOUNT_MAKER_CHECKER_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromAccountMakerChecker.LOAD_ACCOUNT_MAKER_CHECKER_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting account maker/checker'
      });
    case fromAccountMakerChecker.RESET_ACCOUNT_MAKER_CHECKER:
      return initialAccountMakerCheckerState;
    default:
      return state;
  }
};
