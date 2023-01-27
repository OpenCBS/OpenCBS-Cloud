import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { HolidayCreateService } from './holiday-create.service';
import * as holidayCreateActions from './holiday-create.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class HolidayCreateEffects {

  @Effect()
  create_holiday$ = this.actions$
    .pipe(ofType(holidayCreateActions.CREATE_HOLIDAY),
      switchMap((action: NgRxAction) => {
        return this.holidayCreateService.createHoliday(action.payload).pipe(
          map(
            res => new holidayCreateActions.CreateHolidaySuccess()),
          catchError((err: HttpErrorResponse) => {
            const errObj = new holidayCreateActions.CreateHolidayFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private holidayCreateService: HolidayCreateService,
              private actions$: Actions) {
  }
}
