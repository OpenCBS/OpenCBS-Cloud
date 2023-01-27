import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { of as observableOf } from 'rxjs';
import * as termDepositCreateActions from './term-deposit-create.actions';
import { NgRxAction } from '../../action.interface';
import { TermDepositCreateService } from './term-deposit-create.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class TermDepositCreateEffect {
  @Effect()
  create_term_deposit$ = this.actions$
    .pipe(ofType(termDepositCreateActions.CREATE_TERM_DEPOSIT),
      switchMap((action: NgRxAction) => {
        return this.termDepositCreateService.addTermDeposit(action.payload).pipe(map(res => {
            return new termDepositCreateActions.CreateTermDepositSuccess(res);
          }
          ),
          catchError((err: HttpErrorResponse) => {
            const errObj = new termDepositCreateActions.CreateTermDepositFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private termDepositCreateService: TermDepositCreateService,
              private actions$: Actions) {

  }
}
