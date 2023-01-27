import * as fromMakerCheckerRole from './role-maker-checker.actions';

export interface RoleMakerCheckerState {
  role: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialRoleMakerCheckerState: RoleMakerCheckerState = {
  role: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};


export function roleMakerCheckerReducer(state = initialRoleMakerCheckerState,
                            action: fromMakerCheckerRole.RoleMakerCheckerActions) {
  switch (action.type) {
    case fromMakerCheckerRole.LOADING_ROLE_MAKER_CHECKER:
      return Object.assign({}, state, {
        loading: true
      });
    case fromMakerCheckerRole.LOAD_ROLE_MAKER_CHECKER_SUCCESS:
      return Object.assign({}, state, {
        role: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromMakerCheckerRole.ROLE_MAKER_CHECKER_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromMakerCheckerRole.LOAD_ROLE_MAKER_CHECKER_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting role Maker/Checker'
      });
    case fromMakerCheckerRole.RESET_ROLE_MAKER_CHECKER:
      return initialRoleMakerCheckerState;
    default:
      return state;
  }
}
