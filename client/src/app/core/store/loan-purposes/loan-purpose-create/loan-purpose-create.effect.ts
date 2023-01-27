import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as loanPurposeCreateActions from './loan-purpose-create.actions';
import { LoanPurposeCreateService } from './loan-purpose-create.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LoanPurposeCreateEffects {
  @Effect()
  create_loan_purpose$ = this.actions$
    .pipe(ofType(loanPurposeCreateActions.CREATE_LOAN_PURPOSE),
      switchMap((action: loanPurposeCreateActions.LoanPurposeCreateActions) => {
        return this.loanPurposeCreateService.createLoanPurpose(action.payload).pipe(
          map(
            res => new loanPurposeCreateActions.CreateLoanPurposeSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanPurposeCreateActions.CreateLoanPurposeFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private loanPurposeCreateService: LoanPurposeCreateService,
              private actions$: Actions) {

  }
}
