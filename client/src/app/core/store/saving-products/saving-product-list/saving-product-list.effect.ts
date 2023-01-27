import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { SavingProductListService } from './saving-product-list.service';
import * as savingProductListActions from './saving-product-list.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class SavingProductListEffect {

  @Effect()
  get_saving_product_list$ = this.actions$
    .pipe(ofType(savingProductListActions.LOAD_SAVING_PRODUCTS),
      switchMap((action: savingProductListActions.SavingProductListActions) => {
        return this.savingProductListService.getSavingProductList(action.payload).pipe(
          map(res => {
            return new savingProductListActions.LoadSavingProductListSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new savingProductListActions.LoadSavingProductListFail(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private savingProductListService: SavingProductListService,
              private actions$: Actions) {
  }
}
