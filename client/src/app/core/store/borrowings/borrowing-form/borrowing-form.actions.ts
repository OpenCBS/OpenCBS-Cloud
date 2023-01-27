import { Action } from '@ngrx/store';

export const BORROWING_POPULATE = '[BORROWING_FORM] POPULATE';
export const BORROWING_SET_ROUTE = '[BORROWING_FORM] SET_ROUTE';
export const BORROWING_SET_STATE = '[BORROWING_FORM] SET_STATE';
export const BORROWING_FORM_RESET = '[BORROWING_FORM] FORM_RESET';
export const BORROWING_SET_LOADED = '[BORROWING_FORM] SET_LOADED';
export const BORROWING_SET_VALIDITY = '[BORROWING_FORM] SET_VALIDITY';
export const BORROWING_SET_LOAN_PRODUCT = '[BORROWING_FORM] SET_LOAN_PRODUCT';
export const BORROWING_SET_PROFILE = '[BORROWING_FORM] SET_PROFILE';

export class PopulateLL implements Action {
  readonly type = BORROWING_POPULATE;

  constructor(public payload?: any) {
  }
}

export class SetRouteLL implements Action {
  readonly type = BORROWING_SET_ROUTE;

  constructor(public payload?: any) {
  }
}

export class SetStateLL implements Action {
  readonly type = BORROWING_SET_STATE;

  constructor(public payload?: any) {
  }
}

export class FormResetLL implements Action {
  readonly type = BORROWING_FORM_RESET;

  constructor(public payload?: any) {
  }
}

export class SetLoadedLL implements Action {
  readonly type = BORROWING_SET_LOADED;

  constructor(public payload?: any) {
  }
}

export class SetValidityLL implements Action {
  readonly type = BORROWING_SET_VALIDITY;

  constructor(public payload?: any) {
  }
}

export class SetBorrowingProductLL implements Action {
  readonly type = BORROWING_SET_LOAN_PRODUCT;

  constructor(public payload?: any) {
  }
}

export class SetProfileLL implements Action {
  readonly type = BORROWING_SET_PROFILE;

  constructor(public payload?: any) {
  }
}

export type BorrowingFormActions =
  PopulateLL | SetRouteLL | SetStateLL | FormResetLL | SetLoadedLL | SetValidityLL | SetBorrowingProductLL | SetProfileLL;
