import { of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import * as savingUpdateActions from './saving-update.actions';
import { SavingUpdateService } from './saving-update.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SavingUpdateEffects {

  @Effect()
  update_saving$ = this.actions$
    .pipe(ofType(savingUpdateActions.UPDATE_SAVING),
      switchMap((action: NgRxAction) => {
        return this.savingUpdateService.updateSaving(action.payload.id, action.payload.data).pipe(
          map(
            res => new savingUpdateActions.UpdateSavingSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new savingUpdateActions.UpdateSavingFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private savingUpdateService: SavingUpdateService,
              private actions$: Actions) {
  }
}
