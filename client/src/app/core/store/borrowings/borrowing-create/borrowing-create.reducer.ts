import * as fromBorrowingCreateActions from './borrowing-create.actions';

export interface IBorrowingCreateState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
  response: any;
}

const initialCreateBorrowingState: IBorrowingCreateState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: '',
  response: null
};

export function borrowingCreateReducer(state = initialCreateBorrowingState,
                                       action: fromBorrowingCreateActions.BorrowingCreateActions) {
  switch (action.type) {
    case fromBorrowingCreateActions.CREATE_BORROWING_LOADING:
      return Object.assign({}, state, {
        loading: true,
        loaded: false
      });
    case fromBorrowingCreateActions.CREATE_BORROWING_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        response: action.payload
      });
    case fromBorrowingCreateActions.CREATE_BORROWING_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new borrowing data',
        response: null
      });
    case fromBorrowingCreateActions.CREATE_BORROWING_RESET:
      return initialCreateBorrowingState;
    default:
      return state;
  }
}
