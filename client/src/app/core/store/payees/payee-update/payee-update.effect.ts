import { of as observableOf, Observable } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Effect, Actions, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';


import { PayeeUpdateService } from './payee-update.service';
import * as payeeUpdateActions from './payee-update.actions';


@Injectable()
export class PayeeUpdateEffects {

  @Effect()
  update_payee$ = this.actions$
    .pipe(ofType(payeeUpdateActions.UPDATE_PAYEE),
    switchMap((action: payeeUpdateActions.PayeeUpdateActions) => {
      return this.payeeUpdateService.updatePayee(action.payload.data, action.payload.payeeId).pipe(
        map(
          res => {
            return new payeeUpdateActions.UpdatePayeeSuccess();
          }
        ),
        catchError((err): Observable<Action> => {
          const errObj = new payeeUpdateActions.UpdatePayeeFailure(err.error);
          return observableOf(errObj);
        }));
    }));

  constructor(private payeeUpdateService: PayeeUpdateService,
              private actions$: Actions) {
  }
}
