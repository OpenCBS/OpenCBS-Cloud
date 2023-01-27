import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as loanPurposeUpdateActions from './loan-purpose-update.actions';
import { LoanPurposeUpdateService } from './loan-purpose-update.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LoanPurposeUpdateEffects {

  @Effect()
  update_loanPurpose$ = this.actions$
    .pipe(ofType(loanPurposeUpdateActions.UPDATE_LOAN_PURPOSE),
      switchMap((action: loanPurposeUpdateActions.LoanPurposeUpdateActions) => {
        return this.loanPurposeUpdateService.updateLoanPurpose(action.payload.data, action.payload.fieldId).pipe(
          map(
            res => new loanPurposeUpdateActions.UpdateLoanPurposeSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanPurposeUpdateActions.UpdateLoanPurposeFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private loanPurposeUpdateService: LoanPurposeUpdateService,
              private actions$: Actions) {
  }
}
