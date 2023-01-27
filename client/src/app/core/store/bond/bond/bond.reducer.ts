import * as fromBond from './bond.actions';
import { Bond } from '../bond-form';

export interface BondState {
  bond: Bond;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialBondState: BondState = {
  bond: <Bond>{},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function bondReducer(state = initialBondState,
                            action: fromBond.BondActions) {
  switch (action.type) {
    case fromBond.LOADING_BOND:
      return Object.assign({}, state, {
        loading: true
      });
    case fromBond.LOAD_BOND_SUCCESS:
      return Object.assign({}, state, {
        bond: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromBond.BOND_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromBond.LOAD_BOND_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting bonds'
      });
    case fromBond.RESET_BOND:
      return initialBondState;
    default:
      return state;
  }
};
