import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { ProfileUpdateService } from './profile-update.service';
import * as profileUpdateActions from './profile-update.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class ProfileUpdateEffects {

  @Effect()
  update_profile$ = this.actions$
    .pipe(ofType(profileUpdateActions.UPDATE_PROFILE),
      switchMap((action: NgRxAction) => {
        return this.profileUpdateService.updateProfile(action.payload.data, action.payload.type, action.payload.id).pipe(
          map(
            res => new profileUpdateActions.UpdateProfileSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new profileUpdateActions.UpdateProfileFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private profileUpdateService: ProfileUpdateService,
    private actions$: Actions) {
  }
}
