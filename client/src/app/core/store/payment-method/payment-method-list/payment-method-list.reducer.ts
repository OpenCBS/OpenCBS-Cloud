import * as fromPaymentMethodList from './payment-method-list.actions';

export interface PaymentMethodListState {
  paymentMethods: any[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialPaymentMethodListState: PaymentMethodListState = {
  paymentMethods: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function paymentMethodListReducer(state = initialPaymentMethodListState,
                                         action: fromPaymentMethodList.PaymentMethodListActions) {
  switch (action.type) {
    case fromPaymentMethodList.LOAD_PAYMENT_METHODS:
      return Object.assign({}, state, {
        loading: true
      });
    case fromPaymentMethodList.LOAD_PAYMENT_METHODS_SUCCESS:
      return Object.assign({}, state, {
        paymentMethods: action.payload,
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromPaymentMethodList.LOAD_PAYMENT_METHODS_FAILURE:
      return Object.assign({}, state, {
        paymentMethods: [],
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error getting payment method list'
      });
    default:
      return state;
  }
}
