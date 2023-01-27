import { Action } from '@ngrx/store';

export const LOAD_PAYMENT_METHODS = '[PAYMENT_METHOD_LIST] LOAD_PAYMENT_METHODS';
export const LOAD_PAYMENT_METHODS_SUCCESS = '[PAYMENT_METHOD_LIST] LOAD_PAYMENT_METHODS_SUCCESS';
export const LOAD_PAYMENT_METHODS_FAILURE = '[PAYMENT_METHOD_LIST] LOAD_PAYMENT_METHODS_FAILURE';
export const LOADING_PAYMENT_METHODS = '[PAYMENT_METHOD_LIST] LOADING_PAYMENT_METHODS';

export class LoadPaymentMethods implements Action {
  readonly type = LOAD_PAYMENT_METHODS;

  constructor(public payload?: any) {
  }
}

export class LoadingPaymentMethods implements Action {
  readonly type = LOADING_PAYMENT_METHODS;

  constructor(public payload?: any) {
  }
}

export class LoadPaymentMethodsSuccess implements Action {
  readonly type = LOAD_PAYMENT_METHODS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadPaymentMethodsFailure implements Action {
  readonly type = LOAD_PAYMENT_METHODS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type PaymentMethodListActions = LoadPaymentMethods | LoadingPaymentMethods | LoadPaymentMethodsSuccess | LoadPaymentMethodsFailure;
