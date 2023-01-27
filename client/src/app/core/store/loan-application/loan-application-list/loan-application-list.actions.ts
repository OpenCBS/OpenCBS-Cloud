import { Action } from '@ngrx/store';

export const LOAD_LOAN_APPLICATIONS = '[LOAN_APPLICATION_LIST] LOAD_LOAN_APPLICATIONS';
export const LOAD_LOAN_APPLICATIONS_SUCCESS = '[LOAN_APPLICATION_LIST] LOAD_LOAN_APPLICATIONS_SUCCESS';
export const LOAD_LOAN_APPLICATIONS_FAILURE = '[LOAN_APPLICATION_LIST] LOAD_LOAN_APPLICATIONS_FAILURE';
export const LOADING_LOAN_APPLICATIONS = '[LOAN_APPLICATION_LIST] LOADING_LOAN_APPLICATIONS';

export class LoadLoanApplications implements Action {
  readonly type = LOAD_LOAN_APPLICATIONS;

  constructor(public payload?: any) {
  }
}

export class LoadingLoanApplications implements Action {
  readonly type = LOADING_LOAN_APPLICATIONS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanApplicationsSuccess implements Action {
  readonly type = LOAD_LOAN_APPLICATIONS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadLoanApplicationsFailure implements Action {
  readonly type = LOAD_LOAN_APPLICATIONS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type LoanApplicationListActions =
  LoadLoanApplications
  | LoadingLoanApplications
  | LoadLoanApplicationsSuccess
  | LoadLoanApplicationsFailure;
