import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
  selector: 'cbs-form-time',
  template: `
    <div class="slds-form-element"
         [ngStyle]="style"
         [ngClass]="styleClass"
         [formGroup]="group"
         [class.slds-has-error]="
            (group.get(config.name).errors && group.get(config.name).touched)
            || (group.get(config.name).invalid && group.get(config.name).touched)
            || (group.get(config.name).hasError('invalid-time'))">
      <label class="slds-form-element__label">
        <abbr class="slds-required" title="required"
              *ngIf="config?.required">*</abbr>
        {{ config.caption | translate }}
      </label>
      <div class="slds-form-element__control">
        <input type="text" hidden [formControlName]="config.name">
        <input
          [ngModel]="config.value"
          [ngModelOptions]="{standalone: true}"
          (ngModelChange)="checkValid($event); config.value = $event"
          [disabled]="config.disabled"
          class="slds-input"
          [mask]="timeMask">
        <ngl-icon category="utility" icon="clock" size="x-small" svgClass="slds-input__icon"></ngl-icon>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }

    :host ngl-icon {
      position: absolute;
      top: 5px;
      right: 10px;
    }

    :host ::ng-deep ngl-icon svg {
      fill: #bbb;
    }
  `]
})
export class FormTimeComponent implements Field {
  @Input() config: FieldConfig;
  @Input() group: FormGroup;
  @Input() style: string;
  @Input() styleClass: string;
  @Input() timeMask = '00:00';

  timeInvalid() {
    this.setDate();
    this.group.controls[this.config.name].setErrors({
      'invalid-time': true
    });
  }

  setDate(time?) {
    if (time) {
      this.group.controls[this.config.name].setValue(time);
    } else {
      this.group.controls[this.config.name].setValue('');
    }
  }

  checkValid(value) {
    if (value && value.length === 4) {
      const time = [value.slice(0, 2), ':' , value.slice(2)];
      if ((+time[0] <= 24 && +time[0] >= 0) && (+time[2] <= 59 && +time[2] >= 0)) {
        this.setDate(time.join(''));
      } else {
        this.timeInvalid();
      }
    } else {
      this.timeInvalid();
    }
  }
}
