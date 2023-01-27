import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as termDepositActions from './term-deposit.actions';
import { NgRxAction } from '../../action.interface';
import { TermDepositService } from './term-deposit.service';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class TermDepositEffects {

  @Effect()
  get_term_deposit$ = this.actions$
    .pipe(ofType(termDepositActions.LOAD_TERM_DEPOSIT),
      switchMap((action: NgRxAction) => {
        return this.termDepositService.getTermDeposit(action.payload).pipe(
          map(res => {
            return new termDepositActions.LoadTermDepositSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new termDepositActions.LoadTermDepositFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private termDepositService: TermDepositService,
              private actions$: Actions) {
  }
}
