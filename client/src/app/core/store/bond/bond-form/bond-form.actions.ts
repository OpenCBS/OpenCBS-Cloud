import { Action } from '@ngrx/store';

export const BOND_POPULATE = '[BOND_FORM] POPULATE';
export const BOND_SET_PRODUCT = '[BOND_FORM] SET_PRODUCT';
export const BOND_SET_ROUTE = '[BOND_FORM] SET_ROUTE';
export const BOND_SET_STATE = '[BOND_FORM] SET_STATE';
export const BOND_FORM_RESET = '[BOND_FORM] FORM_RESET';
export const BOND_SET_LOADED = '[BOND_FORM] SET_LOADED';
export const BOND_SET_VALIDITY = '[BOND_FORM] SET_VALIDITY';
export const BOND_SET_LOAN_PRODUCT = '[BOND_FORM] SET_BOND_PRODUCT';
export const BOND_SET_PROFILE = '[BOND_FORM] SET_PROFILE';

export class PopulateBond implements Action {
  readonly type = BOND_POPULATE;

  constructor(public payload?: any) {
  }
}

export class SetBondProduct implements Action {
  readonly type = BOND_SET_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class SetRouteBond implements Action {
  readonly type = BOND_SET_ROUTE;

  constructor(public payload?: any) {
  }
}

export class SetStateBond implements Action {
  readonly type = BOND_SET_STATE;

  constructor(public payload?: any) {
  }
}

export class FormResetBond implements Action {
  readonly type = BOND_FORM_RESET;

  constructor(public payload?: any) {
  }
}

export class SetLoadedBond implements Action {
  readonly type = BOND_SET_LOADED;

  constructor(public payload?: any) {
  }
}

export class SetValidityBond implements Action {
  readonly type = BOND_SET_VALIDITY;

  constructor(public payload?: any) {
  }
}

export class SetBondProductBond implements Action {
  readonly type = BOND_SET_LOAN_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class SetProfileBond implements Action {
  readonly type = BOND_SET_PROFILE;

  constructor(public payload?: any) {
  }
}

export type BondFormActions =
  PopulateBond
  | SetRouteBond
  | SetStateBond
  | FormResetBond
  | SetLoadedBond
  | SetValidityBond
  | SetBondProductBond
  | SetProfileBond
  | SetBondProduct;
