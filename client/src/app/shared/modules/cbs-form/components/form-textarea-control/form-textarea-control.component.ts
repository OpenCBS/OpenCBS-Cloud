import { Component, forwardRef, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


const noop = () => {
};


export const FORM_TEXT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormTextareaControlComponent),
  multi: true
};


@Component({
  selector: 'cbs-form-textarea-control',
  templateUrl: './form-textarea-control.component.html',
  styleUrls: ['./form-textarea-control.component.scss'],
  providers: [
    FORM_TEXT_CONTROL_VALUE_ACCESSOR
  ]
})
export class FormTextareaControlComponent implements ControlValueAccessor {
  @Input() requiredField = false;
  @Input() fieldLabel = '';
  @Input() hasError = false;
  @Input() showError = true;
  @Input() styleClass = '';
  @Input() placeholder = '';
  @Input() style = '';
  @Input() rows = 3;
  @Input() cols = 30;
  public disabled = false;

  private innerValue = '';

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  get value(): any {
    return this.innerValue;
  };

  set value(v: any) {
    if (v !== this.innerValue) {
      this.innerValue = v;
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

}
