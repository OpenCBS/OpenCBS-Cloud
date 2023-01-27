import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as savingActions from './saving.actions';
import { NgRxAction } from '../../action.interface';
import { SavingService } from './saving.service';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class SavingEffects {

  @Effect()
  get_saving$ = this.actions$
    .pipe(ofType(savingActions.LOAD_SAVING),
      switchMap((action: NgRxAction) => {
        return this.savingService.getSaving(action.payload).pipe(
          map(res => new savingActions.LoadSavingSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new savingActions.LoadSavingFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private savingService: SavingService,
              private actions$: Actions) {
  }
}
