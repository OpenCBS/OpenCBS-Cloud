import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AuditTrailService } from './audit-trail.service';
import * as auditTrailActions from './audit-trail.actions'


@Injectable()
export class AuditTrailEffects {
  @Effect()
  get_audit_trail$ = this.actions$
  .pipe(ofType(auditTrailActions.LOAD_AUDIT_TRAIL),
    switchMap((action: auditTrailActions.AuditTrailActions) => {
      return this.auditTrailService.getAuditTrail(action.payload.reportType, action.payload.params).pipe(
        map(res => {
          return new auditTrailActions.LoadAuditTrailSuccess(res);
        }),
        catchError(err => {
          const errObj = new auditTrailActions.LoadAuditTrailFailure(err.error);
          return observableOf(errObj);
        }));
    }));

  constructor(private auditTrailService: AuditTrailService,
              private actions$: Actions) {
  }
}
