import { Action } from '@ngrx/store';

export const LOAD_BONDS = '[BOND_LIST] LOAD_BOND';
export const LOAD_BONDS_SUCCESS = '[BOND_LIST] LOAD_BOND_SUCCESS';
export const LOAD_BONDS_FAILURE = '[BOND_LIST] LOAD_BOND_FAILURE';
export const LOADING_BONDS = '[BOND_LIST] LOADING_BOND';

export class LoadBonds implements Action {
  readonly type = LOAD_BONDS;

  constructor(public payload?: any) {
  }
}

export class LoadingBonds implements Action {
  readonly type = LOADING_BONDS;

  constructor(public payload?: any) {
  }
}

export class LoadBondsSuccess implements Action {
  readonly type = LOAD_BONDS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadBondsFailure implements Action {
  readonly type = LOAD_BONDS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type BondListActions =
  LoadBonds
  | LoadingBonds
  | LoadBondsSuccess
  | LoadBondsFailure;
