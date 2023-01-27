import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of as observableOf, Observable } from 'rxjs';

import * as loanEventsActions from './loan-events.actions';
import { LoanEventsService } from './loan-events.service';
import { NgRxAction } from '../../action.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';

@Injectable()
export class LoanEventsEffects {

  @Effect()
  load_loan_events$ = this.actions$
    .pipe(ofType(loanEventsActions.LOAD_LOAN_EVENTS),
    switchMap((action: NgRxAction) => {
      return this.loanEventsService.getLoanEvents(action.payload.id, action.payload.status)
        .pipe(map(res => {
            return new loanEventsActions.LoanEventsSuccess(res);
          }),
          catchError((res): Observable<Action> => {
            const errObj = new loanEventsActions.LoanEventsFailure(res.error);
            return observableOf(errObj);
          }));
    }));

  constructor(private loanEventsService: LoanEventsService,
              private actions$: Actions) {
  }
}
