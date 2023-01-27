import { Action } from '@ngrx/store';

export const LOAN_APP_POPULATE = '[LOAN_APP_FORM] POPULATE';
export const LOAN_APP_SET_ROUTE = '[LOAN_APP_FORM] SET_ROUTE';
export const LOAN_APP_SET_STATE = '[LOAN_APP_FORM] SET_STATE';
export const LOAN_APP_FORM_RESET = '[LOAN_APP_FORM] FORM_RESET';
export const LOAN_APP_SET_BREADCRUMB = '[LOAN_APP_FORM] SET_BREADCRUMB';
export const LOAN_APP_SET_LOADED = '[LOAN_APP_FORM] SET_LOADED';
export const LOAN_APP_SET_VALIDITY = '[LOAN_APP_FORM] SET_VALIDITY';
export const LOAN_APP_SET_TOTAL = '[LOAN_APP_FORM] SET_TOTAL';
export const LOAN_APP_SET_LOAN_PRODUCT = '[LOAN_APP_FORM] SET_LOAN_PRODUCT';
export const LOAN_APP_SET_PROFILE = '[LOAN_APP_FORM] SET_PROFILE';

export class Populate implements Action {
  readonly type = LOAN_APP_POPULATE;

  constructor(public payload?: any) {
  }
}

export class SetRoute implements Action {
  readonly type = LOAN_APP_SET_ROUTE;

  constructor(public payload?: any) {
  }
}

export class SetState implements Action {
  readonly type = LOAN_APP_SET_STATE;

  constructor(public payload?: any) {
  }
}

export class FormReset implements Action {
  readonly type = LOAN_APP_FORM_RESET;

  constructor(public payload?: any) {
  }
}

export class SetBreadcrumb implements Action {
  readonly type = LOAN_APP_SET_BREADCRUMB;

  constructor(public payload?: any) {
  }
}

export class SetLoaded implements Action {
  readonly type = LOAN_APP_SET_LOADED;

  constructor(public payload?: any) {
  }
}

export class SetValidity implements Action {
  readonly type = LOAN_APP_SET_VALIDITY;

  constructor(public payload?: any) {
  }
}

export class SetTotal implements Action {
  readonly type = LOAN_APP_SET_TOTAL;

  constructor(public payload?: any) {
  }
}

export class SetLoanProduct implements Action {
  readonly type = LOAN_APP_SET_LOAN_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class SetProfile implements Action {
  readonly type = LOAN_APP_SET_PROFILE;

  constructor(public payload?: any) {
  }
}

export type LoanAppFormActions =
  Populate
  | SetRoute
  | SetState
  | FormReset
  | SetBreadcrumb
  | SetLoaded
  | SetValidity
  | SetTotal
  | SetLoanProduct
  | SetProfile;
