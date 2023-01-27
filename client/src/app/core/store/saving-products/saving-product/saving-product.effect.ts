import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { SavingProductService } from './saving-product.service';
import * as savingProductActions from './saving-product.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class SavingProductEffects {

  @Effect()
  get_saving_product$ = this.actions$
    .pipe(ofType(savingProductActions.LOAD_SAVING_PRODUCT),
      switchMap((action: savingProductActions.SavingProductActions) => {
        return this.savingProductService.getSavingProduct(action.payload).pipe(
          map(res => new savingProductActions.LoadSavingProductSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new savingProductActions.LoadSavingProductFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private savingProductService: SavingProductService,
    private actions$: Actions) {
  }
}
