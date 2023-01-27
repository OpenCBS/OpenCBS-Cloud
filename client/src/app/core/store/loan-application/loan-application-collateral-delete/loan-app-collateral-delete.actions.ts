import { Action } from '@ngrx/store';

export const DELETE_LOAN_APP_COLLATERAL = '[LOAN_APP_COLLATERAL_DELETE] DELETE_LOAN_APP_COLLATERAL';
export const DELETE_LOAN_APP_COLLATERAL_LOADING = '[LOAN_APP_COLLATERAL_DELETE] DELETE_LOAN_APP_COLLATERAL_LOADING';
export const DELETE_LOAN_APP_COLLATERAL_SUCCESS = '[LOAN_APP_COLLATERAL_DELETE] DELETE_LOAN_APP_COLLATERAL_SUCCESS';
export const DELETE_LOAN_APP_COLLATERAL_RESET = '[LOAN_APP_COLLATERAL_DELETE] DELETE_LOAN_APP_COLLATERAL_RESET';
export const DELETE_LOAN_APP_COLLATERAL_FAILURE = '[LOAN_APP_COLLATERAL_DELETE] DELETE_LOAN_APP_COLLATERAL_FAILURE';


export class DeleteLoanApplicationCollateral implements Action {
  readonly type = DELETE_LOAN_APP_COLLATERAL;

  constructor(public payload?: any) {
  }
}

export class DeleteLoanApplicationCollateralLoading implements Action {
  readonly type = DELETE_LOAN_APP_COLLATERAL_LOADING;

  constructor(public payload?: any) {
  }
}

export class DeleteLoanApplicationCollateralSuccess implements Action {
  readonly type = DELETE_LOAN_APP_COLLATERAL_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class DeleteLoanApplicationCollateralReset implements Action {
  readonly type = DELETE_LOAN_APP_COLLATERAL_RESET;

  constructor(public payload?: any) {
  }
}

export class DeleteLoanApplicationCollateralFailure implements Action {
  readonly type = DELETE_LOAN_APP_COLLATERAL_FAILURE;

  constructor(public payload?: any) {
  }
}

export type LoanAppCollateralDelActions =
  DeleteLoanApplicationCollateral
  | DeleteLoanApplicationCollateralLoading
  | DeleteLoanApplicationCollateralSuccess
  | DeleteLoanApplicationCollateralReset
  | DeleteLoanApplicationCollateralFailure;




