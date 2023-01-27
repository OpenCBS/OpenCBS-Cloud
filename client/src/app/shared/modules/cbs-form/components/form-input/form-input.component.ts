import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
  selector: 'cbs-form-input',
  template: `
    <div class="slds-form-element"
         [ngStyle]="style"
         [ngClass]="styleClass"
         [formGroup]="group"
         [class.slds-has-error]="
            (group.get(config.name)?.errors && group.get(config.name).touched)
            || (group.get(config.name)?.invalid && group.get(config.name).touched)">
      <label class="slds-form-element__label">
        <abbr class="slds-required" title="required"
              *ngIf="config.required">*</abbr>
        {{ config.caption | translate }}
      </label>
      <div class="slds-form-element__control">
        <input
          [onlyNumber]="config.fieldType === 'NUMERIC'"
          [attr.type]="getType(config.fieldType)"
          class="slds-input"
          [ngModel]="(config.value ? config.value : config.extra && config.extra.defaultValue ? config.extra.defaultValue : '')"
          type="text"
          [attr.placeholder]="config.placeholder | translate"
          [formControlName]="config.name"/>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class FormInputComponent implements Field {
  @Input() config: FieldConfig;
  @Input() group: FormGroup;
  @Input() style: any;
  @Input() styleClass: string;

  getType(fieldType) {
    switch (fieldType) {
      case 'TEXT':
        return 'text';
      case 'NUMERIC':
        return 'number';
      case 'EMAIL':
        return 'email';
      case 'PASSWORD':
        return 'password';
    }
  }
}
