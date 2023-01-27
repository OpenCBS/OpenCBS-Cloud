import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
  selector: 'cbs-form-select',
  template: `
    <div class="slds-form-element"
         [ngStyle]="style"
         [ngClass]="styleClass"
         [formGroup]="group"
         [class.slds-has-error]="
            (group.get(config.name).errors && group.get(config.name).touched)
            || (group.get(config.name).invalid && group.get(config.name).touched)">
      <label class="slds-form-element__label">
        <abbr class="slds-required" title="required"
              *ngIf="config?.required">*</abbr>
        {{ config.caption | translate }}
      </label>
      <div class="slds-form-element__control">
        <div class="slds-select_container">
          <select [formControlName]="config.name"
                  class="slds-select"
                  [value]="(config.value ? config.value : config.extra && config.extra.defaultValue ? config.extra.defaultValue : '')"
                  [ngModel]="(config.value ? config.value : config.extra && config.extra.defaultValue ? config.extra.defaultValue : '')"
          >
            <option value="" *ngIf="config.placeholder">{{ config.placeholder }}</option>
            <option *ngFor="let option of config.extra.items"
                    [value]="option"
            >
              <span>{{ option | translate }}</span>
            </option>
          </select>
        </div>
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
export class FormSelectComponent implements Field {
  @Input() config: FieldConfig;
  @Input() group: FormGroup;
  @Input() style: string;
  @Input() styleClass: string;
}
