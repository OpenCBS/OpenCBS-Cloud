import {
  Bond,
  BondFormState,
  BondProduct
} from './bond-form.interfaces';
import * as fromBondForm from './bond-form.actions';

const initialFormState: BondFormState = {
  changed: false,
  valid: false,
  data: <Bond>{},
  currentRoute: '',
  state: '',
  breadcrumb: [],
  loaded: false,
  bondProduct: <BondProduct>{},
  profile: {},
  id: null
};

export function bondFormReducer(state = initialFormState,
                                action: fromBondForm.BondFormActions) {
  switch (action.type) {

    case fromBondForm.BOND_POPULATE:
      return Object.assign(
        {},
        state,
        {
          changed: false,
          valid: action.payload.valid,
          data: action.payload.data,
          loaded: true,
          bondProduct: action.payload.bondProduct || action.payload.data.bondProduct || state.bondProduct,
          bondId: action.payload.data.bondId
        });

    case fromBondForm.BOND_SET_PRODUCT:
      return Object.assign(
        {},
        state,
        {
          bondProduct: action.payload.product,
        });

    case fromBondForm.BOND_SET_ROUTE:
      return Object.assign(
        {},
        state,
        {
          currentRoute: action.payload
        });

    case fromBondForm.BOND_SET_STATE:
      return Object.assign(
        {},
        state,
        {
          state: action.payload
        });

    case fromBondForm.BOND_FORM_RESET:
      return initialFormState;

    case fromBondForm.BOND_SET_LOADED:
      return Object.assign(
        {},
        state,
        {
          loaded: true
        });

    case fromBondForm.BOND_SET_VALIDITY:
      return Object.assign(
        {},
        state,
        {
          valid: action.payload.valid
        });

    case fromBondForm.BOND_SET_PROFILE:
      return Object.assign(
        {},
        state,
        {
          profile: action.payload
        });
    default:
      return state;
  }
}
