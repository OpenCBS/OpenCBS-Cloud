import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { ReduxBaseEffects } from '../../redux-base';


import { LoanAppCCActivityListActions } from './loan-application-cc-activity-list.actions';
import { LoanAppCCActivityListService } from './loan-application-cc-activity-list.service';
import { Observable } from 'rxjs';


@Injectable()
export class LoanAppCCActivityListEffects {

  @Effect()
  loan_app_cc_activity_list$: Observable<any> = ReduxBaseEffects.getConfig(this.actions$, this.loanAppCCActivityListActions, (action) => {
    return this.loanAppCCActivityListService.getLoanAppCCActivityList(action.payload.data);
  });


  constructor(private loanAppCCActivityListService: LoanAppCCActivityListService,
              private loanAppCCActivityListActions: LoanAppCCActivityListActions,
              private actions$: Actions) {
  }
}
