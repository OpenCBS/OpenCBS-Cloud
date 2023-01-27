import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { CCRulesUpdateService } from './credit-committee-edit.service';
import * as ccRulesUpdateActions from './credit-committee-edit.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class CCRulesUpdateEffects {

  @Effect()
  update_cc_rule$ = this.actions$
    .pipe(ofType(ccRulesUpdateActions.UPDATE_CC_RULE),
      switchMap((action: NgRxAction) => {
        return this.ccRulesUpdateService.updateCCRules(action.payload.creditCommittee, action.payload.ccId).pipe(
          map(
            res => new ccRulesUpdateActions.UpdateCCRulesSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new ccRulesUpdateActions.UpdateCCRulesFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private ccRulesUpdateService: CCRulesUpdateService,
              private actions$: Actions) {
  }
}
