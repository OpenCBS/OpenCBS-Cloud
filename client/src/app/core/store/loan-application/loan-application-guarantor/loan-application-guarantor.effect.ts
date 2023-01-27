import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { LoanAppGuarantorService } from './loan-application-guarantor.service';
import * as loanAppGuarantorActions from './loan-application-guarantor.actions';


@Injectable()
export class LoanAppGuarantorEffects {

  @Effect()
  get_loan_application$ = this.actions$
    .pipe(ofType(loanAppGuarantorActions.LOAD_GUARANTOR),
      switchMap((action: loanAppGuarantorActions.LoanAppGuarantorActions) => {
        return this.loanApplicationService.getLoanAppGuarantor(action.payload.loanApplicationId, action.payload.guarantorId).pipe(
          map(res => {
            return new loanAppGuarantorActions.LoadGuarantorSuccess(res);
          }),
          catchError(err => {
            const errObj = new loanAppGuarantorActions.LoadGuarantorFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private loanApplicationService: LoanAppGuarantorService,
              private actions$: Actions) {
  }
}
