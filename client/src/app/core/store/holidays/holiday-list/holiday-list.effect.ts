import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as holidayListActions from './holiday-list.actions';
import { HolidayListService } from './holiday-list.service';
import { Action } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class HolidayListEffects {

  @Effect()
  load_holidays$: Observable<Action> = this.actions$
    .pipe(ofType(holidayListActions.LOAD_HOLIDAYS),
      switchMap((action) => {
        return this.holidayListService.getHolidayList().pipe(
          map(
            res => new holidayListActions.LoadHolidaysSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new holidayListActions.LoadHolidaysFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private holidayListService: HolidayListService,
    private actions$: Actions) {
  }
}
