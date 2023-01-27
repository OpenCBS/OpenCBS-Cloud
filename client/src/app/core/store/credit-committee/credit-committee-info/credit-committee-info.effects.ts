import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { CCRulesInfoService } from './credit-committee-info.service';
import * as ccRulesInfoActions from './credit-committee-info.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class CCRulesInfoEffects {

  @Effect()
  get_credit_committee$ = this.actions$
    .pipe(ofType(ccRulesInfoActions.LOAD_CC_RULES_INFO),
      switchMap((action: NgRxAction) => {
        return this.ccRulesInfoService.getCCRulesInfo(action.payload).pipe(
          map(res => new ccRulesInfoActions.LoadCCRulesInfoSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new ccRulesInfoActions.LoadCCRulesInfoFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private ccRulesInfoService: CCRulesInfoService,
    private actions$: Actions) {
  }
}
