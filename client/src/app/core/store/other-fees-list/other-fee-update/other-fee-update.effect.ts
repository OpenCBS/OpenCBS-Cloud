import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { OtherFeeUpdateService } from './other-fee-update.service';
import * as otherFeeUpdateActions from './other-fee-update.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class OtherFeeUpdateEffects {

  @Effect()
  update_otherFeeList$ = this.actions$
    .pipe(ofType(otherFeeUpdateActions.UPDATE_OTHER_FEE),
      switchMap((action: NgRxAction) => {
        return this.otherFeeUpdateService.updateOtherFee(action.payload.data, action.payload.otherFeeId).pipe(
          map(
            res => new otherFeeUpdateActions.UpdateOtherFeeSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new otherFeeUpdateActions.UpdateOtherFeeFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private otherFeeUpdateService: OtherFeeUpdateService,
              private actions$: Actions) {
  }
}
