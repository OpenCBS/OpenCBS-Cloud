import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { CollateralTypeDetailsService } from './collateral-type-details.service';
import { NgRxAction } from '../../action.interface';
import * as collateralTypeDetailsActions from './collateral-type-details.actions'
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class CollateralTypeDetailsEffects {

  @Effect()
  get_collateral_type_details$ = this.actions$
    .pipe(ofType(collateralTypeDetailsActions.LOAD_COLLATERAL_TYPE_DETAILS),
      switchMap((action: NgRxAction) => {
        return this.collateralTypeDetailsService.getCollateralTypeDetails(action.payload).pipe(
          map(res => {
              return new collateralTypeDetailsActions.LoadCollateralTypeSuccess(res);
            },
            (err: HttpErrorResponse) => {
              return new collateralTypeDetailsActions.LoadCollateralTypeFailure(err.error);
            }));
      }));

  constructor(
    private collateralTypeDetailsService: CollateralTypeDetailsService,
    private actions$: Actions) {
  }
}
