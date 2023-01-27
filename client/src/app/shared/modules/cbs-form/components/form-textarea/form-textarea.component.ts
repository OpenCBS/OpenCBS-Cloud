import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
  selector: 'cbs-form-textarea',
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
            <textarea
              class="slds-textarea"
              [formControlName]="config.name"
              [ngModel]="(config.value ? config.value : config.extra && config.extra.defaultValue ? config.extra.defaultValue : '')"
              [attr.placeholder]="config.placeholder | translate"
              [attr.cols]="colSize"
              [attr.rows]="rowSize"></textarea>
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
export class FormTextareaComponent implements Field {
  @Input() config: FieldConfig;
  @Input() group: FormGroup;
  @Input() style: string;
  @Input() styleClass: string;
  @Input() rowSize = 5;
  @Input() colSize = 20;
}
