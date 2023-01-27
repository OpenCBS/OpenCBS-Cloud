import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as loanAppAttachmentListActions from './loan-application-attachments-list.actions';
import { LoanAppAttachmentListService } from './loan-application-attachments-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class LoanAppAttachmentListEffects {

  @Effect()
  load_loanAppAttachments$: Observable<NgRxAction> = this.actions$
    .pipe(ofType(loanAppAttachmentListActions.LOAD_LOAN_APP_ATTACHMENTS),
      switchMap((action: NgRxAction) => {
        return this.loanAppAttachmentListService.getLoanAppAttachmentList(action.payload.loanAppId).pipe(
          map(
            res => new loanAppAttachmentListActions.LoadLoanAppAttachmentsSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanAppAttachmentListActions.LoadLoanAppAttachmentsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private loanAppAttachmentListService: LoanAppAttachmentListService,
    private actions$: Actions) {
  }
}
