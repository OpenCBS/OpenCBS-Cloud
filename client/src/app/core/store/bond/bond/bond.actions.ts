import { Action } from '@ngrx/store';

export const LOAD_BOND = '[BOND] LOAD_BOND';
export const LOADING_BOND = '[BOND] LOADING_BOND';
export const LOAD_BOND_SUCCESS = '[BOND] LOAD_BOND_SUCCESS';
export const LOAD_BOND_FAILURE = '[BOND] LOAD_BOND_FAILURE';
export const RESET_BOND = '[BOND] RESET_BOND';
export const START_BOND = '[BOND] START_BOND';
export const BOND_SET_BREADCRUMB = '[BOND] BOND_SET_BREADCRUMB';

export class LoadBond implements Action {
  readonly type = LOAD_BOND;

  constructor(public payload: any) {
  }
}

export class LoadingBond implements Action {
  readonly type = LOADING_BOND;
}

export class LoadBondSuccess implements Action {
  readonly type = LOAD_BOND_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadBondFailure implements Action {
  readonly type = LOAD_BOND_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetBond implements Action {
  readonly type = RESET_BOND;

  constructor(public payload?: any) {
  }
}

export class SetBondBreadcrumb implements Action {
  readonly type = BOND_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export class StartBond implements Action {
  readonly type = START_BOND;

  constructor(public payload?: any) {
  }
}

export type BondActions =
  LoadBond
  | LoadingBond
  | LoadBondSuccess
  | LoadBondFailure
  | ResetBond
  | StartBond
  | SetBondBreadcrumb;
