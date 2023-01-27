import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { ProfileEventsListService } from './profile-events-list.service';
import * as profileEventsActions from './profile-events-list.actions';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ProfileEventsEffect {

  @Effect()
  get_profile_events$ = this.actions$
    .pipe(ofType(profileEventsActions.LOAD_PROFILE_EVENTS),
      switchMap((action: profileEventsActions.ProfileEventsListActions) => {
        return this.profileEventsService.getProfileEventsList(action.payload).pipe(
          map(res => new profileEventsActions.LoadProfileEventsListSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new profileEventsActions.LoadProfileEventsListFail(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private profileEventsService: ProfileEventsListService,
    private actions$: Actions) {
  }
}
