import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { ProfileFieldsService } from './profile-fields.service';
import * as profileFieldsActions from './profile-fields.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ProfileFieldsEffects {

  @Effect()
  get_profile_fields_meta$ = this.actions$
    .pipe(ofType(profileFieldsActions.LOAD_PROFILE_FIELDS_META),
      switchMap((action: NgRxAction) => {
        return this.profileFieldsService.getProfileFieldsMeta(action.payload).pipe(
          map(res => new profileFieldsActions.LoadProfileFieldsMetaSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new profileFieldsActions.LoadProfileFieldsMetaFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private profileFieldsService: ProfileFieldsService,
              private actions$: Actions) {
  }
}
