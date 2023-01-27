import { Component, OnInit, Input, Output, EventEmitter, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';


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

@Component({
  selector: 'cbs-custom-modal-form',
  templateUrl: 'custom-modal-form.component.html',
  styles: [`
    :host ::ng-deep .cbs-datepicker__icon {
      display: none;
    }`
  ]
})
export class CustomFormModalComponent implements OnInit {
  @Input() headerTitle = '';
  @Output() submitForm = new EventEmitter();
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  @ViewChild('formFocus', {static: false}) formFocus: ElementRef;
  public opened = false;
  public customForm: FormGroup;
  public customFields: any[];
  public formChanged = false;

  private cachedData: any;

  constructor(private fb: FormBuilder,
              private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.buildForm();
    this.customForm.valueChanges.subscribe(data => {
      if (data.fields.length) {
        if (this.checkFormChanges(data.fields)) {
          this.formChanged = true;
        } else {
          this.formChanged = false;
        }
      }
    });
  }

  checkFormChanges(fields) {
    let status = false;

    fields.map(field => {
      this.cachedData.map(item => {
        if (item.id === +field.fieldId && item.value !== field.value) {
          status = true;
        }
      });
    });

    return status;
  }

  openModal(fields) {
    this.opened = true;
    this.cachedData = [];
    fields.map(field => {
      const obj = Object.assign({}, field, {
        value: (field.value || field.value === 0 || (field.value === false)) ? field.value : null
      });
      this.cachedData.push(obj);
    });

    this.customFields = fields;
    this.generateCustomFields(fields);
    setTimeout(() => {
      const field = this.formFocus.nativeElement.querySelector('.slds-form-element__control .slds-input');
      if (field) {
        field.focus()
      }
    }, 100);
  }

  cancel() {
    this.opened = false;
  }

  submit({valid, value}) {
    if (valid) {
      this.disableSubmitBtn(true);
      this.submitForm.emit(value);
    }
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  buildForm() {
    this.customForm = this.fb.group({
      fields: this.fb.array([])
    });
  }

  generateCustomFields(fields) {
    const control = <FormArray>this.customForm.controls['fields'];

    if (control.length) {
      control.value.map(item => {
        control.removeAt(control.controls.indexOf(item));
      });
    }

    fields.map(item => {
      control.push(<FormGroup>this.generateField(item));
    });
  }

  generateField(fieldProperty: Field) {
    const obj: Object = {};
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
