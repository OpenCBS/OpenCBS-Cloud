import { Action } from '@ngrx/store';

export const LOAD_AUDIT_TRAIL = '[AUDIT_TRAIL] Load audit trail';
export const LOAD_AUDIT_TRAIL_SUCCESS = '[AUDIT_TRAIL] Load audit trail success';
export const LOAD_AUDIT_TRAIL_FAILURE = '[AUDIT_TRAIL] Load audit trail failure';
export const RESET_AUDIT_TRAIL = '[AUDIT_TRAIL] Reset audit trail';

export class LoadAuditTrail implements Action {
  readonly type = LOAD_AUDIT_TRAIL;
  constructor(public payload?: any) {
  }
}

export class LoadAuditTrailSuccess implements Action {
  readonly type = LOAD_AUDIT_TRAIL_SUCCESS;
  constructor(public payload?: any) {
  }
}

export class LoadAuditTrailFailure implements Action {
  readonly type = LOAD_AUDIT_TRAIL_FAILURE;
  constructor(public payload?: any) {
  }
}

export class ResetAuditTrail implements Action {
  readonly type = RESET_AUDIT_TRAIL;
  constructor(public payload?: any) {
  }
}

export type AuditTrailActions =
  LoadAuditTrail
  | LoadAuditTrailSuccess
  | LoadAuditTrailFailure
  | ResetAuditTrail;

