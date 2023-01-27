import { Action } from '@ngrx/store';

export const LOAD_OTHER_FEES_LIST = '[OTHER_FEE_LIST] LOAD_OTHER_FEES_LIST';
export const LOAD_OTHER_FEES_LIST_SUCCESS = '[OTHER_FEE_LIST] LOAD_OTHER_FEES_LIST_SUCCESS';
export const LOAD_OTHER_FEES_LIST_FAILURE = '[OTHER_FEE_LIST] LOAD_OTHER_FEE_LIST_FAILURE';
export const LOADING_OTHER_FEES_LIST = '[OTHER_FEE_LIST] LOADING_OTHER_FEES_LIST';
export const OTHER_FEE_LIST_RESET = '[OTHER_FEE_LIST] OTHER_FEE_LIST_RESET';

export class LoadOtherFeesList implements Action {
  readonly type = LOAD_OTHER_FEES_LIST;
}

export class LoadingOtherFeesList implements Action {
  readonly type = LOADING_OTHER_FEES_LIST;
}

export class LoadOtherFeesListSuccess implements Action {
  readonly type = LOAD_OTHER_FEES_LIST_SUCCESS;

  constructor(public payload: any) {
  }
}

export class LoadOtherFeesListFailure implements Action {
  readonly type = LOAD_OTHER_FEES_LIST_FAILURE;

  constructor(public payload: any) {
  }
}

export class OtherFeesListReset implements Action {
  readonly type = OTHER_FEE_LIST_RESET;
}

export type OtherFeeListActions =
  LoadOtherFeesList | LoadingOtherFeesList | LoadOtherFeesListSuccess | LoadOtherFeesListFailure | OtherFeesListReset;
