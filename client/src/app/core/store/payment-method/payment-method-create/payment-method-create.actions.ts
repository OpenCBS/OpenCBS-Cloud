import { Action } from '@ngrx/store';

export const CREATE_PAYMENT_METHOD = '[PAYMENT_METHOD_CREATE] CREATE_PAYMENT_METHOD';
export const CREATE_PAYMENT_METHOD_LOADING = '[PAYMENT_METHOD_CREATE] CREATE_PAYMENT_METHOD_LOADING';
export const CREATE_PAYMENT_METHOD_SUCCESS = '[PAYMENT_METHOD_CREATE] CREATE_PAYMENT_METHOD_SUCCESS';
export const CREATE_PAYMENT_METHOD_FAILURE = '[PAYMENT_METHOD_CREATE] CREATE_PAYMENT_METHOD_FAILURE';
export const CREATE_PAYMENT_METHOD_RESET = '[PAYMENT_METHOD_CREATE] CREATE_PAYMENT_METHOD_RESET';

export class CreatePaymentMethod implements Action {
  readonly type = CREATE_PAYMENT_METHOD;

  constructor(public payload?: any) {
  }
}

export class CreatePaymentMethodLoading implements Action {
  readonly type = CREATE_PAYMENT_METHOD_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreatePaymentMethodSuccess implements Action {
  readonly type = CREATE_PAYMENT_METHOD_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreatePaymentMethodFailure implements Action {
  readonly type = CREATE_PAYMENT_METHOD_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreatePaymentMethodReset implements Action {
  readonly type = CREATE_PAYMENT_METHOD_RESET;

  constructor(public payload?: any) {
  }
}

export type PaymentMethodCreateActions =
  CreatePaymentMethod
  | CreatePaymentMethodLoading
  | CreatePaymentMethodSuccess
  | CreatePaymentMethodFailure
  | CreatePaymentMethodReset;
