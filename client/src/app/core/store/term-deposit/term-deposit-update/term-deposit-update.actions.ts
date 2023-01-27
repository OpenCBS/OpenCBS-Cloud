import { Action } from '@ngrx/store';

export const UPDATE_TERM_DEPOSIT = '[TERM_DEPOSIT_UPDATE] ';
export const UPDATE_TERM_DEPOSIT_LOADING = '[TERM_DEPOSIT_UPDATE] UPDATE_TERM_DEPOSIT_LOADING';
export const UPDATE_TERM_DEPOSIT_SUCCESS = '[TERM_DEPOSIT_UPDATE] UPDATE_TERM_DEPOSIT_SUCCESS';
export const UPDATE_TERM_DEPOSIT_FAILURE = '[TERM_DEPOSIT_UPDATE] UPDATE_TERM_DEPOSIT_FAILURE';
export const UPDATE_TERM_DEPOSIT_RESET = '[TERM_DEPOSIT_UPDATE] UPDATE_TERM_DEPOSIT_RESET';

export class UpdateTermDeposit implements Action {
  readonly type = UPDATE_TERM_DEPOSIT;
  constructor(public payload?: any) {}
}
export class UpdateTermDepositLoading implements Action {
  readonly type = UPDATE_TERM_DEPOSIT_LOADING;
  constructor(public payload?: any) {}
}
export class UpdateTermDepositSuccess implements Action {
  readonly type = UPDATE_TERM_DEPOSIT_SUCCESS;
  constructor(public payload?: any) {}
}
export class UpdateTermDepositFailure implements Action {
  readonly type = UPDATE_TERM_DEPOSIT_FAILURE;
  constructor(public payload?: any) {}
}
export class UpdateTermDepositReset implements Action {
  readonly type = UPDATE_TERM_DEPOSIT_RESET;
  constructor(public payload?: any) {}
}

export type TermDepositUpdateActions =
  UpdateTermDeposit
  | UpdateTermDepositLoading
  | UpdateTermDepositSuccess
  | UpdateTermDepositFailure
  | UpdateTermDepositReset;
