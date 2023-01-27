import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { CollateralTypeCreateService } from './collateral-type-create.service';
import { NgRxAction } from '../../action.interface';
import * as collateralTypeCreateActions from './collateral-type-create.actions'

@Injectable()
export class CollateralTypeCreateEffects {

  @Effect()
  create_collateral_type$ = this.actions$
    .pipe(ofType(collateralTypeCreateActions.CREATE_COLLATERAL_TYPE),
      switchMap((action: NgRxAction) => {
        return this.collateralTypeCreateService.createCollateralType(action.payload).pipe(
          map(
            () => new collateralTypeCreateActions.CreateCollateralTypeSuccess()),
          catchError((err): Observable<NgRxAction> => {
            const errObj = new collateralTypeCreateActions.CreateCollateralTypeFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private collateralTypeCreateService: CollateralTypeCreateService,
              private actions$: Actions) {
  }
}
