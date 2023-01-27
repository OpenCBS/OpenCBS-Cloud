import { Action } from '@ngrx/store';

export const CREATE_OPERATION_DEPOSIT = '[OPERATION_CREATE_DEPOSIT] CREATE_OPERATION_DEPOSIT';
export const CREATE_OPERATION_WITHDRAW = '[OPERATION_CREATE_WITHDRAW] CREATE_OPERATION_WITHDRAW';
export const CREATE_OPERATION_DEPOSIT_SAVING = '[OPERATION_CREATE_DEPOSIT_SAVING] CREATE_OPERATION_DEPOSIT_SAVING';
export const CREATE_OPERATION_WITHDRAW_SAVING = '[OPERATION_CREATE_WITHDRAW_SAVING] CREATE_OPERATION_WITHDRAW_SAVING';
export const CREATE_OPERATION_LOADING = '[OPERATION_CREATE] CREATE_OPERATION_LOADING';
export const CREATE_OPERATION_SUCCESS = '[OPERATION_CREATE] CREATE_OPERATION_SUCCESS';
export const CREATE_OPERATION_FAILURE = '[OPERATION_CREATE] CREATE_OPERATION_FAILURE';
export const CREATE_OPERATION_RESET = '[OPERATION_CREATE] CREATE_OPERATION_RESET';

export class CreateOperationDeposit implements Action {
  readonly type = CREATE_OPERATION_DEPOSIT;

  constructor(public payload: any) {
  }
}

export class CreateOperationWithdraw implements Action {
  readonly type = CREATE_OPERATION_WITHDRAW;

  constructor(public payload?: any) {
  }
}

export class CreateOperationDepositSaving implements Action {
  readonly type = CREATE_OPERATION_DEPOSIT_SAVING;

  constructor(public payload: any) {
  }
}

export class CreateOperationWithdrawSaving implements Action {
  readonly type = CREATE_OPERATION_WITHDRAW_SAVING;

  constructor(public payload?: any) {
  }
}

export class CreateOperationLoading implements Action {
  readonly type = CREATE_OPERATION_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateOperationSuccess implements Action {
  readonly type = CREATE_OPERATION_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateOperationFailure implements Action {
  readonly type = CREATE_OPERATION_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateOperationReset implements Action {
  readonly type = CREATE_OPERATION_RESET;

  constructor(public payload?: any) {
  }
}

export type OperationCreateActions =
  CreateOperationDeposit
  | CreateOperationWithdraw
  | CreateOperationDepositSaving
  | CreateOperationWithdrawSaving
  | CreateOperationLoading
  | CreateOperationSuccess
  | CreateOperationFailure
  | CreateOperationReset;
