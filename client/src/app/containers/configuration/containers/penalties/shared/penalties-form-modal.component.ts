import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { FormLookupControlComponent } from '../../../../../shared/modules/cbs-form/components';

const ACCOUNTING_CONFIG = {url: `${environment.API_ENDPOINT}accounting/lookup`};

@Component({
  selector: 'cbs-penalties-form-modal',
  templateUrl: 'penalties-form-modal.component.html'
})
export class PenaltiesFormModalComponent implements OnInit {
  @ViewChild('accrualAccount', {static: false}) accrualAccount: FormLookupControlComponent;
  @ViewChild('incomeAccount', {static: false}) incomeAccount: FormLookupControlComponent;
  @ViewChild('writeOffAccount', {static: false}) writeOffAccount: FormLookupControlComponent;
  public config = ACCOUNTING_CONFIG;
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
  public configPenaltyType = [
    {
      value: 'FLAT',
      name: 'FLAT'
    },
    {
      value: 'BY_DISBURSEMENT_AMOUNT',
      name: 'BY_DISBURSEMENT_AMOUNT'
    },
    {
      value: 'BY_OLB',
      name: 'BY_OLB'
    },
    {
      value: 'BY_LATE_PRINCIPAL',
      name: 'BY_LATE_PRINCIPAL'
    },
    {
      value: 'BY_LATE_INTEREST',
      name: 'BY_LATE_INTEREST'
    }
  ];

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
    this.accrualAccount.onClearLookup();
    this.incomeAccount.onClearLookup();
    this.writeOffAccount.onClearLookup();
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
      if (field) {
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
      if ( this.cachedData[key] !== fields[key] ) {
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
