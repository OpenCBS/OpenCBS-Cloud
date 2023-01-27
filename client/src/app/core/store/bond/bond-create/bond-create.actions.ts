import { Action } from '@ngrx/store';

export const CREATE_BOND = '[BOND_CREATE] CREATE_BOND';
export const CREATE_BOND_LOADING = '[BOND_CREATE] CREATE_BOND_LOADING';
export const CREATE_BOND_SUCCESS = '[BOND_CREATE] CREATE_BOND_SUCCESS';
export const CREATE_BOND_FAILURE = '[BOND_CREATE] CREATE_BOND_FAILURE';
export const CREATE_BOND_RESET = '[BOND_CREATE] CREATE_BOND_RESET';

export class CreateBond implements Action {
  readonly type = CREATE_BOND;

  constructor(public payload?: any) {
  }
}

export class CreateBondLoading implements Action {
  readonly type = CREATE_BOND_LOADING;

  constructor(public payload?: any) {
  }
}

export class CreateBondSuccess implements Action {
  readonly type = CREATE_BOND_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class CreateBondFailure implements Action {
  readonly type = CREATE_BOND_FAILURE;

  constructor(public payload?: any) {
  }
}

export class CreateBondReset implements Action {
  readonly type = CREATE_BOND_RESET;

  constructor(public payload?: any) {
  }
}

export type BondCreateActions =
  CreateBond
  | CreateBondLoading
  | CreateBondSuccess
  | CreateBondFailure
  | CreateBondReset;
