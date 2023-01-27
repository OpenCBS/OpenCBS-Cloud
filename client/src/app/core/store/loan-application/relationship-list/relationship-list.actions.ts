import { Action } from '@ngrx/store';

export const LOAD_RELATIONSHIPS = '[RELATIONSHIP_LIST] LOAD_RELATIONSHIPS';
export const LOAD_RELATIONSHIPS_SUCCESS = '[RELATIONSHIP_LIST] LOAD_RELATIONSHIPS_SUCCESS';
export const LOAD_RELATIONSHIPS_FAILURE = '[RELATIONSHIP_LIST] LOAD_RELATIONSHIPS_FAILURE';
export const LOADING_RELATIONSHIPS = '[RELATIONSHIP_LIST] LOADING_RELATIONSHIPS';

export class LoadRelationships implements Action {
  readonly type = LOAD_RELATIONSHIPS;

  constructor(public payload?: any) {
  }
}

export class LoadingRelationships implements Action {
  readonly type = LOADING_RELATIONSHIPS;

  constructor(public payload?: any) {
  }
}

export class LoadRelationshipsSuccess implements Action {
  readonly type = LOAD_RELATIONSHIPS_SUCCESS;

  constructor(public payload?: any) {
  }
}

export class LoadRelationshipsFailure implements Action {
  readonly type = LOAD_RELATIONSHIPS_FAILURE;

  constructor(public payload?: any) {
  }
}

export type RelationshipListActions = LoadRelationships | LoadingRelationships | LoadRelationshipsSuccess | LoadRelationshipsFailure;
