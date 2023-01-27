import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { TermDepositProductCreateService } from './term-deposit-product-create.service';
import * as termDepositProductCreateActions from './term-deposit-product-create.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class TermDepositProductCreateEffects {

  @Effect()
  create_loan_product$ = this.actions$
    .pipe(ofType(termDepositProductCreateActions.CREATE_TERM_DEPOSIT_PRODUCT),
      switchMap((action: NgRxAction) => {
        return this.termDepositProductCreateService.createTermDepositProduct(action.payload).pipe(
          map(
            res => {
              return new termDepositProductCreateActions.CreateTermDepositProductSuccess(res);
            }
          ),
          catchError((err: HttpErrorResponse) => {
            const errObj = new termDepositProductCreateActions.CreateTermDepositProductFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private termDepositProductCreateService: TermDepositProductCreateService,
    private actions$: Actions) {
  }
}
