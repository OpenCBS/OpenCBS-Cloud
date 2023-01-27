import { of as observableOf, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import { LoanPayeeEventsService } from './loan-payee-events.service';
import * as loanPayeeEventActions from './loan-payee-events.actions'
import { catchError, map, switchMap } from 'rxjs/operators';
import { NgRxAction } from '../../action.interface';
import { Action } from '@ngrx/store';

@Injectable()
export class LoanPayeeEventsEffects {

  @Effect()
  load_loan_payee_events$ = this.actions$
    .pipe(ofType(loanPayeeEventActions.LOAD_LOAN_PAYEE_EVENTS),
   switchMap((action: NgRxAction) => {
      return this.loanPayeeEventsService.getLoanPayeeEvents(action.payload.id)
        .pipe(map(res => {
            return new loanPayeeEventActions.LoanPayeeEventsSuccess(res);
          }),
          catchError((res): Observable<Action> => {
            const errObj = new loanPayeeEventActions.LoanPayeeEventsFailure(res.error);
            return observableOf(errObj);
          }));
    }));

  constructor(private loanPayeeEventsService: LoanPayeeEventsService,
              private actions$: Actions) {
  }
}
