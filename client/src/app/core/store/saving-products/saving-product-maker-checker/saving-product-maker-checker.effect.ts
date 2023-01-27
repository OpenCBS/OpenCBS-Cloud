import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { SavingProductMakerCheckerService } from './saving-product-maker-checker.service';
import * as savingProductMakerCheckerActions from './saving-product-maker-checker.actions';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class SavingProductMakerCheckerEffects {

  @Effect()
  get_saving_product_maker_checker$ = this.actions$
    .pipe(ofType(savingProductMakerCheckerActions.LOAD_SAVING_PRODUCT_MAKER_CHECKER),
      switchMap((action: savingProductMakerCheckerActions.SavingProductMakerCheckerActions) => {
        return this.savingProductMakerCheckerService.getSavingProductMakerChecker(action.payload).pipe(
          map(res => new savingProductMakerCheckerActions.LoadSavingProductMakerCheckerSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new savingProductMakerCheckerActions.LoadSavingProductMakerCheckerFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private savingProductMakerCheckerService: SavingProductMakerCheckerService,
    private actions$: Actions) {
  }
}
