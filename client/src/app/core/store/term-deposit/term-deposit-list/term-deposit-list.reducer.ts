import * as fromTermDeposit from './term-deposit-list.actions';

export interface ITermDepositList {
  termDeposit: any[];
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

const initialTermDepositState: ITermDepositList = {
  termDeposit: [],
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

export function termDepositListReducer(state = initialTermDepositState,
                                       action: fromTermDeposit.TermDepositListActions) {
  switch (action.type) {
    case fromTermDeposit.LOAD_TERM_DEPOSITS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTermDeposit.LOAD_TERM_DEPOSITS_SUCCESS:
      const termDeposit = action.payload;
      return Object.assign({}, state, {
        termDeposit: termDeposit.content,
        totalPages: termDeposit.totalPages,
        totalElements: termDeposit.totalElements,
        size: termDeposit.size,
        currentPage: termDeposit.number,
        numberOfElements: termDeposit.numberOfElements,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTermDeposit.LOAD_TERM_DEPOSITS_FAILURE:
      return Object.assign({}, state, {
        termDeposit: [],
        totalPages: 0,
        totalElements: 0,
        size: 0,
        currentPage: 0,
        numberOfElements: 0,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: action.payload.message || 'Error getting term deposit list'
      });
    default:
      return state;
  }
}
