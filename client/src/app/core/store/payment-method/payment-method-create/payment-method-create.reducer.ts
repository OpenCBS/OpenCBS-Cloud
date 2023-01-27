import * as fromPaymentMethodCreate from './payment-method-create.actions';

export interface CreatePaymentMethodState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialCreatePaymentMethodState: CreatePaymentMethodState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function paymentMethodCreateReducer(state = initialCreatePaymentMethodState, action: fromPaymentMethodCreate.PaymentMethodCreateActions) {
  switch (action.type) {
    case fromPaymentMethodCreate.CREATE_PAYMENT_METHOD_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromPaymentMethodCreate.CREATE_PAYMENT_METHOD_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromPaymentMethodCreate.CREATE_PAYMENT_METHOD_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new payment method data'
      });
    case fromPaymentMethodCreate.CREATE_PAYMENT_METHOD_RESET:
      return initialCreatePaymentMethodState;
    default:
      return state;
  }
}
