import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as savingListActions from './saving-list.actions';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { SavingListService } from './saving-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SavingListEffects {
  @Effect()
  load_saving$: Observable<Action> = this.actions$
    .pipe(ofType(savingListActions.LOAD_SAVINGS),
      switchMap((action: NgRxAction) => {
        return this.savingListService.getSavingList(action.payload).pipe(
          map(
            res => new savingListActions.LoadSavingsSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new savingListActions.LoadSavingsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private savingListService: SavingListService,
              private actions$: Actions) {
  }
}
