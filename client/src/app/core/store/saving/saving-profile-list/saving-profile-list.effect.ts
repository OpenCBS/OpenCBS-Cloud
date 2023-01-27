import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import * as savingProfileListActions from './saving-profile-list.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { SavingProfileListService } from './saving-profile-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class SavingProfileListEffects {
  @Effect()
  load_saving_profile$: Observable<Action> = this.actions$
    .pipe(ofType(savingProfileListActions.LOAD_SAVINGS_PROFILE),
      switchMap((action: NgRxAction) => {
        return this.savingProfileListService.getSavingProfileList(action.payload).pipe(
          map(
            res => new savingProfileListActions.LoadSavingsProfileSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new savingProfileListActions.LoadSavingsProfileFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private savingProfileListService: SavingProfileListService,
              private actions$: Actions) {
  }
}
