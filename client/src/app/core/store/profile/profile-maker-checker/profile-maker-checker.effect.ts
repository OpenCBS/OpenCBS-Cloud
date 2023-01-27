import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';

import { ProfileMakerCheckerService } from './profile-maker-checker.service';
import * as profileMakerCheckerActions from './profile-maker-checker.actions';
import { NgRxAction } from '../../action.interface';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class ProfileMakerCheckerEffects {

  @Effect()
  get_profile_maker_checker$ = this.actions$
    .pipe(ofType(profileMakerCheckerActions.LOAD_PROFILE_MAKER_CHECKER),
      switchMap((action: NgRxAction) => {
        return this.profileMakerCheckerService.getLoanAppMakerChecker(action.payload).pipe(
          map(res => {
            return new profileMakerCheckerActions.LoadProfileMakerCheckerSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new profileMakerCheckerActions.LoadProfileMakerCheckerFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private profileMakerCheckerService: ProfileMakerCheckerService,
              private actions$: Actions,
              public toastrService: ToastrService) {
  }
}
