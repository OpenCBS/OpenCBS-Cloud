import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { ProfileStateService } from './profile-state.service';
import * as profileActions from './profile.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ProfileStateEffects {
  @Effect()
  get_profile_info$ = this.actions$
    .pipe(ofType(profileActions.LOAD_PROFILE_INFO),
    switchMap((action: NgRxAction) => {
      if ( action.payload.type !== 'people' && action.payload.type !== 'companies' && action.payload.type !== 'groups' ) {
        const err = new profileActions.LoadProfileInfoFailure('Unsupported profile type is provided.');
        return observableOf(err);
      }
      return this.profileStateService.getProfileInfo(action.payload.id, action.payload.type)
        .pipe(map(res => {
            const data = res;
            if ( action.payload.type === 'people' || action.payload.type === 'companies' && action.payload.type !== 'groups' ) {
              data['type'] = action.payload.type;
            }
            return new profileActions.LoadProfileInfoSuccess(data);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new profileActions.LoadProfileInfoFailure(err.error);
            return observableOf(errObj);
          }));
    }));

  @Effect()
  create_current_account$ = this.actions$
    .pipe(ofType(profileActions.CREATE_CURRENT_ACCOUNT),
      switchMap((action: NgRxAction) => {
        return this.profileStateService.createCurrentAccount(action.payload.profileId, action.payload.type, action.payload.data).pipe(
          map(() => new profileActions.LoadProfileInfo({id: action.payload.profileId, type: action.payload.type})),
          catchError((err: HttpErrorResponse) => {
            const errObj = new profileActions.LoadProfileInfoFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private profileStateService: ProfileStateService,
              private actions$: Actions) {
  }
}
