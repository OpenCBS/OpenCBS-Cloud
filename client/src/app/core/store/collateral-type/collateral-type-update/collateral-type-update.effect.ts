import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { CollateralTypeUpdateService } from './collateral-type-update.service';
import * as collateralTypeUpdateActions from './collateral-type-update.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class CollateralTypeUpdateEffects {

  @Effect()
  update_collateralType$ = this.actions$
    .pipe(ofType(collateralTypeUpdateActions.UPDATE_COLLATERAL_TYPE),
      switchMap((action: NgRxAction) => {
        return this.collateralTypeUpdateService.updateCollateralType(action.payload.data, action.payload.id).pipe(
          map(
            () => new collateralTypeUpdateActions.UpdateCollateralTypeSuccess()),
          catchError((err: HttpErrorResponse) => {
            const errObj = new collateralTypeUpdateActions.UpdateCollateralTypeFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private collateralTypeUpdateService: CollateralTypeUpdateService,
              private actions$: Actions) {
  }
}
