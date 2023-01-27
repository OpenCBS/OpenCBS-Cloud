import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { SavingProductUpdateService } from './saving-product-update.service';
import * as savingProductUpdateActions from './saving-product-update.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class SavingProductUpdateEffects {

  @Effect()
  update_saving_product$ = this.actions$
    .pipe(ofType(savingProductUpdateActions.UPDATE_SAVING_PRODUCT),
      switchMap((action: savingProductUpdateActions.SavingProductUpdateActions) => {
        return this.savingProductUpdateService.updateSavingProduct(action.payload.savingProduct, action.payload.id).pipe(
          map(
            res => new savingProductUpdateActions.UpdateSavingProductSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new savingProductUpdateActions.UpdateSavingProductFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private savingProductUpdateService: SavingProductUpdateService,
    private actions$: Actions) {
  }
}
