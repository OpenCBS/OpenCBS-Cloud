import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as savingCreateActions from './saving-create.actions';
import { NgRxAction } from '../../action.interface';
import { SavingCreateService } from './saving-create.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SavingCreateEffect {
  @Effect()
  create_saving$ = this.actions$
    .pipe(ofType(savingCreateActions.CREATE_SAVING),
      switchMap((action: NgRxAction) => {
        return this.savingCreateService.addSaving(action.payload).pipe(
          map(res => new savingCreateActions.CreateSavingSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new savingCreateActions.CreateSavingFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private savingCreateService: SavingCreateService,
              private actions$: Actions) {

  }
}
