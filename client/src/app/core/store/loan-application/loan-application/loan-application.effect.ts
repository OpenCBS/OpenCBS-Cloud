import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { LoanApplicationService } from './loan-application.service';
import * as loanApplicationActions from './loan-application.actions';
import { NgRxAction } from '../../action.interface';
import { environment } from '../../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanApplicationEffects {

  @Effect()
  get_loan_application$ = this.actions$
    .pipe(ofType(loanApplicationActions.LOAD_LOAN_APPLICATION),
      switchMap((action: NgRxAction) => {
        return this.loanApplicationService.getLoanApplication(action.payload).pipe(
          map(res => new loanApplicationActions.LoadLoanApplicationSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanApplicationActions.LoadLoanApplicationFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  @Effect()
  change_cc_status$ = this.actions$
    .pipe(ofType(loanApplicationActions.CHANGE_CC_STATUS),
      switchMap((action: NgRxAction) => {
        return this.loanApplicationService.changeCCStatus(action.payload.loanAppId, action.payload.data).pipe(
          map(() => new loanApplicationActions.LoadLoanApplication(action.payload.loanAppId)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanApplicationActions.LoadLoanApplicationFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  @Effect()
  submit_loan_application$ = this.actions$
    .pipe(ofType(loanApplicationActions.SUBMIT_LOAN_APPLICATION),
      switchMap((action: NgRxAction) => {
        return this.loanApplicationService.submitLoanApplication(action.payload).pipe(
          map(() => new loanApplicationActions.LoadLoanApplication(action.payload)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanApplicationActions.LoadLoanApplicationFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  @Effect()
  disburse_loan_application$ = this.actions$
    .pipe(ofType(loanApplicationActions.DISBURSE_LOAN_APPLICATION),
      switchMap((action: NgRxAction) => {
        return this.loanApplicationService.disburseLoanApplication(action.payload).pipe(
          map(() => {
            this.translate.get('SUCCESS_DISBURSED')
              .subscribe((response: string) => {
                this.toastrService.success(response, '', environment.SUCCESS_TOAST_CONFIG);
              });
            return new loanApplicationActions.LoadLoanApplication(action.payload);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanApplicationActions.LoadLoanApplicationFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private loanApplicationService: LoanApplicationService,
              private actions$: Actions,
              public toastrService: ToastrService,
              private translate: TranslateService) {
  }
}
