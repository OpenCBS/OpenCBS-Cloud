import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as loanApplicationListActions from './loan-application-list.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { LoanApplicationListService } from './loan-application-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LoanApplicationListEffects {
  @Effect()
  load_loan_applications$: Observable<Action> = this.actions$
    .pipe(ofType(loanApplicationListActions.LOAD_LOAN_APPLICATIONS),
      switchMap((action: NgRxAction) => {
        return this.loanApplicationListService.getLoanApplicationList(action.payload).pipe(
          map(
            res => new loanApplicationListActions.LoadLoanApplicationsSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanApplicationListActions.LoadLoanApplicationsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private loanApplicationListService: LoanApplicationListService,
              private actions$: Actions) {
  }
}
