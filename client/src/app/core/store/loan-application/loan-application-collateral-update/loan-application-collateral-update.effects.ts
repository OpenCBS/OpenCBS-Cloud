import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType } from '@ngrx/effects';
import * as loanAppCollateralUpdateActions from './loan-application-collateral-update.actions';
import { Action } from '@ngrx/store';
import { LoanAppCollateralUpdateService } from './loan-application-collateral-update.service';
import { NgRxAction } from '../../action.interface';

@Injectable()
export class LoanAppCollateralUpdateEffects {

  @Effect()
  update_collateral$ = this.actions$
    .pipe(ofType(loanAppCollateralUpdateActions.UPDATE_COLLATERAL),
      switchMap((action: NgRxAction) => {
        return this.collateralUpdateService.updateCollateral(action.payload.loanAppId, action.payload.data)
          .pipe(
            map(
              res => {
                return new loanAppCollateralUpdateActions.UpdateCollateralSuccess(res);
              }
            ),
            catchError((err): Observable<Action> => {
              const errObj = new loanAppCollateralUpdateActions.UpdateCollateralFailure(err.error);
              return observableOf(errObj);
            }));
      }));

  constructor(private collateralUpdateService: LoanAppCollateralUpdateService,
              private actions$: Actions) {
  }
}
