import { Action } from '@ngrx/store';

export const CREATE_TERM_DEPOSIT = '[TERM_DEPOSIT_CREATE] CREATE_TERM_DEPOSIT';
export const CREATE_TERM_DEPOSIT_LOADING = '[TERM_DEPOSIT_CREATE] CREATE_TERM_DEPOSIT_LOADING';
export const CREATE_TERM_DEPOSIT_SUCCESS = '[TERM_DEPOSIT_CREATE] CREATE_TERM_DEPOSIT_SUCCESS';
export const CREATE_TERM_DEPOSIT_FAILURE = '[TERM_DEPOSIT_CREATE] CREATE_TERM_DEPOSIT_FAILURE';
export const CREATE_TERM_DEPOSIT_RESET = '[TERM_DEPOSIT_CREATE] CREATE_TERM_DEPOSIT_RESET';

export class CreateTermDeposit implements Action {
  readonly type = CREATE_TERM_DEPOSIT;
  constructor(public payload?: any) {}
}
export class CreateTermDepositLoading implements Action {
  readonly type = CREATE_TERM_DEPOSIT_LOADING;
  constructor(public payload?: any) {}
}
export class CreateTermDepositSuccess implements Action {
  readonly type = CREATE_TERM_DEPOSIT_SUCCESS;
  constructor(public payload?: any) {}
}
export class CreateTermDepositFailure implements Action {
  readonly type = CREATE_TERM_DEPOSIT_FAILURE;
  constructor(public payload?: any) {}
}
export class CreateTermDepositReset implements Action {
  readonly type = CREATE_TERM_DEPOSIT_RESET;
  constructor(public payload?: any) {}
}

export type TermDepositCreateActions =
  CreateTermDeposit
  | CreateTermDepositLoading
  | CreateTermDepositSuccess
  | CreateTermDepositFailure
  | CreateTermDepositReset;
