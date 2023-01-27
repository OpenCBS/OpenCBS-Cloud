import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as loanAppGuarantorsListActions from './loan-application-guarantors-list.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { LoanAppGuarantorsListService } from './loan-application-guarantors-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LoanAppGuarantorsListEffects {
  @Effect()
  load_loan_app_guarantors$: Observable<Action> = this.actions$
    .pipe(ofType(loanAppGuarantorsListActions.LOAD_GUARANTORS),
      switchMap((action: NgRxAction) => {
        return this.loanAppGuarantorsListService.getGuarantorsList(action.payload).pipe(
          map(
            res => {
              return new loanAppGuarantorsListActions.LoadGuarantorsSuccess(res);
            }
          ),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanAppGuarantorsListActions.LoadGuarantorsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private loanAppGuarantorsListService: LoanAppGuarantorsListService,
              private actions$: Actions) {
  }
}
