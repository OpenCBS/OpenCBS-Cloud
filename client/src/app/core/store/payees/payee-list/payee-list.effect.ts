import { of as observableOf, Observable } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';


import * as payeeListActions from './payee-list.actions';
import { PayeeListService } from './payee-list.service';
import { NgRxAction } from '../../action.interface';


@Injectable()
export class PayeeListEffects {

  @Effect()
  load_payees$: Observable<NgRxAction> = this.actions$
    .pipe(ofType(payeeListActions.LOAD_PAYEES),
    switchMap((action: NgRxAction) => {
      return this.payeeListService.getPayeeList(action.payload).pipe(
        map(
          res => {
            return new payeeListActions.LoadPayeesSuccess(res);
          }
        ),
        catchError((err): Observable<NgRxAction> => {
          const errObj = new payeeListActions.LoadPayeesFailure(err.error);
          return observableOf(errObj);
        }));
    }));

  constructor(
    private payeeListService: PayeeListService,
    private actions$: Actions) {
  }
}
