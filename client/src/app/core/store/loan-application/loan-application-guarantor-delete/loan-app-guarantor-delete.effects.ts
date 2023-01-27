import { map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { LoanAppGuarantorDeleteService } from './loan-app-guarantor-delete.service';
import * as LoanAppGuarantorDeleteActions from './loan-app-guarantor-delete.actions';


@Injectable()
export class LoanAppGuarantorDeleteEffects {

  @Effect()
  delete_loan_app_guarantor$ = this.actions$
    .pipe(ofType(LoanAppGuarantorDeleteActions.DELETE_LOAN_APP_GUARANTOR),
    switchMap((action: LoanAppGuarantorDeleteActions.LoanAppGuarantorDeleteActions) => {
      return this.loanAppGuarantorDeleteService.deleteLoanApplicationGuarantor(
        action.payload.loanAppId,
        action.payload.guarantorId).pipe(map(() => new LoanAppGuarantorDeleteActions.DeleteLoanAppGuarantorSuccess()));
    }));

  constructor(private loanAppGuarantorDeleteService: LoanAppGuarantorDeleteService,
              private actions$: Actions) {
  }
}
