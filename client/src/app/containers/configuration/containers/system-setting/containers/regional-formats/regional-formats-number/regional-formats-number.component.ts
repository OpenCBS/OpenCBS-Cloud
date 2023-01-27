import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { SystemSettingsShareService } from '../../../../../../../core/services';
import * as fromStore from '../../../../../../../core/store';
import { Store } from '@ngrx/store';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UpdateSystemSettingState } from '../../../../../../../core/store';
import { formatNumber } from '@angular/common';
import { ISystemSettingState } from '../../../../../../../core/store';
import { ShareService } from '../shared/services/share.service';

@Component({
  selector: 'cbs-regional-formats-number',
  templateUrl: 'regional-formats-number.component.html',
  styleUrls: ['./regional-formats-number.component.scss']
})
export class RegionalFormatsNumberComponent implements OnInit {
  public selectedFormat = '1.2-2';
  public currentNumberFormat = '';
  public selectedNumberFormat = '';
  public numberFormatSettingForm: FormGroup;
  public useDecimal = false;
  public decimalValue: number;
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
      name: `NUMBER_FORMATS`,
      link: ''
    }
  ];
  public numberFormats = [
    {
      value: '1.2-4'
    }
  ];

  constructor(private settingStateStore$: Store<ISystemSettingState>,
              private fb: FormBuilder,
              private shareService: ShareService,
              private updateSystemSettingStateStore: Store<UpdateSystemSettingState>,
              private systemSettingsShareService: SystemSettingsShareService) {
  }

  ngOnInit() {
    this.numberFormatSettingForm = this.fb.group({
      fieldSections: this.fb.array([])
    });

    this.currentNumberFormat = formatNumber(1000000, 'en', this.systemSettingsShareService.getData('NUMBER_FORMAT'));

    if ( this.shareService.getData('NUMBER_FORMAT') ) {
      this.selectedFormatValue(this.shareService.getData('NUMBER_FORMAT'));
    }

    if ( this.shareService.getData('USE_DECIMAL') ) {
      this.useDecimal = this.shareService.getData('USE_DECIMAL');
    }

    if ( this.shareService.getData('DECIMAL_VALUE') ) {
      this.inputChange(this.shareService.getData('DECIMAL_VALUE'));
    }

    setTimeout(() => {
      this.settingStateStore$.dispatch(new fromStore.SetSystemSettingBreadcrumb(this.breadcrumb));
    }, 300);
  }

  selectedFormatValue(value) {
    this.selectedFormat = value;
    this.shareService.setData(this.selectedFormat, 'NUMBER_FORMAT');
    this.shareService.setData(true, 'SHOW_BUTTON');
    this.selectedNumberFormat = formatNumber(10000, 'en', this.selectedFormat);
  }

  useDecimalSelect() {
    this.useDecimal = !this.useDecimal;
    this.shareService.setData(this.useDecimal, 'USE_DECIMAL')
  }

  inputChange(value) {
    if (value < 0 || value > 4 || value === '' ) {
      value = 2;
    }
    this.decimalValue = value;
    this.shareService.setData( this.decimalValue, 'DECIMAL_VALUE');
    this.shareService.setData( true, 'SHOW_BUTTON');
    let formatValue = {
      value: '1.' + value + '-4'
    };
    this.selectedFormatValue(formatValue.value);
    this.shareService.setData(formatValue.value, 'NUMBER_FORMAT');
  }
}

@Pipe({
  name: 'cbsSettingNumberFormat'
})

export class SettingNumberFormatPipe implements PipeTransform {

  transform(value: any) {
    let format;
    if ( value ) {
      format = formatNumber(1000000, 'en', value);
      return format;
    }
    return value.value;
  }
}
