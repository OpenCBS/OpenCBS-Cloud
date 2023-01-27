import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';


import * as loanApplicationCreateActions from './loan-application-create.actions';
import { LoanApplicationCreateService } from './loan-application-create.service';
import { NgRxAction } from '../../action.interface';

@Injectable()
export class LoanApplicationCreateEffects {
  @Effect()
  create_loan_application$ = this.actions$
    .pipe(ofType(loanApplicationCreateActions.CREATE_LOAN_APPLICATION),
      switchMap((action: NgRxAction) => {
        return this.loanApplicationCreateService.createLoanApplication(action.payload).pipe(
          map(
            res => new loanApplicationCreateActions.CreateLoanApplicationSuccess(res)),
          catchError((err): Observable<Action> => {
            const errObj = new loanApplicationCreateActions.CreateLoanApplicationFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private loanApplicationCreateService: LoanApplicationCreateService,
              private actions$: Actions) {

  }
}
