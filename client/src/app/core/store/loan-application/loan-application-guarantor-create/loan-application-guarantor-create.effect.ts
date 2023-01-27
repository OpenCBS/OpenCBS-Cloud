import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType } from '@ngrx/effects';


import { LoanAppGuarantorCreateService } from './loan-application-guarantor-create.service';
import * as loanAppGuarantorCreateActions from './loan-application-guarantor-create.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanAppCreateGuarantorEffects {

  @Effect()
  create_guarantor$ = this.actions$
    .pipe(ofType(loanAppGuarantorCreateActions.CREATE_GUARANTOR),
      switchMap((action: NgRxAction) => {
        return this.guarantorCreateService.createGuarantor(action.payload.loanAppId, action.payload.data)
          .pipe(
            map(res => new loanAppGuarantorCreateActions.CreateGuarantorSuccess(res)),
            catchError((err: HttpErrorResponse) => {
              const errObj = new loanAppGuarantorCreateActions.CreateGuarantorFailure(err.error);
              return observableOf(errObj);
            }));
      }));

  constructor(
    private guarantorCreateService: LoanAppGuarantorCreateService,
    private actions$: Actions) {
  }
}
