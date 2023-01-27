import { Action } from '@ngrx/store';

export const UPDATE_GUARANTOR = '[GUARANTOR_UPDATE] ';
export const UPDATE_GUARANTOR_LOADING = '[GUARANTOR_UPDATE] UPDATE_GUARANTOR_LOADING';
export const UPDATE_GUARANTOR_SUCCESS = '[GUARANTOR_UPDATE] UPDATE_GUARANTOR_SUCCESS';
export const UPDATE_GUARANTOR_FAILURE = '[GUARANTOR_UPDATE] UPDATE_GUARANTOR_FAILURE';
export const UPDATE_GUARANTOR_RESET = '[GUARANTOR_UPDATE] UPDATE_GUARANTOR_RESET';

export class UpdateGuarantor implements Action {
  readonly type = UPDATE_GUARANTOR;

  constructor(public payload: any) {
  }
}

export class UpdateGuarantorLoading implements Action {
  readonly type = UPDATE_GUARANTOR_LOADING;
}

export class UpdateGuarantorSuccess implements Action {
  readonly type = UPDATE_GUARANTOR_SUCCESS;

  constructor(public payload: any) {
  }
}

export class UpdateGuarantorFailure implements Action {
  readonly type = UPDATE_GUARANTOR_FAILURE;

  constructor(public payload: any) {
  }
}

export class UpdateGuarantorReset implements Action {
  readonly type = UPDATE_GUARANTOR_RESET;
}


export type LoanAppUpdateGuarantorActions =
  UpdateGuarantor
  | UpdateGuarantorLoading
  | UpdateGuarantorSuccess
  | UpdateGuarantorFailure
  | UpdateGuarantorReset;


