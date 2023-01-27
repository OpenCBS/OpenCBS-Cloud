import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { range } from '../shared/validators/term-deposit-validators';
import * as moment from 'moment';
import { TermDepositProductInfoService } from '../../../core/store/term-deposit-products/term-deposit-product-info';

@Component({
  selector: 'cbs-term-deposit-new',
  templateUrl: './term-deposit-new.component.html',
  styleUrls: ['./term-deposit-new.component.scss']
})

export class TermDepositNewComponent implements OnInit {
  private queryParams = false;
  private routeSub: any;
  private currentUserSub: any;
  private termDepositProductId: number;
  private termDepositProductState: any;

  public formVisible = false;
  public form: FormGroup;
  public isLoading = true;
  public profileName: string;
  public interestRateRange = [];
  public termAgreementRange = [];
  public earlyCloseFeeFlatRange = [];
  public earlyCloseFeeRateRange = [];
  public profileId: number;
  public profileType: any;
  public createdDate: any;
  public currentUserId: number;
  public formConfigTermDepositProduct = {
    termDepositProductLookupUrl: {url: `${environment.API_ENDPOINT}term-deposit-products`}
  };
  public formConfigTermDepositOfficer = {
    termDepositOfficerLookupUrl: {url: `${environment.API_ENDPOINT}users/lookup`}
  };

  private rangeValidateFields = [
    'interestRate',
    'termAgreement',
    'earlyCloseFeeRate',
    'earlyCloseFeeFlat'];

  constructor(public route: ActivatedRoute,
              private router: Router,
              private termDepositProductInfoService: TermDepositProductInfoService,
              private store$: Store<fromRoot.State>,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.currentUserSub = this.store$.pipe(select(fromRoot.getCurrentUserState)).subscribe(userState => {
      if (userState['loaded'] && !userState['error'] && userState['success']) {
        this.currentUserId = userState.id;
      }
    });

    this.createdDate = moment().format(environment.DATE_FORMAT_MOMENT);
    this.form = this.fb.group({
      profileId: new FormControl({value: '', disabled: true}, Validators.required),
      termDepositProductId: new FormControl('', Validators.required),
      interestRate: new FormControl('', Validators.required),
      createdDate: new FormControl(this.createdDate, Validators.required),
      termAgreement: new FormControl('', Validators.required),
      earlyCloseFeeRate: new FormControl('', Validators.required),
      earlyCloseFeeFlat: new FormControl('', Validators.required),
      serviceOfficerId: new FormControl(this.currentUserId, Validators.required)
    });


    this.routeSub = this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length && +params['profileId'] > 0) {
        this.profileId = params.profileId;
        this.profileType = params.profileType;
        setTimeout(() => {
          this.setProfileData(params);
          this.formVisible = true;
        });
        this.queryParams = true;
      } else {
        this.formVisible = true;
      }
    });
    this.isLoading = false;
  }

  hasError(controlName: string) {
    return this.form.get(controlName).errors && this.form.get(controlName).touched;
  }

  setProfileData(data) {
    if (data) {
      this.form.controls['profileId'].setValue(+data['profileId'], {emitEvent: false});
      this.profileName = data['profileName'];
      this.form.controls['profileId'].setValue(data['profileId']);
    }
  }

  onTermDepositSelect(termDepositProduct) {
    if (termDepositProduct) {
      this.refreshControlsArray(this.rangeValidateFields);
      this.addValidationRules(termDepositProduct);
      this.disableField(termDepositProduct, this.rangeValidateFields);
      this.form.markAsPristine();
      this.form.markAsUntouched();
    } else {
      this.refreshControlsArray(['amount', 'total']);
    }
  }

  disableField(termDepositProduct, fields: string[]) {
    fields.map((field: string) => {
      if (termDepositProduct[`${field}Min`] === termDepositProduct[`${field}Max`]) {
        this.form.controls[field].disable({emitEvent: false});
        this.form.controls[field].setValue(termDepositProduct[`${field}Min`]);
      }
    });
  }

  refreshControlsArray(controlsArray: string[]) {
    controlsArray.map((controlName: string) => {
      this.form.controls[controlName].enable({emitEvent: false});
    });
  }

  addValidationRules(termDepositProduct) {
    this.interestRateRange = this.addValidationRuleAndGetRange(
      'interestRate',
      termDepositProduct.interestRateMin,
      termDepositProduct.interestRateMax);

    this.termAgreementRange = this.addValidationRuleAndGetRange(
      'termAgreement',
      termDepositProduct.termAgreementMin,
      termDepositProduct.termAgreementMax);

    this.earlyCloseFeeRateRange = this.addValidationRuleAndGetRange(
      'earlyCloseFeeRate',
      termDepositProduct.earlyCloseFeeRateMin,
      termDepositProduct.earlyCloseFeeRateMax);

    this.earlyCloseFeeFlatRange = this.addValidationRuleAndGetRange(
      'earlyCloseFeeFlat',
      termDepositProduct.earlyCloseFeeFlatMin,
      termDepositProduct.earlyCloseFeeFlatMax);

    this.form.updateValueAndValidity({emitEvent: false});
  }

  private addValidationRuleAndGetRange(controlName: string, min: number, max: number): any[] {
    let valueRange = [];
    if (min >= 0 && max >= 0) {
      valueRange = [min, max];
      this.form.controls[controlName].clearValidators();
      this.form.controls[controlName].setValidators([Validators.required, range(valueRange)]);
      return valueRange;
    }
    return valueRange;
  }

  populateFields(termDeposit) {
    this.termDepositProductId = termDeposit.termDepositProductId;
    // tslint:disable-next-line:forin
    for (const key in termDeposit) {
      if (this.form.controls.hasOwnProperty(key)) {
        this.form.controls[key].setValue(termDeposit[key]);
      }
      if (key === 'createdDate') {
        const date = moment(termDeposit['createdDate']).format(environment.DATE_FORMAT_MOMENT);
        this.form.controls['createdDate'].setValue(date);
      }
    }
    this.getTermDepositProduct();
    this.profileName = termDeposit.profileName;
    this.form.controls['serviceOfficerId'].setValue(termDeposit.serviceOfficerId);
    this.form.controls['termDepositProductId'].setValue(termDeposit.termDepositProductId);
  }

  getTermDepositProduct() {
    this.isLoading = true;
    this.termDepositProductInfoService.getTermDepositProductInfo(this.termDepositProductId).subscribe(res =>  {
      this.termDepositProductState = res;
      this.addValidationRules(this.termDepositProductState);
      this.disableField(this.termDepositProductState, this.rangeValidateFields);
      this.isLoading = false;
    })
  }
}
