import { Injectable } from '@angular/core';
import {Actions, Effect, ofType} from '@ngrx/effects';
import { of as observableOf } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import * as systemSettingActions from './system-setting.actions';
import { NgRxAction } from '../../action.interface';
import { SystemSettingService } from './system-setting.service';
import { HttpErrorResponse } from '@angular/common/http';
import { SystemSettingsShareService } from '../../../services';


@Injectable()
export class SystemSettingEffect {

  @Effect()
  get_system_setting$ = this.actions$
    .pipe(ofType(systemSettingActions.LOAD_SYSTEM_SETTING),
      switchMap((action: NgRxAction) => {
        return this.systemSettingService.getSystemSetting().pipe(
          map((res: any) => {
            if ( res.length ) {
              const fieldsArray = [];
              const fieldData = res;
              fieldData.map(item => {
                const tempObj = {};
                if ( item['value'] ) {
                  tempObj['value'] = item['value'];
                }

                let fieldMeta;
                if ( item['customField'] ) {
                  fieldMeta = item['customField'];
                } else {
                  fieldMeta = item;
                }

                for (const key in fieldMeta) {
                  if ( fieldMeta.hasOwnProperty(key) ) {
                    tempObj[key] = fieldMeta[key];
                  }
                }

                fieldsArray.push(tempObj);
              });
              this.systemSettingsShareService.setData(fieldsArray);
              setTimeout(() => {
                localStorage.removeItem('dateFormat');
                localStorage.setItem('dateFormat', this.systemSettingsShareService.getData('DATE_FORMAT'));
              });
            }
            return new systemSettingActions.LoadSystemSettingSuccess(res);
          }),
          catchError((err: HttpErrorResponse) => {
            const errObj = new systemSettingActions.LoadSystemSettingFailure(err.error);
            return observableOf(errObj);
          }));
      }));

  constructor(private systemSettingService: SystemSettingService,
              private systemSettingsShareService: SystemSettingsShareService,
              private actions$: Actions) {
  }
}
