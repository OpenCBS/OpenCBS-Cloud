import { catchError, map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as closureActions from './day-closure.actions';
import { NgRxAction } from '../../../action.interface';
import { DayClosureService } from './day-closure.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class DayClosureEffects {

  @Effect()
  load_payees$: Observable<NgRxAction> = this.actions$
    .pipe(ofType(closureActions.LOAD_DAY_CLOSURE),
      switchMap(() => {
        return this.dayClosureService.checkStatus()
          .pipe(
            map(
              res => {
                return new closureActions.PopulateDayClosure(res);
              }
            ),
            catchError((err: HttpErrorResponse) => {
              const errObj = new closureActions.LoadDayClosureFailure(err.error);
              return of(errObj);
            }));
      }));

  constructor(private actions$: Actions,
              private dayClosureService: DayClosureService) {
  }
}
