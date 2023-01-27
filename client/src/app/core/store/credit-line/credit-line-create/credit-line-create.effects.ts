import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { CreditLineCreateService } from './credit-line-create.service';
import * as creditLineCreateActions from './credit-line-create.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class CreditLineCreateEffects {

  @Effect()
  create_loan_product$ = this.actions$
    .pipe(ofType(creditLineCreateActions.CREATE_CREDIT_LINE),
      switchMap((action: NgRxAction) => {
        return this.creditLineCreateService.createCreditLine(action.payload).pipe(
          map(
            res => {
              return new creditLineCreateActions.CreateCreditLineSuccess(res);
            }
          ),
          catchError((err: HttpErrorResponse) => {
            const errObj = new creditLineCreateActions.CreateCreditLineFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private creditLineCreateService: CreditLineCreateService,
    private actions$: Actions) {
  }
}
