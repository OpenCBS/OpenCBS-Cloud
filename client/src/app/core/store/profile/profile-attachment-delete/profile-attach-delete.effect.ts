import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { ProfileAttachmentDelService } from './profile-attach-del.service';
import * as profileAttachmentDelActions from './profile-attach-delete.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ProfileAttachmentDeleteEffects {

  @Effect()
  delete_profile_attachment$ = this.actions$
    .pipe(ofType(profileAttachmentDelActions.DELETE_PROFILE_ATTACH),
      switchMap((action: NgRxAction) => {
        return this.profileAttachmentDeleteService.deleteProfileAttachment(
          action.payload.attachId,
          action.payload.profileType,
          action.payload.profileId).pipe(
          map(() => new profileAttachmentDelActions.DeleteProfileAttachmentSuccess()),
          catchError((err: HttpErrorResponse) => {
            const errObj = new profileAttachmentDelActions.DeleteProfileAttachmentFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private profileAttachmentDeleteService: ProfileAttachmentDelService,
    private actions$: Actions) {
  }
}
