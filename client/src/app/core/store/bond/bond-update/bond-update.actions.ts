import { Action } from '@ngrx/store';

export const UPDATE_BOND = '[BOND_UPDATE] ';
export const UPDATE_BOND_LOADING = '[BOND_UPDATE] UPDATE_BOND_LOADING';
export const UPDATE_BOND_SUCCESS = '[BOND_UPDATE] UPDATE_BOND_SUCCESS';
export const UPDATE_BOND_FAILURE = '[BOND_UPDATE] UPDATE_BOND_FAILURE';
export const UPDATE_BOND_RESET = '[BOND_UPDATE] UPDATE_BOND_RESET';

export class UpdateBond implements Action {
  readonly type = UPDATE_BOND;

  constructor(public payload?: any) {
  }
}

export class UpdateBondLoading implements Action {
  readonly type = UPDATE_BOND_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateBondSuccess implements Action {
  readonly type = UPDATE_BOND_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateBondFailure implements Action {
  readonly type = UPDATE_BOND_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateBondReset implements Action {
  readonly type = UPDATE_BOND_RESET;

  constructor(public payload?: any) {
  }
}

export type BondUpdateActions =
  UpdateBond
  | UpdateBondLoading
  | UpdateBondSuccess
  | UpdateBondFailure
  | UpdateBondReset;
