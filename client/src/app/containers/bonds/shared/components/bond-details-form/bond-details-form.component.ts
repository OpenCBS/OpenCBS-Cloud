import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators
} from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import {
  BondFormState,
  BondProduct
} from '../../../../../core/store/bond/bond-form/bond-form.interfaces';
import { range } from './bond-details-form-validators';
import * as moment from 'moment';

@Component({
  selector: 'cbs-bond-details-form',
  templateUrl: 'bond-details-form.component.html',
  styleUrls: ['bond-details-form.component.scss']
})
export class BondDetailsFormComponent implements OnInit {
  @Input() bondFormState: BondFormState;
  @Output() submit = new EventEmitter();
  @Output() onAmountRelatedFieldChanged = new EventEmitter();
  @Output() onGetCouponRealtedFieldChanged = new EventEmitter();
  public currencyConfig = {
    url: `${environment.API_ENDPOINT}currencies/lookup`
  };

  public frequency = [
    {
      value: 'MONTHLY',
      name: 'MONTHLY'
    },
    {
      value: 'QUARTERLY',
      name: 'QUARTERLY'
    },

    {
      value: 'SEMIANNUALLY',
      name: 'SEMIANNUALLY'
    }
  ];

  public interestScheme = [
    {
      value: '30/360',
      name: '30/360'
    }, {
      value: 'FACT/FACT',
      name: 'FACT/FACT'
    }
  ];

  private profileName: string;
  private amount: number;
  private equivalentAmount: number;
  public form: FormGroup;
  public accountConfig = {
    url: `${environment.API_ENDPOINT}accounting/lookup`
  };
  public isLoading = true;
  public numberRange = [];
  public interestRateRange = [];
  public penaltyRateRange = [];
  public maturity = [];
  public maturityRange = [];
  private expireDate: any;
  private couponDate: any;

  constructor(private fb: FormBuilder) {
  }

  setExpireDate(value: any) {
    this.expireDate = value;
    this.setValue('expireDate', value);
  }
  setCouponDate(value: any) {
    this.couponDate = value;
    this.setValue('couponDate', value);
  }

  setProfileName(name) {
    this.profileName = name;
  }

  setAmount(amount) {
    this.amount = amount;
  }

  setEquivalentAmount(amount) {
    this.equivalentAmount = amount;
  }

  getAmount() {
    return this.amount;
  }

  getEquivalentAmount() {
    return this.equivalentAmount;
  }

  getProfile() {
    return this.profileName;
  }

  setControlValue(controlName: string, data: any, options?: Object) {
    this.form.controls[controlName].setValue(data, options);
  }

  ngOnInit() {
    this.createForm();
    this.isLoading = false;
  }

  hasError(field: string) {
    const control = this.form.get(field);
    if (!control) {
      return;
    }
    return control.errors && control.touched;
  }

  createForm() {
    const startDate = moment().format(environment.DATE_FORMAT_MOMENT);
    this.form = this.fb.group({
      profileId: new FormControl(
        {value: '', disabled: true},
        Validators.required),
      amount: new FormControl({value: '', disabled: true}, Validators.required),
      bondProductId: new FormControl({value: '', disabled: true}, Validators.required),
      equivalentAmount: new FormControl({value: '', disabled: true}, Validators.required),
      couponDate: new FormControl('', Validators.required),
      number: new FormControl(0, Validators.required),
      equivalentCurrencyId: new FormControl(0, Validators.required),
      bankAccountId: new FormControl('', Validators.required),
      interestRate: new FormControl('', Validators.required),
      penaltyRate: new FormControl('', Validators.required),
      frequency: new FormControl('', Validators.required),
      interestScheme: new FormControl('', Validators.required),
      maturity: new FormControl('', Validators.required),
      sellDate: new FormControl(startDate, Validators.required),
      expireDate: new FormControl('', Validators.required)
    });
  }

  submitForm() {
    this.submit.emit(this.form.value);
  }

  amountRelatedFieldChanged() {
    this.onAmountRelatedFieldChanged.emit(this.form.value);
  }

  couponRelatedFieldChanged() {
    this.amountRelatedFieldChanged();
    this.onGetCouponRealtedFieldChanged.emit(this.form.value);
  }

  disableField(product, fields: string[]) {
    fields.map((field: string) => {
      if (product[`${field}Min`] === product[`${field}Max`]) {
        this.form.controls[field].disable({emitEvent: false});
        this.form.controls[field].setValue(product[`${field}Min`]);
      }
    });
  }

  addValidationRules(product) {
    if (product.numberMin >= 0 && product.numberMax) {
      this.form.controls['number'].clearValidators();
      this.form.controls['number'].setValidators([
        Validators.required,
        range([product.numberMin, product.numberMax])
      ]);
      this.numberRange = [product.numberMin, product.numberMax];
    }

    if (product.interestRateMin >= 0 && product.interestRateMax) {
      this.form.controls['interestRate'].clearValidators();
      this.form.controls['interestRate'].setValidators([
        Validators.required,
        range([product.interestRateMin, product.interestRateMax])
      ]);
      this.interestRateRange = [
        product.interestRateMin,
        product.interestRateMax
      ];
    }

    if (product.penaltyRateMin >= 0 && product.penaltyRateMax) {
      this.form.controls['penaltyRate'].clearValidators();
      this.form.controls['penaltyRate'].setValidators([
        Validators.required,
        range([product.penaltyRateMin, product.penaltyRateMax])
      ]);
      this.penaltyRateRange = [
        product.penaltyRateMin,
        product.penaltyRateMax
      ];
    }

    if (product.maturityMin >= 0 && product.maturityMax >= 0) {
      this.form.controls['maturity'].clearValidators();
      this.form.controls['maturity'].setValidators([
        Validators.required,
        range([product.maturityMin, product.maturityMax])
      ]);
      this.maturity = [product.maturityMin, product.maturityMax];
    }

    if (product.maturityMin >= 0 && product.maturityMax) {
      this.form.controls['maturity'].clearValidators();
      this.form.controls['maturity'].setValidators([
        Validators.required,
        range([product.maturityMin, product.maturityMax])
      ]);
      this.maturityRange = [product.maturityMin, product.maturityMax];
    }
    this.form.updateValueAndValidity({emitEvent: false});
  }

  populateFields(data: any, product: BondProduct) {
    if (data['profile']) {
      this.profileName = data['profile']['name'];
    }

    if (data['bondAmount'] && data['bondAmount']['equivalentAmount']) {
      this.equivalentAmount = data['bondAmount']['equivalentAmount']
    }

    if (data['bondAmount'] && data['bondAmount']['amount']) {
      this.amount = data['bondAmount']['amount']
    }

    for (const key in this.form.controls) {
      if (data.hasOwnProperty(key)) {
        this.form.controls[key].setValue(data[key], {emitEvent: false});
      }
    }
    if (product && Object.keys(product).length) {
      this.addValidationRules(product);
      this.disableField(product, ['interestRate', 'penaltyRate', 'maturity', 'number']);
      this.disableControl('expireDate');
      this.disableControl('couponDate');
    }
  }

  disableControl(name: string) {
    this.form.get(name).disable();
  }

  private setValue(controlName: string, value: any) {
    this.form.get(controlName).setValue(value);
  }
}
