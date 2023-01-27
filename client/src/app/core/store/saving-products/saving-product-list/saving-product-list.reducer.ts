import * as fromSavingProducts from './saving-product-list.actions';

export interface SavingProductListState {
  saving_products: any[];
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

const initialSavingProductListState: SavingProductListState = {
  saving_products: [],
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


export function savingProductListReducer(state = initialSavingProductListState,
                                         action: fromSavingProducts.SavingProductListActions) {
  switch (action.type) {
    case fromSavingProducts.LOAD_SAVING_PRODUCTS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromSavingProducts.LOAD_SAVING_PRODUCTS_SUCCESS:
      const saving_products = action.payload;
      return Object.assign({}, state, {
        saving_products: saving_products.content,
        totalPages: saving_products.totalPages,
        totalElements: saving_products.totalElements,
        size: saving_products.size,
        currentPage: saving_products.number,
        numberOfElements: saving_products.numberOfElements,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromSavingProducts.LOAD_SAVING_PRODUCTS_FAILURE:
      return Object.assign({}, state, {
        saving_products: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting saving products'
      });
    default:
      return state;
  }
}
