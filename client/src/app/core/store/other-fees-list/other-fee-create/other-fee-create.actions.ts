import { Action } from '@ngrx/store';

export const CREATE_OTHER_FEE = '[OTHER_FEE_CREATE] CREATE_OTHER_FEE';
export const CREATE_OTHER_FEE_LOADING = '[OTHER_FEE_CREATE] CREATE_OTHER_FEE_LOADING';
export const CREATE_OTHER_FEE_SUCCESS = '[OTHER_FEE_CREATE] CREATE_OTHER_FEE_SUCCESS';
export const CREATE_OTHER_FEE_FAILURE = '[OTHER_FEE_CREATE] CREATE_OTHER_FEE_FAILURE';
export const CREATE_OTHER_FEE_RESET = '[OTHER_FEE_CREATE] CREATE_OTHER_FEE_RESET';

export class CreateOtherFee implements Action {
  readonly type = CREATE_OTHER_FEE;

  constructor(public payload: any) {
  }
}

export class CreateOtherFeeLoading implements Action {
  readonly type = CREATE_OTHER_FEE_LOADING;
}

export class CreateOtherFeeSuccess implements Action {
  readonly type = CREATE_OTHER_FEE_SUCCESS;
}

export class CreateOtherFeeFailure implements Action {
  readonly type = CREATE_OTHER_FEE_FAILURE;

  constructor(public payload: any) {
  }
}

export class CreateOtherFeeReset implements Action {
  readonly type = CREATE_OTHER_FEE_RESET;
}


export type OtherFeeCreateActions =
  CreateOtherFee | CreateOtherFeeLoading | CreateOtherFeeSuccess | CreateOtherFeeFailure | CreateOtherFeeReset;
