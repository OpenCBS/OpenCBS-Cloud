import { Action } from '@ngrx/store';

export const UPDATE_PAYMENT_METHOD = '[PAYMENT_METHOD_UPDATE] UPDATE_PAYMENT_METHOD';
export const UPDATE_PAYMENT_METHOD_LOADING = '[PAYMENT_METHOD_UPDATE] UPDATE_PAYMENT_METHOD_LOADING';
export const UPDATE_PAYMENT_METHOD_SUCCESS = '[PAYMENT_METHOD_UPDATE] UPDATE_PAYMENT_METHOD_SUCCESS';
export const UPDATE_PAYMENT_METHOD_FAILURE = '[PAYMENT_METHOD_UPDATE] UPDATE_PAYMENT_METHOD_FAILURE';
export const UPDATE_PAYMENT_METHOD_RESET = '[PAYMENT_METHOD_UPDATE] UPDATE_PAYMENT_METHOD_RESET';

export class UpdatePaymentMethod implements Action {
  readonly type = UPDATE_PAYMENT_METHOD;

  constructor(public payload?: any) {
  }
}

export class UpdatePaymentMethodLoading implements Action {
  readonly type = UPDATE_PAYMENT_METHOD_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdatePaymentMethodSuccess implements Action {
  readonly type = UPDATE_PAYMENT_METHOD_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdatePaymentMethodFailure implements Action {
  readonly type = UPDATE_PAYMENT_METHOD_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdatePaymentMethodReset implements Action {
  readonly type = UPDATE_PAYMENT_METHOD_RESET;

  constructor(public payload?: any) {
  }
}

export type PaymentMethodUpdateActions =
  UpdatePaymentMethod
  | UpdatePaymentMethodLoading
  | UpdatePaymentMethodSuccess
  | UpdatePaymentMethodFailure
  | UpdatePaymentMethodReset;
