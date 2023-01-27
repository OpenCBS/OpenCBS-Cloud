import * as fromTermDepositProductUpdate from './term-deposit-product-update.actions';

export interface IUpdateTermDepositProduct {
  data: any;
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdateTermDepositProductState: IUpdateTermDepositProduct = {
  data: null,
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function termDepositProductUpdateReducer(state = initialUpdateTermDepositProductState,
                                         action: fromTermDepositProductUpdate.TermDepositProductUpdateActions) {
  switch (action.type) {
    case fromTermDepositProductUpdate.UPDATE_TERM_DEPOSIT_PRODUCT_LOADING:
      return Object.assign({}, state, {
        loading: true,
      });
    case fromTermDepositProductUpdate.UPDATE_TERM_DEPOSIT_PRODUCT_SUCCESS:
      return Object.assign({}, state, {
        data: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromTermDepositProductUpdate.UPDATE_TERM_DEPOSIT_PRODUCT_FAILURE:
      return Object.assign({}, state, {
        data: null,
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error term deposit product-state data'
      });
    case fromTermDepositProductUpdate.UPDATE_TERM_DEPOSIT_PRODUCT_RESET:
      return initialUpdateTermDepositProductState;
    default:
      return state;
  }
}
