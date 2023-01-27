import { ActionReducer } from '@ngrx/store';
import * as fromBorrowing from './borrowing.actions';

export interface IBorrowingState {
  borrowing: Object;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialBorrowingState: IBorrowingState = {
  borrowing: {},
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function borrowingReducer(state = initialBorrowingState,
                                 action: fromBorrowing.BorrowingActions) {
  switch (action.type) {
    case fromBorrowing.LOADING_BORROWING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromBorrowing.LOAD_BORROWING_SUCCESS:
      return Object.assign({}, state, {
        borrowing: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromBorrowing.BORROWING_SET_BREADCRUMB:
      return Object.assign({}, state, {
        breadcrumb: action.payload
      });
    case fromBorrowing.LOAD_BORROWING_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Oops something went wrong!'
      });
    case fromBorrowing.RESET_BORROWING:
      return initialBorrowingState;
    default:
      return state;
  }
};
