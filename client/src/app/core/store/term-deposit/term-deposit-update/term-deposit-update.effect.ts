import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as termDepositUpdateActions from './term-deposit-update.actions';
import { of as observableOf } from 'rxjs';
import { TermDepositUpdateService } from './term-deposit-update.service';
import { NgRxAction } from '../../action.interface';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TermDepositUpdateEffects {

  @Effect()
  update_term_deposit$ = this.actions$
    .pipe(ofType(termDepositUpdateActions.UPDATE_TERM_DEPOSIT),
      switchMap((action: NgRxAction) => {
        return this.termDepositUpdateService.updateTermDeposit(action.payload.id, action.payload.data).pipe(
          map(
            res => new termDepositUpdateActions.UpdateTermDepositSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new termDepositUpdateActions.UpdateTermDepositFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private termDepositUpdateService: TermDepositUpdateService,
              private actions$: Actions) {
  }
}
