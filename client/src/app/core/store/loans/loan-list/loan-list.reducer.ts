import * as fromLoanList from './loan-list.actions';


export interface ILoanList {
  loans: any[];
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

const initialLoanListState: ILoanList = {
  loans: [],
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


export function loanListReducer(state = initialLoanListState, action: fromLoanList.LoanListActions) {
  switch (action.type) {
    case fromLoanList.LOAD_LOANS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanList.LOAD_LOANS_SUCCESS:
      const loan = action.payload;
      return Object.assign({}, state, {
        loans: loan.content,
        totalPages: loan.totalPages,
        totalElements: loan.totalElements,
        size: loan.size,
        currentPage: loan.number,
        numberOfElements: loan.numberOfElements,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanList.LOAD_LOANS_FAILURE:
      return Object.assign({}, state, {
        loans: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loans'
      });
    default:
      return state;
  }
}
