import * as fromPaymentMethodUpdate from './payment-method-update.actions';

export interface UpdatePaymentMethodState {
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialUpdatePaymentMethodState: UpdatePaymentMethodState = {
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function paymentMethodUpdateReducer(
  state = initialUpdatePaymentMethodState,
  action: fromPaymentMethodUpdate.PaymentMethodUpdateActions
) {
  switch (action.type) {
    case fromPaymentMethodUpdate.UPDATE_PAYMENT_METHOD_LOADING:
      return Object.assign({}, state, {
        loading: true
      });
    case fromPaymentMethodUpdate.UPDATE_PAYMENT_METHOD_SUCCESS:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromPaymentMethodUpdate.UPDATE_PAYMENT_METHOD_FAILURE:
      return Object.assign({}, state, {
        loading: false,
        loaded: true,
        success: false,
        error: true,
        errorMessage: action.payload.message || 'Error saving new payment method data'
      });
    case fromPaymentMethodUpdate.UPDATE_PAYMENT_METHOD_RESET:
      return initialUpdatePaymentMethodState;
    default:
      return state;
  }
};
