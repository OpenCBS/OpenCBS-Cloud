import { Action } from '@ngrx/store';

export const LOAD_PAYMENT_GATEWAY = '[PAYMENT_GATEWAY] LOAD_PAYMENT_GATEWAY';
export const LOAD_PAYMENT_GATEWAY_SUCCESS = '[PAYMENT_GATEWAY] LOAD_PAYMENT_GATEWAY_SUCCESS';
export const LOAD_PAYMENT_GATEWAY_FAILURE = '[PAYMENT_GATEWAY] LOAD_PAYMENT_GATEWAY_FAILURE';
export const LOADING_PAYMENT_GATEWAY = '[PAYMENT_GATEWAY] LOADING_PAYMENT_GATEWAY';
export const RESET_PAYMENT_GATEWAY = '[PAYMENT_GATEWAY] RESET_PAYMENT_GATEWAY';

export class LoadPaymentGateway implements Action {
  readonly type = LOAD_PAYMENT_GATEWAY;

  constructor(public payload?: any) {
  }
}

export class LoadingPaymentGateway implements Action {
  readonly type = LOADING_PAYMENT_GATEWAY;

  constructor(public payload?: any) {
  }
}

export class LoadPaymentGatewaySuccess implements Action {
  readonly type = LOAD_PAYMENT_GATEWAY_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadPaymentGatewayFailure implements Action {
  readonly type = LOAD_PAYMENT_GATEWAY_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetPaymentGateway implements Action {
  readonly type = RESET_PAYMENT_GATEWAY;

  constructor(public payload?: any) {
  }
}

export type PaymentGatewayActions =
  LoadPaymentGateway|
  LoadingPaymentGateway |
  LoadPaymentGatewaySuccess |
  LoadPaymentGatewayFailure |
  ResetPaymentGateway;
