import { ValidatorFn } from '@angular/forms';

export interface FieldConfig {
  defaultValue?: any;
  id?: number;
  disabled?: boolean;
  placeholder?: string;
  sectionId?: number;
  name: string;
  caption: string;
  fieldType: string;
  unique?: boolean;
  required?: boolean;
  validation?: ValidatorFn[];
  order?: number;
  extra?: any;
  value?: any;
  isBirthDateControl?: boolean;
}
