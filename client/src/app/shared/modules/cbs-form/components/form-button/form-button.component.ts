import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

@Component({
  selector: 'cbs-form-button',
  template: `
    <div
        [ngStyle]="style"
        [ngClass]="styleClass"
        [formGroup]="group">
        <button
            class="slds-button slds-button--brand"
            [disabled]="config.disabled"
            type="submit">
            {{ config.caption }}
        </button>
    </div>
    `
})
export class FormButtonComponent implements Field {
  @Input() config: FieldConfig;
  @Input() group: FormGroup;
  @Input() style: string;
  @Input() styleClass: string;
}
