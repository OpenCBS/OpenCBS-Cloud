import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Input,
  OnChanges,
  OnInit,
  Type,
  ViewContainerRef
} from '@angular/core';
import { FormGroup } from '@angular/forms';

import { FormButtonComponent } from '../form-button/form-button.component';
import { FormInputComponent } from '../form-input/form-input.component';
import { FormSelectComponent } from '../form-select/form-select.component';
import { FormTextareaComponent } from '../form-textarea/form-textarea.component';
import { FormDateComponent } from '../form-date/form-date.component';
import { FormLookupComponent } from '../form-lookup/form-lookup.component';
import { FormCheckboxComponent } from '../form-checkbox/form-checkbox.component';
import { FormTimeComponent } from '../form-time/form-time.component';
import { FormGridComponent } from '../form-grid/form-grid.component';

import { Field } from '../../models/field.interface';
import { FieldConfig } from '../../models/field-config.interface';

const components: { [type: string]: Type<Field> } = {
  BUTTON: FormButtonComponent,
  TEXT: FormInputComponent,
  EMAIL: FormInputComponent,
  PASSWORD: FormInputComponent,
  NUMERIC: FormInputComponent,
  TEXT_AREA: FormTextareaComponent,
  LIST: FormSelectComponent,
  DATE: FormDateComponent,
  AGE: FormDateComponent,
  TIME: FormTimeComponent,
  LOOKUP: FormLookupComponent,
  CHECKBOX: FormCheckboxComponent,
  PATTERN: FormInputComponent,
  GRID: FormGridComponent
};

@Directive({
  selector: '[cbsDynamicField]'
})
export class DynamicFieldDirective implements Field, OnChanges, OnInit {
  @Input() config: FieldConfig;
  @Input() group: FormGroup;
  @Input() style: any;
  @Input() styleClass: string;

  component: ComponentRef<Field>;

  constructor(private resolver: ComponentFactoryResolver,
              private container: ViewContainerRef) {
  }

  ngOnChanges() {
    if (this.component) {
      this.component.instance.config = this.config;
      this.component.instance.group = this.group;
      this.component.instance.style = this.style;
      this.component.instance.styleClass = this.styleClass;
    }
  }

  ngOnInit() {
    if (!components[this.config.fieldType]) {
      const supportedTypes = Object.keys(components).join(', ');
      throw new Error(
        `Trying to use an unsupported type (${this.config.fieldType}). Supported types: ${supportedTypes}`
      );
    }
    const component = this.resolver.resolveComponentFactory<Field>(components[this.config.fieldType]);
    this.component = this.container.createComponent(component);
    this.component.instance.config = {
      ...this.config,
      isBirthDateControl: this.config.fieldType === 'AGE'
    };
    this.component.instance.group = this.group;
    this.component.instance.style = this.style;
    this.component.instance.styleClass = this.styleClass;
  }
}
