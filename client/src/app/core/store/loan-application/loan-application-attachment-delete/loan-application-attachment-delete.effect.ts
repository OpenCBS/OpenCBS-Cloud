import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { LoanApplicationAttachmentDelService } from './loan-application-attachment-delete.service';
import * as loanApplicationAttachmentDelActions from './loan-application-attachment-delete.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanApplicationAttachmentDeleteEffects {

  @Effect()
  delete_loan_app_attachment$ = this.actions$
    .pipe(ofType(loanApplicationAttachmentDelActions.DELETE_LOAN_APP_ATTACH),
      switchMap((action: NgRxAction) => {
        return this.profileAttachmentDeleteService.deleteLoanApplicationAttachment(
          action.payload.attachmentId,
          action.payload.loanAppId).pipe(
          map(
            () => new loanApplicationAttachmentDelActions.DeleteLoanApplicationAttachmentSuccess()),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanApplicationAttachmentDelActions.DeleteLoanApplicationAttachmentFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private profileAttachmentDeleteService: LoanApplicationAttachmentDelService,
    private actions$: Actions) {
  }
}
