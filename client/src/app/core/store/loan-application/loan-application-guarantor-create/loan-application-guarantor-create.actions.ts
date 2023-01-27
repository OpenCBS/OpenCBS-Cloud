import { Action } from '@ngrx/store';

export const CREATE_GUARANTOR = '[GUARANTOR_CREATE] CREATE_GUARANTOR';
export const CREATE_GUARANTOR_LOADING = '[GUARANTOR_CREATE] CREATE_GUARANTOR_LOADING';
export const CREATE_GUARANTOR_SUCCESS = '[GUARANTOR_CREATE] CREATE_GUARANTOR_SUCCESS';
export const CREATE_GUARANTOR_FAILURE = '[GUARANTOR_CREATE] CREATE_GUARANTOR_FAILURE';
export const CREATE_GUARANTOR_RESET = '[GUARANTOR_CREATE] CREATE_GUARANTOR_RESET';

export class CreateGuarantor implements Action {
  readonly type = CREATE_GUARANTOR;

  constructor(public payload: any) {
  }
}

export class CreateGuarantorLoading implements Action {
  readonly type = CREATE_GUARANTOR_LOADING;
}

export class CreateGuarantorSuccess implements Action {
  readonly type = CREATE_GUARANTOR_SUCCESS;

  constructor(public payload: any) {
  }
}

export class CreateGuarantorFailure implements Action {
  readonly type = CREATE_GUARANTOR_FAILURE;

  constructor(public payload: any) {
  }
}

export class CreateGuarantorReset implements Action {
  readonly type = CREATE_GUARANTOR_RESET;
}

export type LoanAppGuarantorCreateActions =
  CreateGuarantor
  | CreateGuarantorLoading
  | CreateGuarantorSuccess
  | CreateGuarantorFailure
  | CreateGuarantorReset ;
