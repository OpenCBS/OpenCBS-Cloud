import * as fromBondUpdate from './bond-update.actions';

export interface IBondUpdateState {
  response: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateBondState: IBondUpdateState = {
  response: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function bondUpdateReducer(state = initialUpdateBondState,
                                  action: fromBondUpdate.BondUpdateActions) {
  switch (action.type) {
    case fromBondUpdate.UPDATE_BOND_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromBondUpdate.UPDATE_BOND_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromBondUpdate.UPDATE_BOND_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error bond new Bond'
      });
    case fromBondUpdate.UPDATE_BOND_RESET:
      return initialUpdateBondState;
    default:
      return state;
  }
};
