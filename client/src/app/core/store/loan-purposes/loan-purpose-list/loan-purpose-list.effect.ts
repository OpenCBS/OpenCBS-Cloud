import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as loanPurposeListActions from './loan-purpose-list.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { LoanPurposeListService } from './loan-purpose-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LoanPurposeListEffects {
  @Effect()
  load_loan_purposes$: Observable<NgRxAction> = this.actions$
    .pipe(ofType(loanPurposeListActions.LOAD_LOAN_PURPOSES),
      switchMap((action) => {
        return this.loanPurposeListService.getLoanPurposeList().pipe(
          map(
            res => new loanPurposeListActions.LoadLoanPurposesSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanPurposeListActions.LoadLoanPurposesFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private loanPurposeListService: LoanPurposeListService,
              private actions$: Actions) {
  }
}
