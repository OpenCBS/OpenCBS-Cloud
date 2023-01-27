import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SystemSettingsShareService } from '../../../../../../../core/services';
import * as fromStore from '../../../../../../../core/store';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateSystemSettingState } from '../../../../../../../core/store';
import { ISystemSettingState } from '../../../../../../../core/store';
import { ShareService } from '../shared/services/share.service';

@Component({
  selector: 'cbs-regional-formats-time',
  templateUrl: 'regional-formats-time.component.html',
  styleUrls: ['./regional-formats-time.component.scss']
})
export class RegionalFormatsTimeComponent implements OnInit {
  public selectedFormat = 'HH:mm';
  public currentTimeFormat = '';
  public selectedTimeFormat = '';
  public currentTime = moment();
  public timeFormatSettingForm: FormGroup;
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
      name: `TIME_FORMATS`,
      link: ''
    }
  ];
  public timeFormats = [
    {
      value: 'HH:mm'
    },
    {
      value: 'h:mm a'
    }
  ];

  constructor(private settingStateStore$: Store<ISystemSettingState>,
              private fb: FormBuilder,
              private shareService: ShareService,
              private updateSystemSettingStateStore: Store<UpdateSystemSettingState>,
              private systemSettingsShareService: SystemSettingsShareService) {
  }

  ngOnInit() {
    this.timeFormatSettingForm = this.fb.group({
      fieldSections: this.fb.array([])
    });

    this.currentTimeFormat = moment().format(this.systemSettingsShareService.getData('TIME_FORMAT'));

    if ( this.shareService.getData('TIME_FORMAT') ) {
      this.selectedFormatValue(this.shareService.getData('TIME_FORMAT'));
    }

    setTimeout(() => {
      this.settingStateStore$.dispatch(new fromStore.SetSystemSettingBreadcrumb(this.breadcrumb));
    }, 300);
  }

  selectedFormatValue(value) {
    this.selectedFormat = value;
    this.shareService.setData(this.selectedFormat, 'TIME_FORMAT');
    this.shareService.setData(true, 'SHOW_BUTTON');
    this.selectedTimeFormat = moment().format(this.selectedFormat);
  }
}
