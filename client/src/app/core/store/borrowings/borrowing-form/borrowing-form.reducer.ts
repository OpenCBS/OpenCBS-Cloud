import { ActionReducer } from '@ngrx/store';
import {
  IBorrowingFormData,
  IBorrowingFormState,
  IBorrowingProduct
} from './borrowing-form.interfaces';
import * as fromBorrowingForm from './borrowing-form.actions';

const initialFormState: IBorrowingFormState = {
  changed: false,
  valid: false,
  data: <IBorrowingFormData>{},
  currentRoute: '',
  state: '',
  breadcrumb: [],
  loaded: false,
  borrowingProduct: <IBorrowingProduct>{},
  profile: {},
  id: null
};

export function borrowingFormReducer(state = initialFormState,
                                     action: fromBorrowingForm.BorrowingFormActions) {
  switch (action.type) {
    case fromBorrowingForm.BORROWING_POPULATE:
      return Object.assign({}, state, {
        changed: false,
        valid: action.payload.valid,
        data: action.payload.data,
        loaded: true,
        borrowingProduct: action.payload.borrowingProduct || state.borrowingProduct,
        borrowingId: action.payload.data.borrowingId
      });
    case fromBorrowingForm.BORROWING_SET_ROUTE:
      return Object.assign({}, state, {
        currentRoute: action.payload
      });
    case fromBorrowingForm.BORROWING_SET_STATE:
      return Object.assign({}, state, {
        state: action.payload
      });
    case fromBorrowingForm.BORROWING_FORM_RESET:
      return initialFormState;
    case fromBorrowingForm.BORROWING_SET_LOADED:
      return Object.assign({}, state, {
        loaded: true
      });
    case fromBorrowingForm.BORROWING_SET_VALIDITY:
      return Object.assign({}, state, {
        valid: action.payload.valid
      });
    case fromBorrowingForm.BORROWING_SET_PROFILE:
      return Object.assign({}, state, {
        profile: action.payload
      });
    default:
      return state;
  }
}
