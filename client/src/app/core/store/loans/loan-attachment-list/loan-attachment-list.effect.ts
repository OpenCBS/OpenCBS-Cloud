import { of as observableOf, Observable } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { LoanAttachmentListService } from './loan-attachment-list.service';
import * as LoanAttachmentListActions from './loan-attachment-list.actions';

@Injectable()
export class LoanAttachmentListEffects {

  @Effect()
  get_loan_attachment_list$ = this.actions$.pipe(ofType(LoanAttachmentListActions.LOAD_LOAN_ATTACHMENT_LIST),
    switchMap((action: LoanAttachmentListActions.LoanAttachmentListActions) => {
      return this.loanAttachmentListService.getLoanAttachmentList(action.payload).pipe(
        map(res => {
          return new LoanAttachmentListActions.LoadLoanAttachmentListSuccess(res);
        }), catchError(err => {
          const errObj = new LoanAttachmentListActions.LoadLoanAttachmentListFailure(err.error);
          return observableOf(errObj);
        }));
    }));

  constructor(private loanAttachmentListService: LoanAttachmentListService,
              private actions$: Actions) {
  }
}
