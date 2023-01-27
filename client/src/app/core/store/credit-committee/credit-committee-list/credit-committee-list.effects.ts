import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as ccRulesListActions from './credit-committee-list.actions';
import { CCRulesListService } from './credit-committee-list.service';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class CCRulesListEffects {

  @Effect()
  load_cc_rules$: Observable<Action> = this.actions$
    .pipe(ofType(ccRulesListActions.LOAD_CC_RULES),
      switchMap((action) => {
        return this.CCListService.getCCRulesList().pipe(
          map(
            res => new ccRulesListActions.LoadCCRulesSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new ccRulesListActions.LoadCCRulesFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private CCListService: CCRulesListService,
    private actions$: Actions) {
  }
}
