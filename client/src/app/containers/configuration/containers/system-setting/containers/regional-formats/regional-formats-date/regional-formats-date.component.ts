import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { SystemSettingsShareService } from '../../../../../../../core/services';
import * as fromStore from '../../../../../../../core/store';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateSystemSettingState } from '../../../../../../../core/store';
import { ISystemSettingState } from '../../../../../../../core/store';
import { ShareService } from '../shared/services/share.service';

@Component({
  selector: 'cbs-regional-formats-date',
  templateUrl: 'regional-formats-date.component.html',
  styleUrls: ['./regional-formats-date.component.scss']
})
export class RegionalFormatsDateComponent implements OnInit {
  public selectedFormat = 'M/dd/yy';
  public currentDateFormat = '';
  public selectedDateFormat = '';
  public currentDate = moment();
  public dateFormatSettingForm: FormGroup;
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
      name: `DATE_FORMATS`,
      link: ''
    }
  ];
  public dateFormats = [
    {
      value: 'YYYY-MM-DD'
    },
    {
      value: 'YYYY.MM.DD'
    },
    {
      value: 'YYYY/MM/DD'
    },
    {
      value: 'DD-MM-YYYY'
    },
    {
      value: 'DD.MM.YYYY'
    },
    {
      value: 'DD/MM/YYYY'
    }
  ];

  constructor(private settingStateStore$: Store<ISystemSettingState>,
              private fb: FormBuilder,
              private shareService: ShareService,
              private updateSystemSettingStateStore: Store<UpdateSystemSettingState>,
              private systemSettingsShareService: SystemSettingsShareService) {
  }

  ngOnInit() {
    this.dateFormatSettingForm = this.fb.group({
      fieldSections: this.fb.array([])
    });

    this.currentDateFormat = moment().format(this.systemSettingsShareService.getData('DATE_FORMAT'));

    if ( this.shareService.getData('DATE_FORMAT') ) {
      this.selectedFormatValue(this.shareService.getData('DATE_FORMAT'));
    }

    setTimeout(() => {
      this.settingStateStore$.dispatch(new fromStore.SetSystemSettingBreadcrumb(this.breadcrumb));
    }, 300);
  }

  selectedFormatValue(value) {
    this.selectedFormat = value;
    this.shareService.setData(this.selectedFormat, 'DATE_FORMAT');
    this.shareService.setData(true, 'SHOW_BUTTON');
    this.selectedDateFormat = moment().format(this.selectedFormat);
  }
}

@Pipe({
  name: 'cbsSettingDateFormat'
})

export class SettingDateFormatPipe implements PipeTransform {

  transform(value: any) {
    let format;
    if ( value ) {
      format = moment().format(value['format']);
      return format;
    }
    return value.value;
  }
}
