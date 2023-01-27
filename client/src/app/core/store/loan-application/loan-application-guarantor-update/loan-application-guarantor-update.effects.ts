import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as loanAppUpdateGuarantorActions from './loan-application-guarantor-update.actions';
import { LoanAppUpdateGuarantorService } from './loan-application-guarantor-update.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LoanAppUpdateGuarantorEffects {
  @Effect()
  update_guarantor$ = this.actions$
    .pipe(ofType(loanAppUpdateGuarantorActions.UPDATE_GUARANTOR),
      switchMap((action: NgRxAction) => {
        return this.guarantorUpdateService.updateGuarantor(action.payload.loanAppId, action.payload.data).pipe(
          map(
            res => new loanAppUpdateGuarantorActions.UpdateGuarantorSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new loanAppUpdateGuarantorActions.UpdateGuarantorFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private guarantorUpdateService: LoanAppUpdateGuarantorService,
              private actions$: Actions) {
  }
}
