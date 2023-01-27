import { Action } from '@ngrx/store';

export const LOAD_TERM_DEPOSIT = '[TERM_DEPOSIT] LOAD_TERM_DEPOSIT';
export const LOADING_TERM_DEPOSIT = '[TERM_DEPOSIT] LOADING_TERM_DEPOSIT';
export const LOAD_TERM_DEPOSIT_SUCCESS = '[TERM_DEPOSIT] LOAD_TERM_DEPOSIT_SUCCESS';
export const LOAD_TERM_DEPOSIT_FAILURE = '[TERM_DEPOSIT] LOAD_TERM_DEPOSIT_FAILURE';
export const RESET_TERM_DEPOSIT = '[TERM_DEPOSIT] RESET_TERM_DEPOSIT';
export const DISBURSE_TERM_DEPOSIT = '[TERM_DEPOSIT] DISBURSE_TERM_DEPOSIT';
export const TERM_DEPOSIT_SET_BREADCRUMB = '[TERM_DEPOSIT] TERM_DEPOSIT_SET_BREADCRUMB';

export class LoadTermDeposit implements Action {
  readonly type = LOAD_TERM_DEPOSIT;
  constructor(public payload: any) {
  }
}

export class LoadingTermDeposit implements Action {
  readonly type = LOADING_TERM_DEPOSIT;
}

export class LoadTermDepositSuccess implements Action {
  readonly type = LOAD_TERM_DEPOSIT_SUCCESS;
  constructor(public payload: any) {
  }
}

export class LoadTermDepositFailure implements Action {
  readonly type = LOAD_TERM_DEPOSIT_FAILURE;
  constructor(public payload?: any) {
  }
}

export class ResetTermDeposit implements Action {
  readonly type = RESET_TERM_DEPOSIT;
  constructor(public payload?: any) {
  }
}

export class SetTermDepositBreadcrumb implements Action {
  readonly type = TERM_DEPOSIT_SET_BREADCRUMB;
  constructor(public payload?: any) {
  }
}

export class DisburseTermDeposit implements Action {
  readonly type = DISBURSE_TERM_DEPOSIT;
  constructor(public payload?: any) {
  }
}

export type TermDepositActions =
  LoadTermDeposit
  | LoadingTermDeposit
  | LoadTermDepositSuccess
  | LoadTermDepositFailure
  | ResetTermDeposit
  | DisburseTermDeposit
  | SetTermDepositBreadcrumb;
