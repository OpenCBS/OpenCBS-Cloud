import { Injectable } from '@angular/core';
import { Observable, of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as termDepositListActions from './term-deposit-list.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { TermDepositListService } from './term-deposit-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TermDepositListEffects {
  @Effect()
  load_term_deposit$: Observable<Action> = this.actions$
    .pipe(ofType(termDepositListActions.LOAD_TERM_DEPOSITS),
      switchMap((action: NgRxAction) => {
        return this.termDepositListService.getTermDepositList(action.payload).pipe(
          map(
            res => new termDepositListActions.LoadTermDepositsSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new termDepositListActions.LoadTermDepositsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private termDepositListService: TermDepositListService,
              private actions$: Actions) {
  }
}
