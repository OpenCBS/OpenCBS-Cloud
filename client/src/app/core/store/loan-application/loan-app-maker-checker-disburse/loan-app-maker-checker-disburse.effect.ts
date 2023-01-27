import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { LoanAppMakerCheckerDisburseService } from './loan-app-maker-checker-disburse.service';
import * as loanAppActions from './loan-app-maker-checker-disburse.actions';
import { NgRxAction } from '../../action.interface';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanAppMakerCheckerDisburseEffects {

  @Effect()
  get_loan_app_maker_checker_disburse$ = this.actions$
    .pipe(ofType(loanAppActions.LOAD_LOAN_APP_MAKER_CHECKER_DISBURSE),
      switchMap((action: NgRxAction) => {
        return this.loanAppMakerCheckerDisburseService.getLoanAppMakerChecker(action.payload).pipe(
          map(res => {
            return new loanAppActions.LoadLoanAppMakerCheckerDisburseSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanAppActions.LoadLoanAppMakerCheckerDisburseFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private loanAppMakerCheckerDisburseService: LoanAppMakerCheckerDisburseService,
              private actions$: Actions,
              public toastrService: ToastrService) {
  }
}
