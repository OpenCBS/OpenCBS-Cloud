import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { HolidayUpdateService } from './holiday-update.service';
import * as holidayUpdateActions from './holiday-update.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class HolidayUpdateEffects {

  @Effect()
  update_holiday$ = this.actions$
    .pipe(ofType(holidayUpdateActions.UPDATE_HOLIDAY),
      switchMap((action: NgRxAction) => {
        return this.holidayUpdateService.updateHoliday(action.payload.obj, action.payload.holidayId).pipe(
          map(
            res => new holidayUpdateActions.UpdateHolidaySuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new holidayUpdateActions.UpdateHolidayFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private holidayUpdateService: HolidayUpdateService,
              private actions$: Actions) {
  }
}
