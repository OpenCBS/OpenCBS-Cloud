import { Component, EventEmitter, forwardRef, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { PicklistComponent } from '../picklist/picklist.component';
import { isNull } from 'lodash';

const noop = () => {
};


export const FORM_PICKLIST_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => FormLookupControlComponent),
  multi: true
};

@Component({
  selector: 'cbs-form-lookup-control',
  templateUrl: './form-lookup-control.component.html',
  styleUrls: ['./form-lookup-control.component.scss'],
  providers: [
    FORM_PICKLIST_CONTROL_VALUE_ACCESSOR
  ]
})
export class FormLookupControlComponent implements ControlValueAccessor, OnInit {
  @ViewChild(PicklistComponent, {static: false}) picklistComponent: PicklistComponent;
  @Input() requiredField = false;
  @Input() fieldLabel = '';
  @Input() hasError = false;
  @Input() showError = true;
  @Input() disabled = false;
  @Input() picklistFilterType = 'name';
  @Input() code = false;
  @Input() picklistDataUrl = '';
  @Input() styleClass = '';
  @Input() style = '';
  @Input() searchPlaceholder = 'Search';
  @Input() selectPlaceholder = 'Select';
  @Input() selectedLabel = {};
  @Input() defaultValue: any;

  @Output() onSelect = new EventEmitter();
  @Output() onOpenPicklist = new EventEmitter();
  @Output() onClosePicklist = new EventEmitter();

  public innerValue: any = '';
  public reset = false;

  private onTouchedCallback: () => void = noop;
  private onChangeCallback: (_: any) => void = noop;

  get value(): any {
    if ( this.defaultValue ) {
      this.innerValue = this.defaultValue;
      if ( this.picklistComponent && this.reset ) {
        this.picklistComponent.valueString = this.innerValue;
        this.reset = false;
      }
    }
    return this.innerValue;
  };

  set value(v: any) {
    if ( v !== this.innerValue ) {
      this.innerValue = isNull(v) ? null : +v;
      this.onChangeCallback(this.innerValue);
    }
  }

  onClear() {
    this.value = null;
  }

  onClearLookup() {
    this.picklistComponent.removeWithoutEmit();
  }

  ngOnInit() {
    if ( !this.picklistDataUrl ) {
      throw new Error('Please, provide lookup data url.')
    }
  }

  writeValue(value: any) {
    if ( value !== this.innerValue ) {
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

  onPicklistOpen(event?) {
    this.onTouchedCallback();
    this.onOpenPicklist.emit();
  }

  onPicklistClose(event?) {
    this.onClosePicklist.emit();
  }

  setLookupValue(value) {
    if ( value && value.id ) {
      this.innerValue = value.id;
      this.onChangeCallback(value.id);
      this.onSelect.emit(value);
    } else {
      this.innerValue = '';
      this.onChangeCallback('');
      this.onSelect.emit(null);
    }
  }
}
