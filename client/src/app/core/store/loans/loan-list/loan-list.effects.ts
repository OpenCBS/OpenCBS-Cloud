import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';

import { LoanListService } from './loan-list.service';
import * as loanListActions from './loan-list.actions';
import { NgRxAction } from '../../action.interface';


@Injectable()
export class LoanListEffects {

  @Effect()
  get_loan_product_list$ = this.actions$
    .pipe(ofType(loanListActions.LOAD_LOANS),
      switchMap((action: NgRxAction) => {
        return this.loanListService.getLoanList(action.payload)
          .pipe(
            map(res => {
              return new loanListActions.LoadLoanListSuccess(res);
            }),
            catchError(err => {
              const errObj = new loanListActions.LoadLoanListFailure(err.error);
              return observableOf(errObj);
            }));
      }));

  constructor(
    private loanListService: LoanListService,
    private actions$: Actions) {
  }
}
