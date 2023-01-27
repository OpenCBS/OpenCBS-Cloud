import { Component, EventEmitter, forwardRef, inject, InjectionToken, Input, OnChanges, OnInit, Output, } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as moment from 'moment';
import { TranslateService } from '@ngx-translate/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { LocalStorageService, SystemSettingsShareService } from '../../../../../core/services';

const noop = () => {
};

export function dateValidator(format = 'YYYY-MM-DD') {
  return (c: FormControl) => {
    const err = {
      dateInvalidError: true
    };

    return moment(c.value, format, true).isValid() || moment(c.value, moment.ISO_8601, true).isValid() ? null : err;
  }
}

export const FORM_DATE_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormDateControlComponent),
  multi: true
};

export const FORM_DATE_CONTROL_VALIDATOR: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => FormDateControlComponent),
  multi: true
};

export const DATE_CONTROL_FORMATS = {
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
    }).toString(), monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LLLL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'cbs-form-date-control',
  templateUrl: './form-date-control.component.html',
  styleUrls: ['./form-date-control.component.scss'],
  providers: [
    FORM_DATE_CONTROL_VALUE_ACCESSOR,
    FORM_DATE_CONTROL_VALIDATOR,
    {provide: MAT_DATE_FORMATS, useFactory: () => DATE_CONTROL_FORMATS}
  ]
})
export class FormDateControlComponent implements OnInit, ControlValueAccessor, OnChanges {
  @Input() dateFormat = this.localStorageService.getDateFormat();
  @Input() enableDropdownPicker = true;
  @Input() validateDate = true;
  @Input() requiredField = false;
  @Input() fieldLabel = '';
  @Input() hasError = false;
  @Input() showError = true;
  @Input() errorMessage = null;
  @Input() styleClass = '';
  @Input() style = '';
  @Input() showAge = false;
  @Input() minDate = Date;
  @Input() maxDate = Date;
  @Input() weekendDisabled = false;
  @Output() onChange = new EventEmitter();

  public yearsFromNow = null;
  public errorOutputMessage: string;
  public disabled = false;

  private innerValue = moment();
  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;
  private validateFn: any = () => {
  };

  get value(): any {
    return this.innerValue;
  };

  set value(v: any) {
    if ( v && v.value && v.value.isValid() ) {
      if ( !v.value.isSame(this.innerValue) ) {
        this.innerValue = v.value;
        this.onChangeCallback(v.value.format(this.localStorageService.getDateFormat()));
        this.onChange.emit(v.value.format(this.localStorageService.getDateFormat()));
      }
    }
  }

  constructor(private translate: TranslateService,
              private systemSettingsShareService: SystemSettingsShareService,
              private localStorageService: LocalStorageService) {
  }

  ngOnInit() {
    DATE_CONTROL_FORMATS.parse.dateInput = this.localStorageService.getDateFormat();
    DATE_CONTROL_FORMATS.display.dateInput = this.localStorageService.getDateFormat();
    this.dateFormat = this.systemSettingsShareService.getData('DATE_FORMAT');
  }

  ngOnChanges(inputs) {
    if ( inputs.validateDate && this.innerValue ) {
      this.validateFn = dateValidator(this.dateFormat);
      this.onChangeCallback(this.innerValue.format(this.systemSettingsShareService.getData('DATE_FORMAT')));
    }
  }

  isNotWeekend(date): boolean {
    return date.isoWeekday() !== 6 && date.isoWeekday() !== 7;
  }

  isWeekend(): boolean {
    return true
  }

  private outputErrorMessage(dateValue) {
    if ( dateValue.isoWeekday() === 6 || dateValue.isoWeekday() === 7 ) {
      this.hasError = true;
      this.errorOutputMessage = this.translate.instant(this.errorMessage);
    }
  }

  checkValidation(date) {
    if ( date.value ) {
      this.value = date.value.format(this.systemSettingsShareService.getData('DATE_FORMAT'));
      this.hasError = false;
      if ( this.showAge ) {
        this.yearsFromNow = moment().diff(date.value, 'years')
      }
      if ( this.weekendDisabled ) {
        this.outputErrorMessage(date.value);
      }
    } else {
      this.onChange.emit(null);
      this.yearsFromNow = null;
    }
  }

  writeValue(value: string) {
    this.innerValue = moment(value);
    if ( this.innerValue.isValid() ) {
      this.hasError = false;
    }
  }

  registerOnChange(fn: any) {
    this.onChangeCallback = fn;
  }

  registerOnTouched(fn: any) {
    this.onTouchedCallback = fn;
  }

  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  validate(c: FormControl) {
    return this.validateFn(c);
  }
}
