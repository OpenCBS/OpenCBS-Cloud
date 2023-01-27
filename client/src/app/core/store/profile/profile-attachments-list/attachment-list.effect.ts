import { Observable, of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import * as profileAttachmentListActions from './attachment-list.actions';
import { ProfileAttachmentListService } from './attachment-list.service';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class ProfileAttachmentListEffects {
  @Effect()
  load_profileAttachments$: Observable<NgRxAction> = this.actions$
    .pipe(ofType(profileAttachmentListActions.LOAD_PROFILE_ATTACHMENTS),
      switchMap((action: NgRxAction) => {
        return this.profileAttachmentListService.getProfileAttachmentList(action.payload.profileType, action.payload.profileId).pipe(
          map(
            res => new profileAttachmentListActions.LoadProfileAttachmentsSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new profileAttachmentListActions.LoadProfileAttachmentsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  @Effect()
  pin_profileAttachment$: Observable<NgRxAction> = this.actions$
    .pipe(ofType(profileAttachmentListActions.PIN_PROFILE_ATTACHMENT),
      switchMap((action: NgRxAction) => {
        return this.profileAttachmentListService.pinProfileAttachment(
          action.payload.profileType,
          action.payload.profileId,
          action.payload.attachId).pipe(
          map(() =>
            new profileAttachmentListActions.LoadProfileAttachments(
              {profileType: action.payload.profileType, profileId: action.payload.profileId})),
          catchError((err: HttpErrorResponse) => {
            const errObj = new profileAttachmentListActions.LoadProfileAttachmentsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  @Effect()
  unpin_profileAttachment$: Observable<NgRxAction> = this.actions$
    .pipe(ofType(profileAttachmentListActions.UNPIN_PROFILE_ATTACHMENT),
      switchMap((action: NgRxAction) => {
        return this.profileAttachmentListService.unpinProfileAttachment(
          action.payload.profileType,
          action.payload.profileId,
          action.payload.attachId).pipe(
          map(
            () => new profileAttachmentListActions.LoadProfileAttachments(
              {profileType: action.payload.profileType, profileId: action.payload.profileId})),
          catchError((err: HttpErrorResponse) => {
            const errObj = new profileAttachmentListActions.LoadProfileAttachmentsFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private profileAttachmentListService: ProfileAttachmentListService,
    private actions$: Actions) {
  }
}
