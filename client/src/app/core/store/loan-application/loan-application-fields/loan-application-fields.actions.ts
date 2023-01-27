import { Action } from '@ngrx/store';

export const LOAD_LOAN_APPLICATION_FIELDS_META = '[LOAN_APPLICATION_FIELDS] LOAD_LOAN_APPLICATION_FIELDS_META';
export const LOADING_LOAN_APPLICATION_FIELDS_META = '[LOAN_APPLICATION_FIELDS] LOADING_LOAN_APPLICATION_FIELDS_META';
export const LOAD_LOAN_APPLICATION_FIELDS_META_SUCCESS = '[LOAN_APPLICATION_FIELDS] LOAD_LOAN_APPLICATION_FIELDS_META_SUCCESS';
export const LOAD_LOAN_APPLICATION_FIELDS_META_FAILURE = '[LOAN_APPLICATION_FIELDS] LOAD_LOAN_APPLICATION_FIELDS_META_FAILURE';
export const RESET_LOAN_APPLICATION_FIELDS_META = '[LOAN_APPLICATION_FIELDS] RESET_LOAN_APPLICATION_FIELDS_META';

export class LoadLoanApplicationFieldsMeta implements Action {
  readonly type = LOAD_LOAN_APPLICATION_FIELDS_META;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanApplicationFieldsMeta implements Action {
  readonly type = LOADING_LOAN_APPLICATION_FIELDS_META;

  constructor(public payload?: any) {
  }
}

export class LoadLoanApplicationFieldsMetaSuccess implements Action {
  readonly type = LOAD_LOAN_APPLICATION_FIELDS_META_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanApplicationFieldsMetaFailure implements Action {
  readonly type = LOAD_LOAN_APPLICATION_FIELDS_META_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetLoanApplicationFieldsMeta implements Action {
  readonly type = RESET_LOAN_APPLICATION_FIELDS_META;

  constructor(public payload?: any) {
  }
}

export type LoanApplicationFieldsAction =
  LoadLoanApplicationFieldsMeta
  | LoadingLoanApplicationFieldsMeta
  | LoadLoanApplicationFieldsMetaSuccess
  | LoadLoanApplicationFieldsMetaFailure
  | ResetLoanApplicationFieldsMeta;
