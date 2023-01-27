import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType } from '@ngrx/effects';


import { LoanAppCollateralCreateService } from './loan-application-collateral-create.service';
import * as loanAppCollateralCreateActions from './loan-application-collateral-create.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanAppCreateCollateralEffects {

  @Effect()
  create_collateral$ = this.actions$
    .pipe(ofType(loanAppCollateralCreateActions.CREATE_COLLATERAL),
      switchMap((action: NgRxAction) => {
        return this.collateralCreateService.createCollateral(action.payload.loanAppId, action.payload.data)
          .pipe(
            map(res => new loanAppCollateralCreateActions.CreateCollateralSuccess(res)),
            catchError((err: HttpErrorResponse) => {
              const errObj = new loanAppCollateralCreateActions.CreateCollateralFailure(err.error);
              return observableOf(errObj);
            }));
      }));

  constructor(
    private collateralCreateService: LoanAppCollateralCreateService,
    private actions$: Actions) {
  }
}
