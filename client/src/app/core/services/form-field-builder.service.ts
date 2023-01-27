import { Injectable } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

export interface Field {
  id: number;
  fieldType: string;
  caption: string;
  unique: boolean;
  required: boolean;
  order: number;
  extra: any;
  value?: any;
}

@Injectable()
export class FormFieldBuilderService {

  constructor(private fb: FormBuilder) {
  }

  generateField(fieldProperty: Field) {
    let obj: Object = {};
    obj['fieldId'] = this.generateArrayOptions(fieldProperty, true);
    obj['value'] = this.generateArrayOptions(fieldProperty, false, true);
    return this.fb.group(obj);
  }

  generateArrayOptions(options: Field, addId?, addVal?) {
    let arr: any = [''];
    if (addId) {
      arr = [options.id + ''];
    }
    if (addVal) {
      if (options.value || options.value === 0) {
        arr = [options.value];
      }
    }
    if (options.required) {
      arr.push(Validators.required);
    }
    return arr;
  }
}
