import { Action } from '@ngrx/store';

export const DELETE_LOAN_APP_GUARANTOR = '[LOAN_APP_GUARANTOR_DELETE] DELETE_LOAN_APP_GUARANTOR';
export const DELETE_LOAN_APP_GUARANTOR_LOADING = '[LOAN_APP_GUARANTOR_DELETE] DELETE_LOAN_APP_GUARANTOR_LOADING';
export const DELETE_LOAN_APP_GUARANTOR_SUCCESS = '[LOAN_APP_GUARANTOR_DELETE] DELETE_LOAN_APP_GUARANTOR_SUCCESS';
export const DELETE_LOAN_APP_GUARANTOR_RESET = '[LOAN_APP_GUARANTOR_DELETE] DELETE_LOAN_APP_GUARANTOR_RESET';
export const DELETE_LOAN_APP_GUARANTOR_FAILURE = '[LOAN_APP_GUARANTOR_DELETE] DELETE_LOAN_APP_GUARANTOR_FAILURE';

export class DeleteLoanAppGuarantor implements Action {
  readonly type = DELETE_LOAN_APP_GUARANTOR;

  constructor(public payload?: any) {
  }
}

export class DeleteLoanAppGuarantorLoading implements Action {
  readonly type = DELETE_LOAN_APP_GUARANTOR_LOADING;

  constructor(public payload?: any) {
  }
}

export class DeleteLoanAppGuarantorSuccess implements Action {
  readonly type = DELETE_LOAN_APP_GUARANTOR_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class DeleteLoanAppGuarantorReset implements Action {
  readonly type = DELETE_LOAN_APP_GUARANTOR_RESET;

  constructor(public payload?: any) {
  }
}

export class DeleteLoanAppGuarantorFailure implements Action {
  readonly type = DELETE_LOAN_APP_GUARANTOR_FAILURE;

  constructor(public payload?: any) {
  }
}

export type LoanAppGuarantorDeleteActions =
  | DeleteLoanAppGuarantor
  | DeleteLoanAppGuarantorLoading
  | DeleteLoanAppGuarantorSuccess
  | DeleteLoanAppGuarantorReset
  | DeleteLoanAppGuarantorFailure;
