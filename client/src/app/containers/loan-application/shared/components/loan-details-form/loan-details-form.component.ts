import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../environments/environment';
import { range } from './loan-details-form-validators';
import { ILoanAppFormState, ILoanProduct } from '../../../../../core/store/loan-application/loan-application-form';
import { LoanAppFormExtraService } from '../../services';
import { FieldConfig } from '../../../../../shared/modules/cbs-form/models/field-config.interface';
import { keys } from 'lodash'
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { TranslateService } from '@ngx-translate/core';
import { CurrentUserAppState } from '../../../../../core/store/users/current-user';
import { SystemSettingsShareService } from '../../../../../core/services';
import { Subscription } from 'rxjs';
import { IProfile } from '../../../../../core/store';


interface Config {
  scheduleTypeUrl: string;
}

@Component({
  selector: 'cbs-loan-details-form',
  templateUrl: 'loan-details-form.component.html',
  styleUrls: ['loan-details-form.component.scss']
})
export class LoanDetailsFormComponent implements OnInit {
  @Input() config: Config = {
    scheduleTypeUrl: `${environment.API_ENDPOINT}/schedule-types`
  };
  @Input() loanAppFormState: ILoanAppFormState;
  @Output() submit = new EventEmitter();
  @Output() onLoanProductSelect = new EventEmitter();
  @Output() onCreditLineSelect = new EventEmitter();
  @Output() onPayeeEdit = new EventEmitter();
  @Output() onPayeeDelete = new EventEmitter();
  @Output() onPayeeAdd = new EventEmitter();
  @Output() onEntryFeesClick = new EventEmitter();

  @ViewChild('preferredRepaymentDate', {static: false}) preferredRepaymentDate: ElementRef;
  @ViewChild('disbursementDate', {static: false}) disbursementDate: ElementRef;
  @ViewChild('maturityDate', {static: false}) maturityDate: ElementRef;

  public profileName: string;
  public profileType: string;
  public profileId: number;
  public memberFields: any;
  public creditLinesData = [];
  public group: false;
  public form: FormGroup;
  public formConfig = {
    profileLookupUrl: {
      url: `${environment.API_ENDPOINT}profiles`
    },
    userLookupUrl: {
      url: `${environment.API_ENDPOINT}users/lookup`,
      defaultQuery: ''
    },
    loanProductLookupUrl: {
      url: `${environment.API_ENDPOINT}loan-products/lookup`
    },
    currencyConfig: {
      url: `${environment.API_ENDPOINT}currencies/lookup`,
      defaultQuery: ''
    }
  };
  public isLoading = true;
  public amountRange = [];
  public interestRateRange = [];
  public gracePeriodRange = [];
  public maturityRange = [];
  public maxMaturityDate: any;
  public scheduleTypeList = [];
  public scheduleBasedType: string;
  public isRepayLess: boolean;
  public byMaturity: boolean;
  public disabledLoanProduct = false;

  private currentUser: CurrentUserAppState;
  private currentUserSub: Subscription;
  private profileSub: Subscription;

  constructor(private fb: FormBuilder,
              private loanAppFormExtraService: LoanAppFormExtraService,
              private profileStore$: Store<IProfile>,
              private store$: Store<fromRoot.State>,
              private systemSettingsShareService: SystemSettingsShareService,
              private httpClient: HttpClient,
              private translate: TranslateService) {
    this.currentUserSub = this.store$.pipe(select(fromRoot.getCurrentUserState))
      .subscribe((user: CurrentUserAppState) => {
        if ( user.loaded && user.success && !user.error ) {
          this.currentUser = user;
        }
      });
  }

  ngOnInit() {
    this.createForm();
    this.isLoading = false;

    this.getScheduleType(this.config.scheduleTypeUrl)
      .subscribe(
        res => {
          this.scheduleTypeList = res;
        },
        (err: HttpErrorResponse) => {
          console.error(err.error);
        }
      );

    this.profileSub = this.profileStore$.select(fromRoot.getProfileState)
      .subscribe(profile => {
        if ( profile && profile.id > 0 ) {
          this.getCreditLines(profile.id);
        } else if ( this.profileId ) {
          this.getCreditLines(this.profileId);
        }
      });
  }

  maturityDateChanged(value: any) {
    if ( !value ) {
      this.loanAppFormExtraService.announceFormStatusChange(false);
    }
    this.subtractDates(this.form.controls['disbursementDate'].value, value, 'maturityDate');
    if ( !this.isRepayLess ) {
      this.subtractDates(value, this.maxMaturityDate, 'maxMaturityDate');
    }
  }

  disbursementDateChanged(value: any) {
    if ( !value ) {
      this.loanAppFormExtraService.announceFormStatusChange(false);
    }
    this.subtractDates(value, this.form.controls['preferredRepaymentDate'].value, 'disbursement');
  }

  preferredRepaymentDateChanged(value: any) {
    if ( !value ) {
      this.loanAppFormExtraService.announceFormStatusChange(false);
    }
    this.subtractDates(this.form.controls['disbursementDate'].value, value, 'preferredPayment');
  }

  private subtractDates(disbursementDate, preferredPaymentDate, formType) {
    this.isRepayLess = this.loanAppFormExtraService
      .subtractPreferredRepaymentFromDisbursementDate(disbursementDate, preferredPaymentDate, formType);

    if ( this.isRepayLess === null && formType === 'preferredPayment' ) {
      this.preferredRepaymentDate['hasError'] = true;
      this.preferredRepaymentDate['errorOutputMessage'] = null;
      return;
    } else if ( this.isRepayLess === null && formType === 'disbursement' ) {
      this.disbursementDate['hasError'] = true;
      this.disbursementDate['errorOutputMessage'] = null;
      return;
    } else if ( this.isRepayLess === null && formType === 'maturityDate' ) {
      this.maturityDate['hasError'] = true;
      this.maturityDate['errorOutputMessage'] = null;
      return;
    } else if ( this.isRepayLess === null && formType === 'maxMaturityDate' ) {
      this.maturityDate['hasError'] = true;
      this.maturityDate['errorOutputMessage'] = null;
      return;
    }

    if ( this.isRepayLess && formType === 'maturityDate' ) {
      this.maturityDate['hasError'] = true;
      this.maturityDate['errorOutputMessage'] = this.translate.instant('MATURITY_DATE_ERROR_LATER_THAN_DISBURSEMENT_DATE');
    } else if ( formType === 'maturityDate' ) {
      this.maturityDate['hasError'] = false;
      this.maturityDate['errorOutputMessage'] = null;
    }

    if ( this.isRepayLess && formType === 'maxMaturityDate' ) {
      this.maturityDate['hasError'] = true;
      this.maturityDate['errorOutputMessage'] = this.translate.instant('MATURITY_DATE_CANNOT_BE_GREATER_THAN_MAX_MATURITY_DATE');
    } else if ( formType === 'maxMaturityDate' ) {
      this.maturityDate['hasError'] = false;
      this.maturityDate['errorOutputMessage'] = null;
    }

    if ( this.isRepayLess && formType === 'preferredPayment' ) {
      this.preferredRepaymentDate['hasError'] = true;
      this.preferredRepaymentDate['errorOutputMessage'] = this.translate.instant('PREFERRED_REPAYMENT_DATE_ERROR');
    } else if ( formType === 'preferredPayment' ) {
      this.preferredRepaymentDate['hasError'] = false;
      this.preferredRepaymentDate['errorOutputMessage'] = null;
    }
  }

  getProfileMembers(members = []) {
    if ( !members.length ) {
      this.loanAppFormExtraService.getProfileData(this.profileId)
        .subscribe(
          res => {
            this.generateMemberFields(res.groupsMembers);
          });
    } else {
      this.generateMemberFields(members);
    }
  }

  generateMemberFields(members) {
    const memberFields = [];
    members.map(item => {
      memberFields.push(
        {
          name: item.memberId.toString(),
          required: false,
          caption: item.name,
          id: item.memberId,
          fieldType: 'NUMERIC',
          value: item.amount || 0
        })
    });

    const memberFieldControls = <FormArray> this.form.controls['members'];
    if ( memberFieldControls.length ) {
      memberFieldControls.value.map(field => {
        memberFieldControls.removeAt(memberFieldControls.controls.indexOf(field));
      });
    }

    memberFields.map(item => {
      const group = this.fb.group({});
      group.addControl(item.id, this.createControl(item));
      memberFieldControls.push(group);
    });

    this.memberFields = memberFields;
  }

  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if ( required ) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }

  private getScheduleType(url) {
    return this.httpClient.get<any[]>(url);
  }

  createForm() {
    this.form = this.fb.group({
      profileId: new FormControl({value: '', disabled: true}, Validators.required),
      userId: new FormControl(this.currentUser.id, Validators.required),
      creditLineId: new FormControl(''),
      loanProductId: new FormControl('', Validators.required),
      amounts: new FormControl('', Validators.required),
      interestRate: new FormControl('', Validators.required),
      gracePeriod: new FormControl('', Validators.required),
      maturity: new FormControl('', Validators.required),
      disbursementDate: new FormControl('', Validators.required),
      preferredRepaymentDate: new FormControl('', Validators.required),
      scheduleType: new FormControl('', Validators.required),
      scheduleBasedType: new FormControl(''),
      currencyId: new FormControl(null, Validators.required),
      maturityDate: new FormControl('', Validators.required),
      members: this.fb.array([]),
      total: new FormControl({value: 0, disabled: true}, Validators.required),
    });
  }

  setProfileTypeToLookup(type: string) {
    this.formConfig['loanProductLookupUrl'] = {url: `${environment.API_ENDPOINT}loan-products/lookup?availability=${type}`}
  }

  submitForm() {
    this.submit.emit(this.form.value);
  }

  creditLineSelect(creditLine) {
    if ( creditLine ) {
      this.creditLinesData.forEach(val => {
        if ( val.id === creditLine ) {
          this.disabledLoanProduct = true;
          this.form.controls['loanProductId'].setValue(val.loanProduct.id);
          this.onLPSelect(val.loanProduct, val);
          this.onCreditLineSelect.emit(val);
        }
      });
    } else {
      this.disabledLoanProduct = false;
    }
  }

  getCreditLines(profileId) {
    this.loanAppFormExtraService.getCreditLines(profileId)
      .subscribe(
        res => {
          if ( res ) {
            this.creditLinesData = res;
            const value = [];
            res.forEach(val => {
              value.push({
                value: val.id,
                name: val.name
              });
            });
          }
        });
  }

  onLPSelect(loanProduct, creditLine?) {
    if ( loanProduct ) {
      this.loanAppFormExtraService.setMaxMaturityDate(loanProduct.maturityDateMax);
      this.scheduleBasedType = loanProduct.scheduleBasedType;
      if ( this.scheduleBasedType === 'BY_MATURITY' ) {
        this.byMaturity = true;
        this.form.controls['maturityDate'].setValidators(Validators.required);
        this.form.controls['maturity'].clearValidators();
        this.form.controls['maturity'].setErrors(null);
      } else {
        this.byMaturity = false;
        this.form.controls['maturity'].setValidators(Validators.required);
        this.form.controls['maturityDate'].clearValidators();
        this.form.controls['maturityDate'].setErrors(null);
      }
      this.form.updateValueAndValidity();
      this.formConfig.currencyConfig = {
        ...this.formConfig.currencyConfig,
        defaultQuery: loanProduct.currency ? loanProduct.currency.name : ''
      };
      this.refreshControlsArray(['interestRate', 'gracePeriod', 'maturity']);
      this.addValidationRules(loanProduct, creditLine);
      this.disableAmountField(loanProduct.hasPayees || this.profileType === 'GROUP');
      this.onLoanProductSelect.emit(loanProduct);
      this.disableField(loanProduct, ['gracePeriod', 'maturity']);
      this.disableFieldCurrency('currencyId', loanProduct, null);
      this.disableFieldScheduleType(loanProduct, 'scheduleType');
      this.setValue('scheduleBasedType', loanProduct.scheduleBasedType);
      this.form.markAsPristine();
      this.form.markAsUntouched();
    } else {
      this.disableAmountField(false);
      this.refreshControlsArray(['amounts', 'total']);
      this.resetValidation(['amounts', 'interestRate', 'gracePeriod', 'maturity']);
      this.onLoanProductSelect.emit(null);
    }

  }

  disableField(loanProduct, fields: string[]) {
    fields.map((field: string) => {
      if ( loanProduct[`${field}Min`] === loanProduct[`${field}Max`] ) {
        this.form.controls[field].disable({emitEvent: false});
        this.form.controls[field].setValue(loanProduct[`${field}Min`]);
      }
    });
  }

  disableFieldCurrency(field: string, loanProduct: any, data: any) {
    if ( loanProduct && loanProduct['currency'] ) {
      this.setValue(field, loanProduct.currency.id);
      this.disableControl(field);
      return;
    }
    if ( data && data['currencyId'] ) {
      this.setValue(field, data['currencyId']);
      this.enableControl(field);
      return;
    }
    this.setValue(field, null);
    this.enableControl(field);
  }

  disableFieldScheduleType(loanProduct, field: string) {
    if ( loanProduct['scheduleType'] ) {
      this.disableControl(field);
      this.setValue(field, loanProduct.scheduleType);
      return;
    }
    this.enableControl(field);
  }

  setValue(field, value) {
    this.form.controls[field].setValue(value, {emitEvent: false});
  }

  disableControl(field) {
    this.form.controls[field].disable({emitEvent: false});
  }

  enableControl(field) {
    this.form.controls[field].enable({emitEvent: false});
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
    this.maxMaturityDate = '';
  }

  updateValidation(controlsArray: string[]) {
    controlsArray.map((controlName: string) => {
      this.form.controls[controlName].setValue('');
      this.form.controls[controlName].clearValidators();
      this.form.controls[controlName].setValidators([Validators.required]);
      this.form.controls[controlName].updateValueAndValidity({onlySelf: true});
    });
  }

  addValidationRules(loanProduct, creditLine?) {
    if ( loanProduct.scheduleBasedType === 'BY_MATURITY' ) {
      this.maxMaturityDate = loanProduct.maturityDateMax;
    }

    if ( creditLine && (creditLine.disbursementAmountMin >= 0 && creditLine.disbursementAmountMax) ) {
      this.form.controls['amounts'].clearValidators();
      this.form.controls['amounts'].setValidators([
        Validators.required,
        range([creditLine.disbursementAmountMin, creditLine.disbursementAmountMax])
      ]);
      this.amountRange = [creditLine.disbursementAmountMin, creditLine.disbursementAmountMax];
    } else {
      if ( loanProduct.amountMin >= 0 && loanProduct.amountMax ) {
        this.form.controls['amounts'].clearValidators();
        this.form.controls['amounts'].setValidators([
          Validators.required,
          range([loanProduct.amountMin, loanProduct.amountMax])
        ]);
        this.amountRange = [loanProduct.amountMin, loanProduct.amountMax];
      }
    }

    if ( creditLine && (creditLine.interestRateMin >= 0 && creditLine.interestRateMax) ) {
      this.form.controls['interestRate'].clearValidators();
      this.form.controls['interestRate'].setValidators([
        Validators.required,
        range([creditLine.interestRateMin, creditLine.interestRateMax])
      ]);
      this.interestRateRange = [creditLine.interestRateMin, creditLine.interestRateMax];
    } else {
      if ( loanProduct.interestRateMin >= 0 && loanProduct.interestRateMax ) {
        this.form.controls['interestRate'].clearValidators();
        this.form.controls['interestRate'].setValidators([
          Validators.required,
          range([loanProduct.interestRateMin, loanProduct.interestRateMax])
        ]);
        this.interestRateRange = [loanProduct.interestRateMin, loanProduct.interestRateMax];
      }
    }

    if ( loanProduct.gracePeriodMin >= 0 && loanProduct.gracePeriodMax >= 0 ) {
      this.form.controls['gracePeriod'].clearValidators();
      this.form.controls['gracePeriod'].setValidators([
        Validators.required,
        range([loanProduct.gracePeriodMin, loanProduct.gracePeriodMax])
      ]);
      this.gracePeriodRange = [loanProduct.gracePeriodMin, loanProduct.gracePeriodMax];
    }

    if ( loanProduct.maturityMin >= 0 && loanProduct.maturityMax ) {
      this.form.controls['maturity'].clearValidators();
      this.form.controls['maturity'].setValidators([
        Validators.required,
        range([loanProduct.maturityMin, loanProduct.maturityMax])
      ]);
      this.maturityRange = [loanProduct.maturityMin, loanProduct.maturityMax];
    }
    const memberFieldControls = <FormArray> this.form.controls['members'];
    if ( memberFieldControls.length ) {
      memberFieldControls.value.map((fieldValue, index) => {
        const memberId = keys(fieldValue)[0];
        const formGroup: any = memberFieldControls.controls[index];
        const memberFieldControl = formGroup.controls[memberId];
        if ( memberFieldControl ) {
          memberFieldControl.clearValidators();
          memberFieldControl.setValidators([
            Validators.required,
            range([loanProduct.amountMin, loanProduct.amountMax], {
              exceptValue: 0
            })
          ]);
          memberFieldControl.updateValueAndValidity()
        }
      });
    }

    this.form.updateValueAndValidity({emitEvent: false});
  }

  populateFields(data: any, loanProduct: ILoanProduct, creditLine?: any) {
    if ( data['profile'] ) {
      this.profileName = data['profile']['name'];
    }

    this.formConfig.currencyConfig = {
      ...this.formConfig.currencyConfig,
      defaultQuery: data.currencyName ? data.currencyName : ''
    };

    for ( const key in this.form.controls ) {
      if ( data.hasOwnProperty(key) ) {
        this.form.controls[key].setValue(data[key], {emitEvent: false});
      }
    }

    // Disable net amount field if profile type is Group
    if ( this.profileType === 'GROUP' ) {
      this.disableAmountField(true)
    }

    if ( loanProduct && Object.keys(loanProduct).length ) {
      this.scheduleBasedType = loanProduct.scheduleBasedType;
      if ( this.scheduleBasedType === 'BY_MATURITY' ) {
        this.byMaturity = true;
        this.form.controls['maturityDate'].setValidators(Validators.required);
        this.form.controls['maturity'].clearValidators();
        this.form.controls['maturity'].setErrors(null);
      } else {
        this.byMaturity = false;
        this.form.controls['maturity'].setValidators(Validators.required);
        this.form.controls['maturityDate'].clearValidators();
        this.form.controls['maturityDate'].setErrors(null);
      }
      this.addValidationRules(loanProduct, creditLine);
      this.disableField(loanProduct, ['gracePeriod', 'maturity']);
      this.disableFieldCurrency('currencyId', loanProduct, data);
      this.disableFieldScheduleType(loanProduct, 'scheduleType');
      this.setValue('scheduleBasedType', loanProduct.scheduleBasedType);
      if ( loanProduct.hasPayees ) {
        this.disableAmountField(true);
      }
    }
  }

  disableAmountField(bool: boolean) {
    if ( bool ) {
      this.form.controls['amounts'].disable({emitEvent: false});
    } else {
      this.form.controls['amounts'].enable({emitEvent: false});
    }
  }
}
