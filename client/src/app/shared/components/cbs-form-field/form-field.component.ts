import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'cbs-form-field',
  templateUrl: 'form-field.component.html',
  styleUrls: ['form-field.component.scss']
})
export class FormFieldComponent implements OnInit {
  @Input() public fieldData: any;
  @Input() public fieldForm: FormGroup;
  public fieldsReadOnly = false;
  public fieldType = '';
  public fieldCaption = '';
  public fieldValue = '';
  public fieldId: number;
  public dateValue = '';
  public listValues: String[];
  public patternValues: String[];
  public lookupUrl: any;
  public lookupValue = '';
  public checkboxData: Object;
  public gridHeaders = [];
  public gridValues = [];

  constructor() {
  }

  ngOnInit() {
    this.buildField();
  }

  buildField() {
    this.fieldData.map(item => {
      if (item.id === +this.fieldForm.value.fieldId) {
        this.fieldId = item.id;
        this.fieldCaption = item.caption;
        this.fieldType = item.fieldType;
        this.fieldsReadOnly = item.readOnly ? item.readOnly : false;
        if (this.fieldsReadOnly) {
          this.fieldValue = item.value;
        }

        if (!item.value && item.value !== 0) {
          this.fieldForm.controls['value'].setValue(null);
        }

        if (item.fieldType === 'LIST' && item.extra) {
          this.listValues = item.extra;
        }
        if (item.fieldType === 'PATTERN' && item.extra) {
          this.patternValues = item.extra;
        }
        if (item.fieldType === 'DATE') {
          this.dateValue = item.value ? item.value : '';
        }

        if (item.fieldType === 'LOOKUP') {
          if (item.extra && item.extra.key) {
            this.lookupUrl = {
              url: `${environment.DOMAIN}/api/${item.extra.key}/lookup`
            };
          }
          if (item.value) {
            const valueObj = JSON.parse(item.value);
            this.lookupValue = valueObj['id'];
            this.setLookupValue(valueObj);
          }
        }

        if (item.fieldType === 'CHECKBOX') {
          this.checkboxData = Object.assign({}, item, {
            value: item.value ? item.value : false
          });
          item.value ? this.fieldForm.controls['value'].setValue(item.value) : this.fieldForm.controls['value'].setValue(false);
        }

        if (item.field.fieldType === 'GRID') {
          this.gridValues = item.value
            ? JSON.parse(item.value).data
            : item.field.extra.data;

          for (const i in this.gridValues[0]) {
            if (i !== 'id') {
              this.gridHeaders.push({
                value: i
              });
            }
          }
        }
      }
    });
  }

  setDate(date) {
    if (date) {
      this.fieldForm.controls['value'].setValue(date);
    } else {
      this.fieldForm.controls['value'].setValue('');
    }
  }

  getGridValues() {
    const gridValue = {
      data: {}
    };
    this.gridValues.map(value => {
      for (const val in value) {
        if (value[val] === null) {
          value[val] = '';
        }
      }
    });
    gridValue.data = this.gridValues;
    const senData = JSON.stringify(gridValue);
    this.fieldForm.controls['value'].setValue(senData);
  }

  calculateTotal(colKey) {
    let total = 0;
    this.gridValues.map(val => {
      for (const row in val) {
        if (row === colKey && val[row]) {
          total += parseInt(val[row]);
          break;
        }
      }
    });
    return total ? total : '';
  }

  setLookupValue(value) {
    if (value && value.id) {
      this.fieldForm.controls['value'].setValue(value.id);
    } else {
      this.fieldForm.controls['value'].setValue('');
    }
  }

  dateInvalid() {
    this.fieldForm.controls['value'].setErrors({
      'invalid-date': true
    });
  }
}

