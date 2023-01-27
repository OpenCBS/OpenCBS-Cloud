import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { FormLookupControlComponent } from '../../../../../shared/modules/cbs-form/components';

const CONFIG_ACCOUNTING = {url: `${environment.API_ENDPOINT}accounting/lookup`};

@Component({
  selector: 'cbs-entry-fees-form-modal',
  templateUrl: 'entry-fees-form-modal.component.html'
})
export class EntryFeesFormModalComponent implements OnInit {
  @ViewChild('lookupAccount', {static: false}) lookupAccount: FormLookupControlComponent;
  public config = CONFIG_ACCOUNTING;
  @ViewChild('f', {static: true}) form: FormGroup;
  @ViewChild('formFocus', {static: false}) formFocus: ElementRef;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  @Input() headerTitle = '';
  @Output() submitForm = new EventEmitter();
  public isOpen = false;
  public formChanged = false;
  public isChecked = false;
  public fieldTouched = false;

  private cachedData: any;

  constructor(private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.form.valueChanges.subscribe(data => {
        if ( data && this.cachedData ) {
          this.formChanged = this.checkFormChanges(data);
        }
      }
    );

  }

  openCreateModal(fields) {
    this.lookupAccount.onClearLookup();
    this.formChanged = true;
    this.form.setValue(fields);
    this.markAsUntouched(this.form);
    this.isOpen = true;
    this.isChecked = false;
    this.focusOn();
  }

  openEditModal(formValues) {
    this.cachedData = Object.assign({}, formValues);
    this.form.setValue(formValues);
    this.isChecked = formValues.percentage;
    this.isOpen = true;
    this.focusOn();
  }

  check() {
    this.isChecked = !this.isChecked;
    if ( !this.isChecked ) {
      this.form.controls['minLimit'].setValue('');
      this.form.controls['maxLimit'].setValue('');
    } else {
      if ( this.form.controls['maxValue'].value > 100 ) {
        this.form.controls['maxValue'].setValue('100');
      }
      if ( this.form.controls['minValue'].value > 100 ) {
        this.form.controls['minValue'].setValue('100');
      }
    }
  }

  limitPercentage() {
    const maxVal = this.form.controls['maxValue'];
    const minVal = this.form.controls['minValue'];

    if ( this.isChecked ) {
      if ( maxVal.value > 100 ) {
        maxVal.setValue(100);
      }
      if ( minVal.value > 100 ) {
        minVal.setValue(100);
      }
    }

    if ( maxVal.value ) {
      this.fieldTouched = minVal.value > maxVal.value;
    }
  }

  cancel() {
    this.isOpen = false;
  }

  submit({valid, value}) {
    this.disableSubmitBtn(true);

    if ( valid ) {
      this.submitForm.emit(value);
    }
  }

  focusOn() {
    setTimeout(() => {
      const field = this.formFocus.nativeElement.querySelector('.slds-form-element__control .slds-input');
      if ( field ) {
        field.focus();
      }
    }, 100);
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  checkFormChanges(fields) {
    let status = false;

    for (const key in fields) {
      if (this.cachedData[key] !== fields[key]) {
        status = true;
      }
    }

    return status;
  }

  markAsUntouched(form: FormGroup) {
    for (const control in form.controls) {
      if ( form.controls.hasOwnProperty(control) ) {
        form.controls[control].markAsUntouched();
      }
    }
  }
}
