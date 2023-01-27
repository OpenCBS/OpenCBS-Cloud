import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType } from '@ngrx/effects';

import { LoanAppCollateralService } from './loan-application-collateral.service';
import * as loanAppCollateralActions from './loan-application-collateral.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanAppCollateralEffects {

  @Effect()
  get_loan_application$ = this.actions$
    .pipe(ofType(loanAppCollateralActions.LOAD_COLLATERAL),
      switchMap((action: NgRxAction) => {
        return this.loanApplicationService.getLoanAppCollateral(action.payload.loanApplicationId, action.payload.collateralId)
          .pipe(
            map(res => new loanAppCollateralActions.LoadCollateralSuccess(res)),
            catchError((err: HttpErrorResponse) => {
              const errObj = new loanAppCollateralActions.LoadCollateralFailure(err.error);
              return observableOf(errObj);
            }));
      }));

  constructor(
    private loanApplicationService: LoanAppCollateralService,
    private actions$: Actions) {
  }
}
