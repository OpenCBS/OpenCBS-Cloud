import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';
import { ParseDateFormatService } from '../../../../../core/services';

@Component({
  selector: 'cbs-form-date',
  template: `
    <div class="slds-form-element"
         [ngStyle]="style"
         [ngClass]="styleClass"
         [formGroup]="group"
         [class.slds-has-error]="
            (group.get(config.name).errors && group.get(config.name).touched)
            || (group.get(config.name).invalid && group.get(config.name).touched)
            || (group.get(config.name).hasError('invalid-date'))">
      <label class="slds-form-element__label">
        <abbr class="slds-required" title="required"
              *ngIf="config.required">*</abbr>
        {{ config.caption | translate }}
      </label>
      <div class="slds-form-element__control">
        <input type="text" hidden [formControlName]="config.name">
        <cbs-datepicker
          [showAge]="config.isBirthDateControl"
          [value]="config.value ? config.value : config.extra && config.extra.defaultValue ? config.extra.defaultValue : ''"
          [enableDropdownPicker]="enableDropdownPicker"
          (valueInvalid)="dateInvalid()"
          [required]="config.required"
          (valueChange)="setDate($event)"></cbs-datepicker>
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
export class FormDateComponent implements Field, OnInit {
  @Input() config: FieldConfig;
  @Input() group: FormGroup;
  @Input() style: string;
  @Input() styleClass: string;
  @Input() enableDropdownPicker = true;

  constructor(private parseDateFormatService: ParseDateFormatService) {
  }

  ngOnInit() {
    const date = this.config.value
      ? this.config.value
      : this.config.extra && this.config.extra.defaultValue
        ? this.config.extra.defaultValue
        : '';
    this.setDate(date)
  }


  dateInvalid() {
    this.setDate();
    this.group.controls[this.config.name].setErrors({
      'invalid-date': true
    });
  }

  setDate(date?) {
    date = date ? date : this.config.extra && this.config.extra.defaultValue ? this.config.extra.defaultValue : '';
    if (date) {
      date = this.parseDateFormatService.parseDateValue(date);
      const dateTime = date;
      if (this.config.extra && this.config.extra.time) {
        this.group.controls[this.config.name].setValue(dateTime);
      } else {
        this.group.controls[this.config.name].setValue(date);
      }
    } else {
      this.group.controls[this.config.name].setValue('');
    }
  }
}
