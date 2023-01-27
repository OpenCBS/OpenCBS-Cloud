import { Action } from '@ngrx/store';


export const LOAD_PAYEES = '[PAYEE_LIST] LOAD_PAYEES';
export const LOAD_PAYEES_SUCCESS = '[PAYEE_LIST] LOAD_PAYEES_SUCCESS';
export const LOAD_PAYEES_FAILURE = '[PAYEE_LIST] LOAD_PAYEE_FAILURE';
export const LOADING_PAYEES = '[PAYEE_LIST] LOADING_PAYEES';

export class LoadPayees implements Action {
  readonly type = LOAD_PAYEES;

  constructor(public payload?: any) {
  }
}

export class LoadingPayees implements Action {
  readonly type = LOADING_PAYEES;

  constructor(public payload?: any) {
  }
}

export class LoadPayeesSuccess implements Action {
  readonly type = LOAD_PAYEES_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadPayeesFailure implements Action {
  readonly type = LOAD_PAYEES_FAILURE;

  constructor(public payload?: any) {
  }
}

export type PayeeListActions = LoadPayees | LoadingPayees | LoadPayeesSuccess | LoadPayeesFailure;

