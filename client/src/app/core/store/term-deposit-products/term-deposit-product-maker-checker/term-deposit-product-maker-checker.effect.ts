import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { TermDepositProductMakerCheckerService } from './term-deposit-product-maker-checker.service';
import * as termDepositProductMakerCheckerActions from './term-deposit-product-maker-checker.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class TermDepositProductMakerCheckerEffects {

  @Effect()
  get_term_deposit_product_maker_checker$ = this.actions$
    .pipe(ofType(termDepositProductMakerCheckerActions.LOAD_TERM_DEPOSIT_PRODUCT_MAKER_CHECKER),
      switchMap((action: NgRxAction) => {
        return this.termDepositProductMakerCheckerService.getTermDepositProductMakerChecker(action.payload).pipe(
          map(res => new termDepositProductMakerCheckerActions.LoadTermDepositProductMakerCheckerSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new termDepositProductMakerCheckerActions.LoadTermDepositProductMakerCheckerFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private termDepositProductMakerCheckerService: TermDepositProductMakerCheckerService,
    private actions$: Actions) {
  }
}
