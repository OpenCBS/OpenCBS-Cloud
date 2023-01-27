import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';


import * as LoanAttachmentDelActions from './loan-attachment-delete.actions';
import { LoanAttachmentDelService } from './loan-attachment-delete.service';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanAttachmentDeleteEffects {

  @Effect()
  delete_loan_attachment$ = this.actions$
    .pipe(ofType(LoanAttachmentDelActions.DELETE_LOAN_ATTACH),
      switchMap((action: LoanAttachmentDelActions.LoanAttachmentDelActions) => {
        return this.loanAttachmentDeleteService.deleteLoanAttachment(action.payload.attachmentId, action.payload.loanId).pipe(
          map(res => {
              return new LoanAttachmentDelActions.DeleteLoanAttachmentSuccess();
            }
          ),
          catchError((err: HttpErrorResponse) => {
            const errObj = new LoanAttachmentDelActions.DeleteLoanAttachmentFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private loanAttachmentDeleteService: LoanAttachmentDelService,
    private actions$: Actions) {
  }
}
