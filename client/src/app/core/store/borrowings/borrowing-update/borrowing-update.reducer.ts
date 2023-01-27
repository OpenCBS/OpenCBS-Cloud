import * as fromBorrowingUpdate from './borrowing-update.actions';

export interface IBorrowingUpdateState {
  response: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateBorrowingState: IBorrowingUpdateState = {
  response: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function borrowingUpdateReducer(state = initialUpdateBorrowingState,
                                       action: fromBorrowingUpdate.BorrowingUpdateActions) {
  switch (action.type) {
    case fromBorrowingUpdate.UPDATE_BORROWING_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromBorrowingUpdate.UPDATE_BORROWING_SUCCESS:
      return Object.assign({}, state, {
        response: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromBorrowingUpdate.UPDATE_BORROWING_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new Borrowing'
      });
    case fromBorrowingUpdate.UPDATE_BORROWING_RESET:
      return initialUpdateBorrowingState;
    default:
      return state;
  }
};
