import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { CFBuilderService } from '../cf-builder.service';
import { Field } from '../cf-builder.model';
import { values } from 'lodash';
import { environment } from '../../../../../environments/environment';
import { ParseDateFormatService } from '../../../../core/services';

@Component({
  selector: 'cbs-cf-field',
  templateUrl: 'cf-field.component.html',
  styleUrls: ['cf-field.component.scss']
})
export class CFFieldComponent implements OnInit, AfterViewInit {
  @Input() uid = 0;
  @Input() url: string;
  @Input() fieldData: Field;
  @Input() sectionId: number;
  @Input() addSectionId = false;
  @Input() lookupTypes = [];
  @Input() fieldTypes = [];
  @Input() componentFieldType = '';
  @Output() onFieldEditSuccess = new EventEmitter();
  @Output() onFieldEditError = new EventEmitter();
  @Output() onFieldDeleteSuccess = new EventEmitter();
  @Output() onFieldDeleteError = new EventEmitter();
  @Output() onFieldAddSuccess = new EventEmitter();
  @Output() onFieldAddError = new EventEmitter();
  @Output() onFieldAddCancel = new EventEmitter();
  @ViewChild('fieldForm', {static: false}) fieldForm;
  @ViewChild('caption', {static: false,  read: ElementRef}) captionInput: ElementRef;

  public formCollapsed = true;
  public formChanged = false;
  public newFieldMode = false;
  public isListSelected = false;
  public isPatternSelected = false;
  public isDateSelected = false;
  public isTextSelected = false;
  public isTextAreaSelected = false;
  public isNumericSelected = false;
  public isGridSelected = false;
  public listOptions: any[] = [];
  public patternOptions: any[] = [];
  public defaultValue: any;
  public pattern: any;
  public message: any;
  public isLookupSelected = false;
  public lookupUrl: any;
  public isLookupAddValue = false;
  public lookupValue: string | any;
  public changeValueField: any;

  private fieldDataChange: any;
  private cachedFieldData: any;
  private cachedListValues: string[];
  private cachedPatternValues: string[];

  constructor(private service: CFBuilderService,
              private parseDateFormatService: ParseDateFormatService) {
  }

  ngOnInit() {
    setTimeout(() => {
      this.checkFieldType(this.fieldData.fieldType);
    });
  }

  ngAfterViewInit() {
    this.cachedFieldData = {};
    this.cachedListValues = [];
    this.cachedPatternValues = [];

    if ( this.fieldData.fieldType === 'LIST' && this.fieldData['extra'] && Array.isArray(this.fieldData['extra'].items) ) {
      if ( this.fieldData['extra'].items.length ) {
        this.fieldData['extra'].items.map(listValue => {
          this.cachedListValues.push(listValue);
        });
      }
    }

    if ( this.fieldData.fieldType === 'PATTERN' && this.fieldData['extra'] ) {
      this.cachedPatternValues.push(this.fieldData['extra']);
    }

    this.cachedFieldData = this.addMissionProperties(this.fieldData);

    this.fieldForm.valueChanges.subscribe(data => {
      this.changeValueField = data;
      this.formChanged = this.checkFormChanges(data);
    });

    if ( this.fieldData.fieldType === 'LIST' ) {
      this.listOptions = values(this.fieldData.extra.items);
    }

    if ( this.fieldData.fieldType === 'PATTERN' ) {
      this.patternOptions = this.fieldData.extra;
    }

    if ( this.fieldData.fieldType === 'LOOKUP' ) {
      this.isLookupSelected = true;
      this.lookupValue = (this.fieldData.extra.key || '');
      this.defaultValue = this.fieldData.extra && this.fieldData.extra.defaultValue ? this.fieldData.extra.defaultValue : '';
      this.getDefaultLookupValue(this.lookupValue, 'edit');
    }

    if ( this.fieldData.extra && this.fieldData.extra.defaultValue ) {
      this.defaultValue = this.fieldData.extra.defaultValue;
    }
  }

  toggleEditView() {
    if ( this.formCollapsed ) {
      this.formCollapsed = false;
    } else if ( !this.formCollapsed && !this.newFieldMode ) {
      if ( this.formChanged ) {
        if ( confirm('You have unsaved form changes, proceed without saving?') ) {
          this.cancel();
        }
      } else {
        this.formCollapsed = true;
      }
    } else {
      if ( confirm('You have unsaved form changes, proceed without saving?') ) {
        this.cancel();
      }
    }
  }

  cancel() {
    if ( this.formChanged && !this.newFieldMode ) {
      if ( this.cachedFieldData.fieldType !== 'LIST' ) {
        this.isListSelected = false;
      }

      this.fieldForm.form.setValue({
        caption: this.cachedFieldData['caption'],
        description: this.cachedFieldData['description'],
        fieldType: this.cachedFieldData['fieldType'],
        required: this.cachedFieldData['required'],
        unique: this.cachedFieldData['unique'],
        order: this.cachedFieldData['order'],
        extra: this.cachedFieldData['fieldType'] === 'LIST' ? this.cachedListValues : this.cachedFieldData['extra']
      });

      this.listOptions = [...this.cachedListValues];
      this.patternOptions = [...this.cachedPatternValues];
    }
    if ( this.newFieldMode ) {
      this.onFieldAddCancel.emit(this.fieldData.sectionId);
    }
    this.formCollapsed = true;
  }

  checkFormChanges(data: Field) {
    let status = false;

    for (const key in data) {
      if ( data.hasOwnProperty(key) && key !== 'extra' ) {
        if ( this.cachedFieldData[key] !== data[key] ) {
          status = true;
        }
      }
    }

    if ( this.cachedFieldData.fieldType === data.fieldType && data.fieldType === 'LIST' ) {
      if ( Array.isArray(data.extra) && this.cachedListValues.length === data.extra.length ) {
        this.cachedListValues.map(item => {
          if ( data.extra.indexOf(item) === -1 ) {
            status = true;
          }
        });
      } else {
        status = true;
      }
    }

    if ( this.cachedFieldData.fieldType === data.fieldType ) {
      if ( data.extra && this.cachedFieldData.extra && this.cachedFieldData.extra.defaultValue ) {
        if ( this.cachedFieldData.extra.defaultValue !== data.extra.defaultValue ) {
          status = true;
        }
      }

      if ( data.extra && !this.cachedFieldData.extra.defaultValue ) {
        if ( data.extra.defaultValue !== '' ) {
          status = true;
        }
      }
    }

    if ( this.cachedFieldData.fieldType === data.fieldType && data.fieldType === 'PATTERN' ) {
      if ( data.extra ) {
        if ( this.cachedFieldData.extra.pattern !== data.extra.pattern && data.extra.pattern !== undefined ) {
          status = true;
        }
      }
    }

    if ( this.cachedFieldData.fieldType === data.fieldType && data.fieldType === 'PATTERN' ) {
      if ( data.extra ) {
        if ( this.cachedFieldData.extra.message !== data.extra.message && data.extra.message !== undefined ) {
          status = true;
        }
      }
    }

    if ( this.cachedFieldData.fieldType === data.fieldType && data.fieldType === 'LOOKUP' ) {
      if ( data.extra && this.lookupValue !== data.extra ) {
        status = true;
      }
    }

    return status;
  }

  getDefaultLookupValue(lookupValue, type) {
    if ( type === 'new' ) {
      this.defaultValue = {};
    }
    this.isLookupAddValue = false;
    this.lookupUrl = {
      url: `${environment.API_ENDPOINT}${lookupValue}/lookup`,
      defaultQuery: this.defaultValue && this.defaultValue.id ? this.defaultValue.name : ''
    };
    setTimeout(() => {
      this.isLookupAddValue = true;
    }, 300);
  }

  setDefaultValue(defaultValue) {
    if (defaultValue === null ) {
      this.defaultValue = '';
    } else if ( !defaultValue.target ) {
      if ( this.isLookupSelected ) {
        this.defaultValue = {
          id: defaultValue.id,
          name: defaultValue.name
        }
      } else {
        this.defaultValue = defaultValue;
      }
    } else {
      this.defaultValue = defaultValue.target.value;
    }
    this.fieldDataChange = {
      ...this.changeValueField,
      extra: {
        ...this.changeValueField.extra,
        defaultValue: this.defaultValue
      }
    };

    this.formChanged = this.checkFormChanges(this.fieldDataChange);
  }

  patternData(pattern) {
    this.pattern = pattern.target.value;
    this.fieldDataChange = {
      ...this.changeValueField,
      extra: {
        ...this.changeValueField.extra,
        pattern: this.pattern, message: this.message
      }
    };

    this.formChanged = this.checkFormChanges(this.fieldDataChange);
  }

  messageData(message) {
    this.message = message.target.value;
    this.fieldDataChange = {
      ...this.changeValueField,
      extra: {
        ...this.changeValueField.extra,
        pattern: this.pattern, message: this.message
      }
    };

    this.formChanged = this.checkFormChanges(this.fieldDataChange);
  }

  removeSelectedValue() {
    this.setDefaultValue('');
  }

  submitForm({valid, value}) {
    if ( value.fieldType === 'PATTERN' ) {
      if ( !this.pattern ) {
        this.pattern = this.changeValueField.extra.pattern;
      }
      if ( !this.message ) {
        this.message = this.changeValueField.extra.message;
      }
      value = {
        ...value,
        extra: {
          ...value.extra,
          pattern: this.pattern, message: this.message
        }
      };
    }

    if (value.fieldType === 'DATE' || value.fieldType === 'AGE' ) {
      if ( this.defaultValue ) {
        this.defaultValue = this.parseDateFormatService.parseDateValue(this.defaultValue);
      }
    }

    value = {
      ...value,
      extra: {
        ...value.extra,
        defaultValue: this.defaultValue ? this.defaultValue : ''
      }
    };

    if ( valid && !this.newFieldMode ) {
      if ( this.addSectionId && this.sectionId ) {
        const dataToSend = this.addMissionProperties(value);
        this.updateField(this.addMissionProperties(this.mutateExtra(dataToSend)));
      } else {
        console.warn('Please provide section id to be added to field data.');
      }
    } else if ( valid && this.newFieldMode ) {
      if ( this.addSectionId && this.sectionId ) {
        const dataToSend = this.addMissionProperties(value);
        this.addNewField(this.addMissionProperties(this.mutateExtra(dataToSend)));
      } else {
        console.warn('Please provide section id to be added to field data.');
      }
    }
  }

  deleteField({valid}) {
    if ( valid ) {
      this.removeField();
    }
  }

  mutateExtra(data: any) {
    if ( data.fieldType === 'LOOKUP' ) {
      delete data.extra.defaultValue;
      data.extra = {
        key: values(data.extra).join(''),
        defaultValue: this.defaultValue
      };
    } else if ( data.fieldType === 'LIST' ) {
      delete data.extra.defaultValue;
      data.extra = {
        items: values(data.extra),
        defaultValue: this.defaultValue
      };
    }
    return data;
  }

  addMissionProperties(data): Field {
    return Object.assign({}, data, {
      sectionId: data.sectionId ? data.sectionId : this.sectionId,
      name: data['caption'] ? data['caption'] : data['caption'].toLowerCase().trim().split(' ').join('_'),
      extra: data.extra ? data.extra : null
    });
  }

  updateField(data: Field) {
    this.service.updateField(this.url, this.fieldData.id, data).subscribe(
      resp => {
        this.onFieldEditSuccess.emit(resp);
        this.cancel();
      },
      err => {
        this.onFieldEditError.emit(err.error);
      }
    );
  }

  addNewField(data: Field) {
    this.service.createField(this.url, data).subscribe(
      resp => {
        this.onFieldAddSuccess.emit({data: resp, sectionId: data.sectionId});
        this.newFieldMode = false;
        this.formChanged = false;
        this.cancel();
      },
      err => {
        this.onFieldAddError.emit(err.error);
      }
    );
  }

  removeField() {
    this.service.removeField(this.url, this.fieldData.id).subscribe(
      () => {
        let newUrl = '';
        if ( this.url && this.fieldData.id ) {
          for (const str of this.url) {
            if ( newUrl.length + 1 < this.url.length ) {
              newUrl += str
            }
          }

          let urlData: string;
          if ( this.componentFieldType === 'collateral' ) {
            urlData = `http://localhost:8080/api/types-of-collateral/${this.fieldData.sectionId}`
          } else {
            urlData = newUrl + '-sections'
          }
          this.service.getFields(urlData).subscribe(
            res => {
              this.onFieldDeleteSuccess.emit(res);
              this.cancel();
            });
        }
      },
      err => {
        this.onFieldDeleteError.emit(err.error);
      }
    );
  }

  activateNewFieldMode() {
    this.newFieldMode = true;
    this.formCollapsed = false;
    this.focusCaptionInput();
  }

  focusCaptionInput() {
    setTimeout(() => {
      this.captionInput.nativeElement.focus();
    });
  }

  checkFieldType(value, newValue?) {
    if ( newValue ) {
      this.defaultValue = '';
    }
    this.isListSelected = false;
    this.isPatternSelected = false;
    this.isDateSelected = false;
    this.isTextSelected = false;
    this.isTextAreaSelected = false;
    this.isNumericSelected = false;
    this.isGridSelected = false;
    this.isLookupSelected = false;
    this.isLookupAddValue = false;
    switch (value) {
      case 'LIST':
        this.isListSelected = true;
        break;
      case 'DATE':
        this.isDateSelected = true;
        break;
      case 'AGE':
        this.isDateSelected = true;
        break;
      case 'TEXT':
        this.isTextSelected = true;
        break;
      case 'TEXT_AREA':
        this.isTextAreaSelected = true;
        break;
      case 'NUMERIC':
        this.isNumericSelected = true;
        break;
      case 'PATTERN':
        this.isPatternSelected = true;
        break;
      case 'LOOKUP':
        this.isLookupSelected = true;
        this.isLookupAddValue = true;
        break;
      case 'GRID':
        this.isNumericSelected = true;
        break;
      default:
        break;
    }
  }
}
