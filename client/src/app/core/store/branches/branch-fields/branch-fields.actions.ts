import { Action } from '@ngrx/store';

export const LOAD_BRANCH_FIELDS_META = '[BRANCH_FIELDS] LOAD_BRANCH_FIELDS_META';
export const LOADING_BRANCH_FIELDS_META = '[BRANCH_FIELDS] LOADING_BRANCH_FIELDS_META';
export const LOAD_BRANCH_FIELDS_META_SUCCESS = '[BRANCH_FIELDS] LOAD_BRANCH_FIELDS_META_SUCCESS';
export const LOAD_BRANCH_FIELDS_META_FAILURE = '[BRANCH_FIELDS] LOAD_BRANCH_FIELDS_META_FAILURE';
export const RESET_BRANCH_FIELDS_META = '[BRANCH_FIELDS] RESET_BRANCH_FIELDS_META';

export class LoadBranchFieldsMeta implements Action {
  readonly type = LOAD_BRANCH_FIELDS_META;

  constructor(public payload?: any) {
  }
}

export class LoadingBranchFieldsMeta implements Action {
  readonly type = LOADING_BRANCH_FIELDS_META;

  constructor(public payload?: any) {
  }
}

export class LoadBranchFieldsMetaSuccess implements Action {
  readonly type = LOAD_BRANCH_FIELDS_META_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadBranchFieldsMetaFailure implements Action {
  readonly type = LOAD_BRANCH_FIELDS_META_FAILURE;

  constructor(public payload?: any) {
  }
}

export class ResetBranchFieldsMeta implements Action {
  readonly type = RESET_BRANCH_FIELDS_META;

  constructor(public payload?: any) {
  }
}

export type BranchFieldsAction =
  LoadBranchFieldsMeta
  | LoadingBranchFieldsMeta
  | LoadBranchFieldsMetaSuccess
  | LoadBranchFieldsMetaFailure
  | ResetBranchFieldsMeta;
