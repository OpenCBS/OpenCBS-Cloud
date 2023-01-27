import * as fromBondCreateActions from './bond-create.actions';

export interface BondCreateState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
  response: any;
}

const initialCreateBondState: BondCreateState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: '',
  response: null
};

export function bondCreateReducer(state = initialCreateBondState,
                                  action: fromBondCreateActions.BondCreateActions) {
  switch (action.type) {
    case fromBondCreateActions.CREATE_BOND_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromBondCreateActions.CREATE_BOND_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        response: action.payload
      });
    case fromBondCreateActions.CREATE_BOND_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error bond new bond data',
        response: null
      });
    case fromBondCreateActions.CREATE_BOND_RESET:
      return initialCreateBondState;
    default:
      return state;
  }
}
