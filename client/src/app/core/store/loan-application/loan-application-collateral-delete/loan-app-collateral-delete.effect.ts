import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Observable } from 'rxjs';
import { Action } from '@ngrx/store';


import { LoanAppCollateralDeleteService } from './loan-app-collateral-delete.service';
import * as loanAppCollateralDelActions from './loan-app-collateral-delete.actions';
import { NgRxAction } from '../../action.interface';


@Injectable()
export class LoanAppCollateralDeleteEffects {

  @Effect()
  delete_loan_app_collateral$ = this.actions$
    .pipe(ofType(loanAppCollateralDelActions.DELETE_LOAN_APP_COLLATERAL),
      switchMap((action: NgRxAction) => {
        return this.loanAppCollateralDeleteService.deleteLoanApplicationCollateral(
          action.payload.loanAppId,
          action.payload.collateralId).pipe(map(res => {
            return new loanAppCollateralDelActions.DeleteLoanApplicationCollateralSuccess();
          }
        ));
      }));

  constructor(private loanAppCollateralDeleteService: LoanAppCollateralDeleteService,
              private actions$: Actions) {
  }
}
