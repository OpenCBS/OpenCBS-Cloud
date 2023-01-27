import * as fromCurrentAccountListActions from './current-account-list.actions';

export interface ICurrentAccountList {
  currentAccounts: any[],
  loading: boolean,
  loaded: boolean,
  success: boolean,
  error: boolean,
  errorMessage: ''
}

const initialCurrentAccountListState: ICurrentAccountList = {
  currentAccounts: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function currentAccountListReducer(state = initialCurrentAccountListState,
                                          action: fromCurrentAccountListActions.CurrentAccountListActions) {
  switch (action.type) {
    case fromCurrentAccountListActions.LOADING_CURRENT_ACCOUNTS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromCurrentAccountListActions.LOAD_CURRENT_ACCOUNTS_SUCCESS:
      return Object.assign({}, state, {
        currentAccounts: action.payload,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromCurrentAccountListActions.LOAD_CURRENT_ACCOUNTS_FAILURE:
      return Object.assign({}, state, {
        currentAccounts: [],
        loaded: true,
        loading: false,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting profiles'
      });
    default:
      return state;
  }
}
