import * as fromTermDepositProducts from './term-deposit-product-list.actions';

export interface ITermDepositProductList {
  term_deposit_products: any[];
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

const initialTermDepositProductListState: ITermDepositProductList = {
  term_deposit_products: [],
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


export function termDepositProductListReducer(state = initialTermDepositProductListState,
                                       action: fromTermDepositProducts.TermDepositProductListActions) {
  switch (action.type) {
    case fromTermDepositProducts.LOAD_TERM_DEPOSIT_PRODUCTS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTermDepositProducts.LOAD_TERM_DEPOSIT_PRODUCTS_SUCCESS:
      const term_deposit_products = action.payload;
      return Object.assign({}, state, {
        term_deposit_products: term_deposit_products.content,
        totalPages: term_deposit_products.totalPages,
        totalElements: term_deposit_products.totalElements,
        size: term_deposit_products.size,
        currentPage: term_deposit_products.number,
        numberOfElements: term_deposit_products.numberOfElements,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTermDepositProducts.LOAD_TERM_DEPOSIT_PRODUCTS_FAILURE:
      return Object.assign({}, state, {
        term_deposit_products: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting term deposit products'
      });
    default:
      return state;
  }
}
