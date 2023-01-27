import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


const noop = () => {
};


export const FORM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormInputControlComponent),
  multi: true
};

@Component({
  selector: 'cbs-form-input-control',
  templateUrl: './form-input-control.component.html',
  styleUrls: ['./form-input-control.component.scss'],
  providers: [
    FORM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})
export class FormInputControlComponent implements ControlValueAccessor {
  @Input() requiredField = false;
  @Input() fieldLabel = '';
  @Input() hasError = false;
  @Input() showError = true;
  @Input() showIconPreview = false;
  @Input() styleClass = '';
  @Input() style = '';
  @Input() inputType = 'text';
  @Output() onChange = new EventEmitter();
  @Input() disabled = false;

  @Input() innerValue: any = '';

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  get value(): any {
    return this.innerValue;
  };

  set value(v: any) {
    if (v !== this.innerValue) {
      if ( this.inputType === 'number' ) {
        this.innerValue = parseFloat(v);
      } else {
        this.innerValue = v;
      }
      this.onChangeCallback(v);
    }
  }

  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
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

  onBlur() {
    this.onTouchedCallback();
  }

  inputChange(value) {
    this.value = value;
    this.onChange.emit(value);
  }
}
