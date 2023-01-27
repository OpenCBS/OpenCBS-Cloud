import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { SavingProductCreateService } from './saving-product-create.service';
import * as savingProductCreateActions from './saving-product-create.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class SavingProductCreateEffects {

  @Effect()
  create_saving_product$ = this.actions$
    .pipe(ofType(savingProductCreateActions.CREATE_SAVING_PRODUCT),
      switchMap((action: savingProductCreateActions.SavingProductCreateActions) => {
        return this.savingProductCreateService.createSavingProduct(action.payload).pipe(
          map(
            res => new savingProductCreateActions.CreateSavingProductSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new savingProductCreateActions.CreateSavingProductFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private savingProductCreateService: SavingProductCreateService,
    private actions$: Actions) {
  }
}
