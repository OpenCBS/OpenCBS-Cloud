import { Action } from '@ngrx/store';

export const UPDATE_OTHER_FEE = '[OTHER_FEE_UPDATE] UPDATE_OTHER_FEE';
export const UPDATE_OTHER_FEE_LOADING = '[OTHER_FEE_UPDATE] UPDATE_OTHER_FEE_LOADING';
export const UPDATE_OTHER_FEE_SUCCESS = '[OTHER_FEE_UPDATE] UPDATE_OTHER_FEE_SUCCESS';
export const UPDATE_OTHER_FEE_FAILURE = '[OTHER_FEE_UPDATE] UPDATE_OTHER_FEE_FAILURE';
export const UPDATE_OTHER_FEE_RESET = '[OTHER_FEE_UPDATE] UPDATE_OTHER_FEE_RESET';

export class UpdateOtherFee implements Action {
  readonly type = UPDATE_OTHER_FEE;

  constructor(public payload?: any) {
  }
}

export class UpdateOtherFeeLoading implements Action {
  readonly type = UPDATE_OTHER_FEE_LOADING;

  constructor(public payload?: any) {
  }
}

export class UpdateOtherFeeSuccess implements Action {
  readonly type = UPDATE_OTHER_FEE_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class UpdateOtherFeeFailure implements Action {
  readonly type = UPDATE_OTHER_FEE_FAILURE;

  constructor(public payload?: any) {
  }
}

export class UpdateOtherFeeReset implements Action {
  readonly type = UPDATE_OTHER_FEE_RESET;

  constructor(public payload?: any) {
  }
}

export type OtherFeeUpdateActions =
  UpdateOtherFee | UpdateOtherFeeLoading | UpdateOtherFeeSuccess | UpdateOtherFeeFailure | UpdateOtherFeeReset;
