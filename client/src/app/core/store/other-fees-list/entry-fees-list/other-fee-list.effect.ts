import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';


import * as otherFeeListActions from './other-fee-list.actions';
import { OtherFeeListService } from './other-fee-list.service';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class OtherFeeListCreateEffects {

  @Effect()
  load_otherFees$: Observable<Action> = this.actions$
    .pipe(ofType(otherFeeListActions.LOAD_OTHER_FEES_LIST),
      switchMap(() => {
        return this.otherFeeListService.getOtherFeeList().pipe(
          map(
            res => new otherFeeListActions.LoadOtherFeesListSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new otherFeeListActions.LoadOtherFeesListFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private otherFeeListService: OtherFeeListService,
    private actions$: Actions) {
  }
}
