import { Component, EventEmitter, inject, InjectionToken, Input, OnInit, Output } from '@angular/core';
import { environment } from '../../../../../../environments/environment';
import { isNull } from 'lodash';
import * as moment from 'moment';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter, } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { LocalStorageService, SystemSettingsShareService } from '../../../../../core/services';

export const DATE_PICKER_FORMATS = {
  parse: {
    dateInput: new InjectionToken('Date format', {
      factory: () => {
        return inject(LocalStorageService).getDateFormat()
      }
    }).toString(),
  },
  display: {
    dateInput: new InjectionToken('Date format', {
      factory: () => {
        return inject(LocalStorageService).getDateFormat()
      }
    }).toString(),
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LLLL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'cbs-datepicker',
  templateUrl: 'datepicker.component.html',
  styleUrls: ['datepicker.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS]
    },
    {provide: MAT_DATE_FORMATS, useFactory: () => DATE_PICKER_FORMATS},
  ],
})
export class DatepickerComponent implements OnInit {
  @Input() value: string;
  @Input() disabled = false;
  @Input() dateFormat = environment.DATE_FORMAT_MOMENT;
  @Input() enableDropdownPicker = true;
  @Input() showAge = false;
  @Input() required = false;
  @Output() valueChange = new EventEmitter();
  @Output() valueInvalid = new EventEmitter();
  @Output() inputTouched = new EventEmitter();
  yearsFromNow = null;


  constructor(private systemSettingsShareService: SystemSettingsShareService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    DATE_PICKER_FORMATS.parse.dateInput = this.localStorageService.getDateFormat();
    DATE_PICKER_FORMATS.display.dateInput = this.localStorageService.getDateFormat();
    this.dateFormat = this.systemSettingsShareService.getData('DATE_FORMAT');
  }

  emitValueChange(date) {
    if ( date.value && date.value.isValid() ) {
      this.valueChange.emit(date.value.format(this.dateFormat));
      if ( this.showAge ) {
        this.yearsFromNow = moment().diff(date.value, 'years')
      }
    } else if ( this.required && isNull(date.value) ) {
      this.valueInvalid.emit();
      this.yearsFromNow = null;
    } else {
      this.valueChange.emit(null);
    }
  }

  emitOnBlur(date) {
    this.inputTouched.emit(date);
    if ( date.value ) {
      this.valueChange.emit(date.value.format(localStorage.getItem('dateFormat')));
    }
  }
}
