import * as fromTermDepositProductCreate from './term-deposit-product-create.actions';

export interface ICreateTermDepositProduct {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreateTermDepositProductState: ICreateTermDepositProduct = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function termDepositProductCreateReducer(state = initialCreateTermDepositProductState,
                                         action: fromTermDepositProductCreate.TermDepositProductCreateActions) {
  switch (action.type) {
    case fromTermDepositProductCreate.CREATE_TERM_DEPOSIT_PRODUCT_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromTermDepositProductCreate.CREATE_TERM_DEPOSIT_PRODUCT_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: '',
        response: action.payload
      });
    case fromTermDepositProductCreate.CREATE_TERM_DEPOSIT_PRODUCT_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new term deposit product data',
        response: null
      });
    case fromTermDepositProductCreate.CREATE_TERM_DEPOSIT_PRODUCT_RESET:
      return initialCreateTermDepositProductState;
    default:
      return state;
  }
};
