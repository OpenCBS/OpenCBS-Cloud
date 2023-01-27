import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
  selector: 'cbs-form-checkbox',
  template: `
    <div class="slds-form-element"
         [ngStyle]="style"
         [ngClass]="styleClass"
         [formGroup]="group"
         [class.slds-has-error]="
            (group.get(config.name).errors?.required && group.get(config.name).touched)
            || (group.get(config.name).invalid && group.get(config.name).touched)">
      <label class="slds-form-element__label">
        <abbr class="slds-required" title="required"
              *ngIf="config.required">*</abbr>
        {{ config.caption | translate }}
      </label>
      <div class="slds-app-launcher__tile-figure--small slds-button--icon-container-more slds-form-element__control">
        <span class="slds-checkbox">
            <input type="checkbox"
                   [formControlName]="config?.name"
                   [id]="'checkbox-' + config.name + (config.id ? '-' + config.id : '')"/>
            <label class="slds-checkbox__label"
                   [for]="'checkbox-' + config.name + (config.id ? '-' + config.id : '')">
                <span class="slds-checkbox--faux"></span>
            </label>
        </span>
      </div>
    </div>
  `,
  styles: [`
    :host label {
      cursor: pointer;
    }
  `]
})
export class FormCheckboxComponent implements Field {
  @Input() config: FieldConfig;
  @Input() group: FormGroup;
  @Input() style: string;
  @Input() styleClass: string;
}
