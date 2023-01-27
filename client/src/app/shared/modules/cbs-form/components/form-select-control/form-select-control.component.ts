import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const noop = () => {
};

interface ListItem {
  value: string | number;
  name: string;
}

export const FORM_SELECT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormSelectControlComponent),
  multi: true
};

@Component({
  selector: 'cbs-form-select-control',
  templateUrl: './form-select-control.component.html',
  styleUrls: ['./form-select-control.component.scss'],
  providers: [
    FORM_SELECT_CONTROL_VALUE_ACCESSOR
  ]
})
export class FormSelectControlComponent implements ControlValueAccessor {
  @Input() requiredField = false;
  @Input() fieldLabel = '';
  @Input() hasError = false;
  @Input() disabled = false;
  @Input() showError = true;
  @Input() selectPlaceholder = 'SELECT';
  @Input() styleClass = '';
  @Input() style = '';
  @Input() selectValue = 'value';
  @Input() selectData = <ListItem[]>[];
  @Output() onChange = new EventEmitter();
  @Output() onSelect = new EventEmitter();

  public innerValue = '';

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  get value(): any {
    return this.innerValue;
  };

  set value(v: any) {
    if (v && v !== this.innerValue) {
      this.onSelect.emit(v);
      this.innerValue = v;
      this.onChangeCallback(v);
    } else {
      this.innerValue = null;
      this.onChangeCallback(null);
    }
  }

  writeValue(value: any) {
    if (value !== this.innerValue) {
      this.innerValue = value;
    }
  }

  remove() {
    this.innerValue = null;
    this.onChange.emit(null);
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
    this.onChange.emit(value);
  }
}
