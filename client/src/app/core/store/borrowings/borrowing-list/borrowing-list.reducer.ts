import { ActionReducer } from '@ngrx/store';
import * as fromBorrowings from './borrowing-list.actions';

export interface IBorrowingList {
  borrowings: any[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  size: number;
  numberOfElements: number;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialBorrowingState: IBorrowingList = {
  borrowings: [],
  totalPages: 0,
  totalElements: 0,
  currentPage: 0,
  size: 0,
  numberOfElements: 0,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function borrowingListReducer(state = initialBorrowingState,
                                     action: fromBorrowings.BorrowingListActions) {
  switch (action.type) {
    case fromBorrowings.LOAD_BORROWINGS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromBorrowings.LOAD_BORROWINGS_SUCCESS:
      const borrowing = action.payload;
      return Object.assign({}, state, {
        borrowings: borrowing.content,
        totalPages: borrowing.totalPages,
        totalElements: borrowing.totalElements,
        size: borrowing.size,
        currentPage: borrowing.number,
        numberOfElements: borrowing.numberOfElements,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromBorrowings.LOAD_BORROWINGS_FAILURE:
      return Object.assign({}, state, {
        borrowings: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting loan application list'
      });
    default:
      return state;
  }
};
