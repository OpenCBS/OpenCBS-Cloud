import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { OtherFeeCreateService } from './other-fee-create.service';
import * as otherFeeCreateActions from './other-fee-create.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class OtherFeeEffects {

  @Effect()
  create_otherFee$ = this.actions$
    .pipe(ofType(otherFeeCreateActions.CREATE_OTHER_FEE),
      switchMap((action: NgRxAction) => {
        return this.otherFeeCreateService.createOtherFee(action.payload).pipe(
          map(
            () => new otherFeeCreateActions.CreateOtherFeeSuccess()),
          catchError((err: HttpErrorResponse) => {
            const errObj = new otherFeeCreateActions.CreateOtherFeeFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private otherFeeCreateService: OtherFeeCreateService,
              private actions$: Actions) {
  }
}
