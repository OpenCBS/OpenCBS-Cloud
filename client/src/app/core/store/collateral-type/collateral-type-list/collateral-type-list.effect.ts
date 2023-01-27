import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as collateralTypeListActions from './collateral-type-list.actions';
import { CollateralTypeListService } from './collateral-type-list.service';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class CollateralTypeListEffects {

  @Effect()
  load_collateralTypes$: Observable<Action> = this.actions$
    .pipe(ofType(collateralTypeListActions.LOAD_COLLATERAL_TYPES),
      switchMap((action) => {
        return this.collateralTypeListService.getCollateralTypeList().pipe(
          map(
            res => new collateralTypeListActions.LoadCollateralTypesSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new collateralTypeListActions.LoadCollateralTypesFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private collateralTypeListService: CollateralTypeListService,
    private actions$: Actions) {
  }
}
