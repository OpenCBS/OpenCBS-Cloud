import * as fromLoanProducts from './loan-product-list.actions';

export interface LoanProductListState {
  loan_products: any[];
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

const initialLoanProductListState: LoanProductListState = {
  loan_products: [],
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


export function loanProductListReducer(state = initialLoanProductListState,
                                       action: fromLoanProducts.LoanProductListActions) {
  switch (action.type) {
    case fromLoanProducts.LOAD_LOAN_PRODUCTS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromLoanProducts.LOAD_LOAN_PRODUCTS_SUCCESS:
      const loan_products = action.payload;
      return Object.assign({}, state, {
        loan_products: loan_products.content,
        totalPages: loan_products.totalPages,
        totalElements: loan_products.totalElements,
        size: loan_products.size,
        currentPage: loan_products.number,
        numberOfElements: loan_products.numberOfElements,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromLoanProducts.LOAD_LOAN_PRODUCTS_FAILURE:
      return Object.assign({}, state, {
        loan_products: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting loan products'
      });
    default:
      return state;
  }
};
