import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { ProfileCreateService } from './profile-create.service';
import * as profileCreateActions from './profile-create.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class ProfileCreateEffects {

  @Effect()
  create_profile$ = this.actions$
    .pipe(ofType(profileCreateActions.CREATE_PROFILE),
      switchMap((action: NgRxAction) => {
        return this.profileCreateService.createProfile(action.payload.data, action.payload.type).pipe(
          map(res => new profileCreateActions.CreateProfileSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new profileCreateActions.CreateProfileFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private profileCreateService: ProfileCreateService,
    private actions$: Actions) {
  }
}
