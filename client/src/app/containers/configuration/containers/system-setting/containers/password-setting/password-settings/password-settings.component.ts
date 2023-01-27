import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../../core/core.reducer';
import { TranslateService } from '@ngx-translate/core';
import * as fromStore from '../../../../../../../core/store';
import { ISystemSettingState } from '../../../../../../../core/store';
import { Subscription } from 'rxjs/Rx';

const SVG_DATA = {collection: 'custom', class: 'custom77', name: 'custom77'};

@Component({
  selector: 'cbs-password-settings',
  templateUrl: 'password-settings.component.html',
  styleUrls: ['password-settings.component.scss']
})

export class PasswordSettingsComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public settingsData: any;
  public isLoading = false;
  public breadcrumb = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'SYSTEM_SETTINGS',
      link: '/configuration/system-settings'
    },
    {
      name: `PASSWORD_SETTINGS`,
      link: ''
    },
    {
      name: 'INFO',
      link: ''
    }
  ];

  private fieldsSub: Subscription;

  constructor(private store$: Store<fromRoot.State>,
              private translate: TranslateService,
              private systemSettingStore$: Store<ISystemSettingState>) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.systemSettingStore$.dispatch(new fromStore.LoadSystemSetting());
    this.fieldsSub = this.store$.pipe(select(fromRoot.getSystemSettingState))
      .subscribe((response: any) => {
        if ( response.systemSetting.length ) {
          const fieldsArray = [];
          const fieldData = [];
          response.systemSetting.map(field => {
            if (field.customField.name !== 'DATE_FORMAT' && field.customField.name !== 'TIME_FORMAT' && field.customField.name !== 'NUMBER_FORMAT') {
              fieldData.push(field);
            }
          });
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
          this.settingsData = fieldsArray;
          this.isLoading = false;
        }
      });
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.fieldsSub.unsubscribe();
  }
}
