import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of as observableOf, Observable } from 'rxjs';

import * as loanMakerCheckerRollbackActions from './loan-maker-checker-rollback.actions';
import { LoanMakerCheckerRollbackService } from './loan-maker-checker-rollback.service';
import { NgRxAction } from '../../action.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Action } from '@ngrx/store';

@Injectable()
export class LoanMakerCheckerRollbackEffects {

  @Effect()
  load_loan_maker_checker_rollback$ = this.actions$
    .pipe(ofType(loanMakerCheckerRollbackActions.LOAD_LOAN_MAKER_CHECKER_ROLLBACK),
    switchMap((action: NgRxAction) => {
      return this.loanMakerCheckerRollbackService.getLoanMakerCheckerRollback(action.payload.id)
        .pipe(map(res => {
            return new loanMakerCheckerRollbackActions.LoanMakerCheckerRollbackSuccess(res);
          }),
          catchError((res): Observable<Action> => {
            const errObj = new loanMakerCheckerRollbackActions.LoanMakerCheckerRollbackFailure(res.error);
            return observableOf(errObj);
          }));
    }));

  constructor(private loanMakerCheckerRollbackService: LoanMakerCheckerRollbackService,
              private actions$: Actions) {
  }
}
