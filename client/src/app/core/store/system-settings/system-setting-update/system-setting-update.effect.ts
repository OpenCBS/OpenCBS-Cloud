import { of as observableOf } from 'rxjs';

import { catchError, map, switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';


import { SystemSettingUpdateService } from './system-setting-update.service';
import * as systemSettingUpdateActions from './system-setting-update.actions';
import { NgRxAction } from '../../action.interface';
import { HttpErrorResponse } from '@angular/common/http';


@Injectable()
export class SystemSettingUpdateEffects {

  @Effect()
  update_system_setting$ = this.actions$
    .pipe(ofType(systemSettingUpdateActions.UPDATE_SYSTEM_SETTING),
      switchMap((action: NgRxAction) => {
        return this.systemSettingUpdateService.updateSystemSetting(action.payload.data).pipe(
          map(
            res => new systemSettingUpdateActions.UpdateSystemSettingSuccess(res)),
          catchError((err: HttpErrorResponse) => {
            const errObj = new systemSettingUpdateActions.UpdateSystemSettingFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(
    private systemSettingUpdateService: SystemSettingUpdateService,
    private actions$: Actions) {
  }
}
