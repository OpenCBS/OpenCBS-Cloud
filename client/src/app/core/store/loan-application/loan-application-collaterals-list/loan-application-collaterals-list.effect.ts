import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType } from '@ngrx/effects';

import * as loanAppCollateralListActions from './loan-application-collaterals-list.actions';
import { LoanAppCollateralListService } from './loan-application-collaterals-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanAppCollateralListEffects {
  @Effect()
  load_loan_app_collateral$: Observable<NgRxAction> = this.actions$
    .pipe(ofType(loanAppCollateralListActions.LOAD_COLLATERALS),
      switchMap((action: NgRxAction) => {
        return this.loanAppCollateralListService.getCollateralList(action.payload)
          .pipe(
            map(
              res => new loanAppCollateralListActions.LoadCollateralsSuccess(res)),
            catchError((err: HttpErrorResponse) => {
              const errObj = new loanAppCollateralListActions.LoadCollateralsFailure(err.error);
              return observableOf(errObj);
            }));
      }));

  constructor(private loanAppCollateralListService: LoanAppCollateralListService,
              private actions$: Actions) {
  }
}
