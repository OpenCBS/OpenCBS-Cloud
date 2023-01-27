import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as creditLineActions from './credit-line.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { CreditLineService } from './credit-line.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class CreditLineEffects {
  @Effect()
  load_credit_line$: Observable<Action> = this.actions$
    .pipe(ofType(creditLineActions.LOAD_CREDIT_LINE),
      switchMap((action: NgRxAction) => {
        return this.creditLineService.getCreditLine(action.payload).pipe(
          map(
            res => new creditLineActions.LoadCreditLineSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new creditLineActions.LoadCreditLineFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private creditLineService: CreditLineService,
              private actions$: Actions) {
  }
}
