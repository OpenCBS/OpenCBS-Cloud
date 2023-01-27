import { Action } from '@ngrx/store';

export const LOAD_TERM_DEPOSITS = '[TERM_DEPOSIT_LIST] LOAD_TERM_DEPOSIT';
export const LOAD_TERM_DEPOSITS_SUCCESS = '[TERM_DEPOSIT_LIST] LOAD_TERM_DEPOSIT_SUCCESS';
export const LOAD_TERM_DEPOSITS_FAILURE = '[TERM_DEPOSIT_LIST] LOAD_TERM_DEPOSIT_FAILURE';
export const LOADING_TERM_DEPOSITS = '[TERM_DEPOSIT_LIST] LOADING_TERM_DEPOSIT';

export class LoadTermDeposits implements Action {
  readonly type = LOAD_TERM_DEPOSITS;
  constructor(public payload?: any) {}
}
export class LoadingTermDeposits implements Action {
  readonly type = LOADING_TERM_DEPOSITS;
  constructor(public payload?: any) {}
}
export class LoadTermDepositsSuccess implements Action {
  readonly type = LOAD_TERM_DEPOSITS_SUCCESS;
  constructor(public payload?: any) {}
}
export class LoadTermDepositsFailure implements Action {
  readonly type = LOAD_TERM_DEPOSITS_FAILURE;
  constructor(public payload?: any) {}
}

export type TermDepositListActions =
  LoadTermDeposits
  | LoadingTermDeposits
  | LoadTermDepositsSuccess
  | LoadTermDepositsFailure;
