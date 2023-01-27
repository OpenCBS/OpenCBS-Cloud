import * as fromPaymentGateway from './payment-gateway.actions';

export interface IPaymentGateway {
  contractNumber: string;
  createdAt: string;
  customerName: string;
  formattedNumber: string;
  id: number;
  paymentDate: string;
  partnerName: string;
  repaymentAmount: number;
  isUploaded: boolean
}

export interface IPaymentGatewayState {
  loans: IPaymentGateway[];
  loading: boolean;
  loaded: boolean;
  success: boolean;
  error: boolean;
  errorMessage: string;
}

const initialState: IPaymentGatewayState = {
  loans: [],
  loading: false,
  loaded: false,
  success: false,
  error: false,
  errorMessage: ''
};

export function paymentGatewayReducer(state = initialState,
                                      action: fromPaymentGateway.PaymentGatewayActions) {
  switch (action.type) {
    case fromPaymentGateway.LOADING_PAYMENT_GATEWAY:
      return Object.assign({}, state, {
        loading: true
      });
    case fromPaymentGateway.LOAD_PAYMENT_GATEWAY_SUCCESS:
      return Object.assign({}, state, {
        loans: action.payload,
        loaded: true,
        loading: false,
        success: true,
        error: false,
        errorMessage: ''
      });
    case fromPaymentGateway.LOAD_PAYMENT_GATEWAY_FAILURE:
      return Object.assign({}, state, {
        loaded: true,
        loading: false,
        success: false,
        error: true,
        errorMessage: ''
      });
    case fromPaymentGateway.RESET_PAYMENT_GATEWAY:
      return initialState;
    default:
      return state;
  }
}
