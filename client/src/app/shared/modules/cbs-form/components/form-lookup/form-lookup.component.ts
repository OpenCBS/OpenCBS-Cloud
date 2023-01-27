import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { PicklistComponent } from '../picklist/picklist.component';

@Component({
  selector: 'cbs-form-lookup',
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
        <input type="text" hidden [formControlName]="config.name">
        <cbs-picklist
          [config]="config.extra ? config.extra : ''"
          [hasAll]="config?.extra?.hasAll"
          [code]="config?.extra?.code"
          [value]="lookupValue"
          [filterType]="'name'"
          [searchPlaceholder]="searchPlaceholder | translate"
          [selectPlaceholder]="selectPlaceholder | translate"
          (onSelect)="setLookupValue($event)"></cbs-picklist>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
    .slds-form-element__control {
      vertical-align: top;
    }
  `]
})
export class FormLookupComponent implements OnInit, Field {
  @ViewChild(PicklistComponent, {static: false}) picklist: PicklistComponent;
  @Input() config: FieldConfig;
  @Input() group: FormGroup;
  @Input() style: string;
  @Input() styleClass: string;
  @Input() searchPlaceholder = 'SEARCH';
  @Input() selectPlaceholder = 'SELECT';
  @Output() onSelect = new EventEmitter();
  lookupValue: number;

  setLookupValue(value) {
    if (value && value.id) {
      this.group.controls[this.config.name].setValue(value.id);
    } else {
      this.group.controls[this.config.name].setValue('');
    }
    this.onSelect.emit(value);
  }

  clearLookupValue() {
    this.group.controls[this.config.name].setValue('');
    this.lookupValue = -1;
    this.picklist.removeWithoutEmit();
  }

  ngOnInit() {
    if ((this.config && this.config.value) || this.config.extra.defaultValue) {
      const valueObj = this.config.value ? this.config.value : this.config.extra.defaultValue;
      this.lookupValue = +valueObj['id'];
      this.setLookupValue(valueObj);
    }

    if (this.config && this.config.required) {
      this.group.controls[this.config.name].setValidators([Validators.required]);
    }
  }
}
