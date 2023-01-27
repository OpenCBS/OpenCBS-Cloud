import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { ILoanAppState } from '../../../../core/store/loan-application/loan-application';
import { LoanAppStatus } from '../../../../core/loan-application-status.enum';
import * as LoanApplicationActions from '../../../../core/store/loan-application/loan-application/loan-application.actions'

@Injectable()
export class LoanAppSubmitService {

  constructor(private loanApplicationStore$: Store<ILoanAppState>) {
  }

  submitLoanApp(loanAppId, status) {
    if (status === LoanAppStatus[LoanAppStatus.IN_PROGRESS]) {
      this.loanApplicationStore$
      .dispatch(new LoanApplicationActions.SubmitLoanApp(loanAppId));
    } else if (status === LoanAppStatus[LoanAppStatus.APPROVED]) {
      this.loanApplicationStore$
      .dispatch(new LoanApplicationActions.DisburseLoanApp(loanAppId));
    }
  }
}
