import {
  Component,
  Input,
  Output,
  EventEmitter,
  forwardRef
} from '@angular/core';

import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

/* tslint:disable */
export const CHIPS_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => ChipsComponent),
  multi: true
};

/* tslint:enable */

@Component({
  selector: 'cbs-chips',
  templateUrl: 'chips.component.html',
  styleUrls: ['chips.component.scss'],
  providers: [CHIPS_VALUE_ACCESSOR]
})
export class ChipsComponent implements ControlValueAccessor {
  @Input() style: any;
  @Input() styleClass: string;
  @Input() disabled: boolean;
  @Input() type = 'text';
  @Output() onAdd: EventEmitter<any> = new EventEmitter();
  @Output() onRemove: EventEmitter<any> = new EventEmitter();
  @Input() field: string;
  @Input() placeholder: string;
  @Input() max: number;
  @Input() tabindex: number;
  @Input() required = false;
  value: any;
  focus: boolean;
  onModelChange: Function = () => {
  };
  onModelTouched: Function = () => {
  };


  constructor() {
  }

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(fn: Function): void {
    this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
    this.onModelTouched = fn;
  }

  setDisabledState(val: boolean): void {
    this.disabled = val;
  }

  resolveFieldData(data: any, field: string): any {
    if (data && field) {
      if (field.indexOf('.') === -1) {
        return data[field];
      } else {
        let fields: string[] = field.split('.');
        let value = data;
        for (let i = 0, len = fields.length; i < len; ++i) {
          value = value[fields[i]];
        }
        return value;
      }
    } else {
      return null;
    }
  }

  onFocus() {
    this.focus = true;
  }

  onBlur() {
    this.focus = false;
    this.onModelTouched();
  }

  removeItem(event: Event, index: number): void {
    if (this.disabled) {
      return;
    }

    let removedItem = this.value.splice(index, 1);
    this.onModelChange(this.value);
    this.onRemove.emit({
      originalEvent: event,
      value: removedItem
    });
  }

  onKeydown(event: KeyboardEvent, inputEL: HTMLInputElement): void {
    switch (event.which) {
      // backspace
      case 8:
        if (inputEL.value.length === 0 && this.value && this.value.length > 0) {
          let removedItem = this.value.pop();
          this.onModelChange(this.value);
          this.onRemove.emit({
            originalEvent: event,
            value: removedItem
          });
        }
        break;

      // enter
      case 13:
        this.value = this.value || [];
        if (inputEL.value && inputEL.value.trim().length && (!this.max || this.max > this.value.length)) {
          this.value = [inputEL.value, ...this.value];
          this.onModelChange(this.value);
          this.onAdd.emit({
            originalEvent: event,
            value: inputEL.value
          });
        }
        inputEL.value = '';
        event.preventDefault();
        break;

      default:
        if (this.max && this.value && this.max === this.value.length) {
          event.preventDefault();
        }
        break;
    }
  }

  get maxedOut(): boolean {
    return this.max && this.value && this.max === this.value.length;
  }
}
