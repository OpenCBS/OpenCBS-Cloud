import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import * as fromRoot from '../../../../../core/core.reducer';
import { environment } from '../../../../../../environments/environment';
import { IBorrowingFormState, IBorrowingProduct } from '../../../../../core/store/borrowings/borrowing-form/borrowing-form.interfaces';
import { range } from './borrowing-details-form-validators';

@Component({
  selector: 'cbs-borrowing-details-form',
  templateUrl: 'borrowing-details-form.component.html',
  styleUrls: ['borrowing-details-form.component.scss']
})
export class BorrowingDetailsFormComponent implements OnInit {
  @Input() borrowingFormState: IBorrowingFormState;
  @Output() submit = new EventEmitter();
  @Output() onLoanProductSelect = new EventEmitter();

  public profileName: string;
  public form: FormGroup;
  public formConfig = {
    loanProductLookupUrl: {url: `${environment.API_ENDPOINT}borrowing-products`}
  };
  public accountConfig = {
    url: `${environment.API_ENDPOINT}accounting/lookup`
  };
  public isLoading = true;
  public amountRange = [];
  public interestRateRange = [];
  public gracePeriodRange = [];
  public maturityRange = [];

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.createForm();
    this.isLoading = false;
  }

  createForm() {
    this.form = this.fb.group({
      profileId: new FormControl({value: '', disabled: true}, Validators.required),
      borrowingProductId: new FormControl('', Validators.required),
      amount: new FormControl(0, Validators.required),
      interestRate: new FormControl('', Validators.required),
      gracePeriod: new FormControl('', Validators.required),
      maturity: new FormControl('', Validators.required),
      preferredRepaymentDate: new FormControl('', Validators.required),
      scheduleType: new FormControl('', Validators.required),
      disbursementDate: new FormControl('', Validators.required),
      correspondenceAccountId: new FormControl('', Validators.required),
    });
  }

  submitForm() {
    this.submit.emit(this.form.value);
  }

  onLPSelect(loanProduct) {
    if (loanProduct) {
      this.refreshControlsArray(['interestRate', 'gracePeriod', 'maturity']);
      this.addValidationRules(loanProduct);
      this.onLoanProductSelect.emit(loanProduct);
      this.disableField(loanProduct, ['interestRate', 'gracePeriod', 'maturity']);
      this.form.markAsPristine();
      this.form.markAsUntouched();
    } else {
      this.disableAmountField(false);
      this.refreshControlsArray(['amount', 'total']);
      this.resetValidation(['amount', 'interestRate', 'gracePeriod', 'maturity']);
      this.onLoanProductSelect.emit(null);
    }
  }

  disableField(loanProduct, fields: string[]) {
    fields.map((field: string) => {
      if (loanProduct[`${field}Min`] === loanProduct[`${field}Max`]) {
        this.form.controls[field].disable({emitEvent: false});
        this.form.controls[field].setValue(loanProduct[`${field}Min`]);
      }
    });
  }

  refreshControlsArray(controlsArray: string[]) {
    controlsArray.map((controlName: string) => {
      this.form.controls[controlName].enable({emitEvent: false});
    });
    this.updateValidation(controlsArray);
  }

  resetValidation(controlsArray: string[]) {
    this.updateValidation(controlsArray);
    this.amountRange = [];
    this.interestRateRange = [];
    this.gracePeriodRange = [];
    this.maturityRange = [];
  }

  updateValidation(controlsArray: string[]) {
    controlsArray.map((controlName: string) => {
      this.form.controls[controlName].setValue('');
      this.form.controls[controlName].clearValidators();
      this.form.controls[controlName].setValidators([Validators.required]);
      this.form.controls[controlName].updateValueAndValidity({onlySelf: true});
    });
  }

  addValidationRules(loanProduct) {
    if (loanProduct.amountMin >= 0 && loanProduct.amountMax) {
      this.form.controls['amount'].clearValidators();
      this.form.controls['amount'].setValidators([
        Validators.required,
        range([loanProduct.amountMin, loanProduct.amountMax])
      ]);
      this.amountRange = [loanProduct.amountMin, loanProduct.amountMax];
    }

    if (loanProduct.interestRateMin >= 0 && loanProduct.interestRateMax) {
      this.form.controls['interestRate'].clearValidators();
      this.form.controls['interestRate'].setValidators([
        Validators.required,
        range([loanProduct.interestRateMin, loanProduct.interestRateMax])
      ]);
      this.interestRateRange = [loanProduct.interestRateMin, loanProduct.interestRateMax];
    }

    if (loanProduct.gracePeriodMin >= 0 && loanProduct.gracePeriodMax >= 0) {
      this.form.controls['gracePeriod'].clearValidators();
      this.form.controls['gracePeriod'].setValidators([
        Validators.required,
        range([loanProduct.gracePeriodMin, loanProduct.gracePeriodMax])
      ]);
      this.gracePeriodRange = [loanProduct.gracePeriodMin, loanProduct.gracePeriodMax];
    }

    if (loanProduct.maturityMin >= 0 && loanProduct.maturityMax) {
      this.form.controls['maturity'].clearValidators();
      this.form.controls['maturity'].setValidators([
        Validators.required,
        range([loanProduct.maturityMin, loanProduct.maturityMax])
      ]);
      this.maturityRange = [loanProduct.maturityMin, loanProduct.maturityMax];
    }
    this.form.updateValueAndValidity({emitEvent: false});
  }

  populateFields(data: any, loanProduct: IBorrowingProduct) {
    if (data['profile']) {
      this.profileName = data['profile']['name'];
    }
    for (const key in this.form.controls) {
      if (data.hasOwnProperty(key)) {
        this.form.controls[key].setValue(data[key], {emitEvent: false});
      }
    }
    if (loanProduct && Object.keys(loanProduct).length) {
      this.addValidationRules(loanProduct);
      this.disableField(loanProduct, ['interestRate', 'gracePeriod', 'maturity']);
      this.form.controls['scheduleType'].setValue(loanProduct.scheduleType, {emitEvent: false});
    }
  }

  disableAmountField(bool: boolean) {
    if (bool) {
      this.form.controls['amount'].disable({emitEvent: false});
    } else {
      this.form.controls['amount'].enable({emitEvent: false});
    }
  }
}
