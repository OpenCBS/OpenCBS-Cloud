import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../core/core.reducer';
import * as fromStore from '../../../../../../core/store';
import { EntryFeeListState } from '../../../../../../core/store/entry-fees';
import { PenaltiesState } from '../../../../../../core/store/penalties';
import { ICurrencyList } from '../../../../../../core/store/currencies/currency-list/currency-list.reducer';
import { environment } from '../../../../../../../environments/environment';
import { FieldConfig } from '../../../../../../shared/modules/cbs-form/models/field-config.interface';
import { LoanProductState } from '../../../../../../core/store/loan-products/loan-product/loan-product.reducer';
import { Subscription } from 'rxjs';
import { cloneDeep } from 'lodash'
import { CommonService } from '../../../../../../core/services';

const STATUS_TYPE_DATA = [
  {
    value: 'ACTIVE',
    name: 'ACTIVE'
  },
  {
    value: 'INACTIVE',
    name: 'INACTIVE'
  },
];
const EARLY_PARTIAL_REPAYMENT_FEE_TYPE = [
  {
    value: 'OLB',
    name: 'OLB'
  },
  {
    value: 'RECEIVED_AMOUNT',
    name: 'RECEIVED_AMOUNT'
  },
  {
    value: 'PRINCIPAL',
    name: 'PRINCIPAL'
  }
];
const EARLY_TOTAL_REPAYMENT_FEE_TYPE = [
  {
    value: 'OLB',
    name: 'OLB'
  },
  {
    value: 'RECEIVED_DUE',
    name: 'RECEIVED_DUE'
  },
  {
    value: 'REMAINING_INTEREST',
    name: 'REMAINING_INTEREST'
  }
];

@Component({
  selector: 'cbs-edit-loan-product-form',
  templateUrl: 'edit-loan-product-form.component.html',
  styleUrls: ['edit-loan-product-form.component.scss']
})

export class EditLoanProductFormComponent implements OnInit, OnDestroy, AfterViewInit {
  public currencyConfig = {
    url: `${environment.API_ENDPOINT}currencies/lookup?&sort=id,asc`,
    defaultQuery: ''
  };
  public scheduleTypeConfig = {
    url: `${environment.API_ENDPOINT}schedule-types/lookup`
  };
  public scheduleBasedTypeConfig = {
    url: `${environment.API_ENDPOINT}schedule-based-types/lookup`
  };
  public earlyPartialRepaymentFeeType = EARLY_PARTIAL_REPAYMENT_FEE_TYPE;
  public earlyTotalRepaymentFeeType = EARLY_TOTAL_REPAYMENT_FEE_TYPE;
  public statusTypeData = STATUS_TYPE_DATA;
  @Input() isCreateMode = false;
  @Output() onEntryFeeChanged = new EventEmitter();
  @Output() onPenaltyChanged = new EventEmitter();

  public form: FormGroup;
  public isHidden = true;
  public selectedFees = [];
  public selectedPenalties = [];
  public provisioning = [];
  public allEntryFees = [];
  public allPenalties = [];
  public currencies = [];
  public accountList: any;
  public productAccounts: any;
  public cachedData;
  public showTopUp = false;
  public topUpEmpty = false;
  public currenciesSub: any;
  public currentInstance: string;

  public byInstallment = true;
  public isOpenProvision = false;
  public lateDaysProvision: number;
  public ratePortfolioProvision: number;
  public rateInterestProvision: number;
  public ratePenaltyProvision: number;

  private entryFeesSub: Subscription;
  private penaltiesSub: Subscription;
  private loanProductSub: Subscription;

  constructor(private fb: FormBuilder,
              private currencyListStore$: Store<ICurrencyList>,
              private store$: Store<fromRoot.State>,
              private entryFeeListStore$: Store<EntryFeeListState>,
              private penaltiesStore$: Store<PenaltiesState>,
              private commonService: CommonService) {
    this.entryFeesSub = this.store$.pipe(select(fromRoot.getEntryFeeListState))
      .subscribe((entryFeesState: EntryFeeListState) => {
        if ( entryFeesState.success && entryFeesState.loaded && entryFeesState.entryFees ) {
          entryFeesState.entryFees.map(entryFee => {
            this.allEntryFees.push(entryFee);
          });
          setTimeout(() => {
            if ( this.allEntryFees.length ) {
              this.sortDataByName(this.allEntryFees);
              this.compareData(this.selectedFees, this.allEntryFees);
            }
          }, 500);
        }
      });

    this.penaltiesSub = this.store$.pipe(select(fromRoot.getPenaltiesState))
      .subscribe((penaltiesState: PenaltiesState) => {
        if ( penaltiesState.success && penaltiesState.loaded && penaltiesState.penalties ) {
          penaltiesState.penalties.map(penalty => {
            this.allPenalties.push(penalty);
          });
          setTimeout(() => {
            if ( this.allPenalties.length ) {
              this.sortDataByName(this.allPenalties);
              this.compareData(this.selectedPenalties, this.allPenalties);
            }
          }, 500);
        }
      });
  }

  sortDataByName(data) {
    data.sort((a, b) => {
      if ( a.name.toLowerCase() > b.name.toLowerCase() ) {
        return 1;
      }
      if ( a.name.toLowerCase() < b.name.toLowerCase() ) {
        return -1;
      }
      return 0;
    });
  }

  ngOnInit() {
    this.currentInstance = this.commonService.getData();
    this.form = new FormGroup({
      statusType: new FormControl(''),
      name: new FormControl('', Validators.required),
      availability: this.fb.array([
        this.fb.group({
          person_profile: ['']
        }),
        this.fb.group({
          company_profile: ['']
        }),
        this.fb.group({
          group_profile: ['']
        })
      ], (control) => {
        if ( control.value[0]['person_profile'] || control.value[1]['company_profile'] || control.value[1]['group_profile'] ) {
          return null;
        } else {
          return {
            atLeastOne: true
          };
        }
      }),
      scheduleType: new FormControl(''),
      scheduleBasedType: new FormControl('', Validators.required),
      interestRateMin: new FormControl('', Validators.required),
      interestRateMax: new FormControl('', Validators.required),
      amountMin: new FormControl('', Validators.required),
      amountMax: new FormControl('', Validators.required),
      maturityMin: new FormControl(''),
      maturityMax: new FormControl(''),
      maturityDateMax: new FormControl(''),
      gracePeriodMin: new FormControl('', Validators.required),
      gracePeriodMax: new FormControl('', Validators.required),
      hasPayees: new FormControl(''),
      code: new FormControl('', Validators.required),
      currencyId: new FormControl(''),
      topUpAllow: new FormControl(''),
      topUpMaxLimit: new FormControl(''),
      topUpMaxOlb: new FormControl(''),
      earlyPartialRepaymentFeeValue: new FormControl('', Validators.required),
      earlyPartialRepaymentFeeType: new FormControl('', Validators.required),
      earlyTotalRepaymentFeeValue: new FormControl('', Validators.required),
      earlyTotalRepaymentFeeType: new FormControl('', Validators.required),
      accountList: this.fb.array([], Validators.required)
    });

    this.load();

    this.currenciesSub = this.store$.pipe(select(fromRoot.getCurrencyListState))
      .subscribe((currencyList: ICurrencyList) => {
        if ( currencyList.success && currencyList.loaded && currencyList.currencies ) {
          this.currencies = currencyList.currencies;
        }
      });

    this.loanProductSub = this.store$.pipe(select(fromRoot.getLoanProductState)).subscribe(
      (loanProductState: LoanProductState) => {
        if ( loanProductState.success && loanProductState.loaded && loanProductState.loanProduct ) {
          this.byInstallment = loanProductState.loanProduct['scheduleBasedType'] === 'BY_INSTALLMENT';
          this.selectedFees = Object.assign([], this.selectedFees);
          this.selectedPenalties = Object.assign([], this.selectedPenalties);
          this.provisioning = loanProductState.loanProduct['provisioning'];
          this.generateAccounts(this.getLoanProductAccounts(loanProductState.loanProduct['accounts']));
        }
      });

    this.currencyListStore$.dispatch(new fromStore.LoadCurrencies());
  }

  getScheduleBasedType(value) {
    this.byInstallment = value.id === 'BY_INSTALLMENT';
    if ( this.byInstallment ) {
      this.form.controls['maturityMin'].setValidators(Validators.required);
      this.form.controls['maturityMax'].setValidators(Validators.required);
      this.form.controls['maturityDateMax'].clearValidators();
      this.form.controls['maturityDateMax'].reset();
    } else {
      this.form.controls['maturityMin'].clearValidators();
      this.form.controls['maturityMax'].clearValidators();
      this.form.controls['maturityMin'].reset();
      this.form.controls['maturityMax'].reset();
      this.form.controls['maturityDateMax'].setValidators(Validators.required);
    }
  }

  ngAfterViewInit() {
    if ( this.isCreateMode ) {
      this.isHidden = false;
    }
    this.form.valueChanges.subscribe(data => {
      if ( this.showTopUp ) {
        this.topUpEmpty = data.topUpMaxLimit === '' || data.topUpMaxOlb === '';
      } else {
        this.topUpEmpty = false;
      }
    })
  }

  getLoanProductAccounts(accounts) {
    const arr = [];
    let accountId;
    let accountNumber;
    accounts.map(account => {
      if ( account.accountDto && account.accountDto.id && account.accountDto.number ) {
        accountId = account.accountDto.id;
        accountNumber = account.accountDto.number;
      } else {
        accountId = '';
        accountNumber = '';
      }
      this.cachedData = this.form.value;
      arr.push(
        {
          name: account.accountRuleType,
          required: true,
          caption: account.accountRuleType,
          value: {id: accountId},
          fieldType: 'LOOKUP',
          extra: {
            url: `${environment.API_ENDPOINT}accounting/lookup?accountTypes=BALANCE,SUBGROUP`,
            code: true,
            defaultQuery: accountNumber
          }
        });
    });
    return arr;
  };

  generateAccounts(fieldsArray) {
    const fields = <FormArray>this.form.controls['accountList'];
    if ( fields.length ) {
      fields.value.map(field => {
        fields.removeAt(fields.controls.indexOf(field));
      });
    }

    fieldsArray.map(item => {
      const group = this.fb.group({});
      group.addControl(item.name, this.createControl(item));
      fields.push(group);
    });

    this.productAccounts = fieldsArray;
  }

  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if ( required ) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }

  showTopUpFields() {
    this.showTopUp = !this.showTopUp;
    if ( !this.showTopUp ) {
      this.form.controls['topUpMaxLimit'].setValue('');
      this.form.controls['topUpMaxOlb'].setValue('');
    }
  }

  openProvisionModal() {
    this.isOpenProvision = true;
  }

  cancelModal() {
    this.lateDaysProvision = null;
    this.ratePortfolioProvision = null;
    this.rateInterestProvision = null;
    this.ratePenaltyProvision = null;
    this.isOpenProvision = false;
  }

  addProvisioning() {
    const newProvisioning = cloneDeep(this.provisioning);
    newProvisioning.push({
      lateDays: this.lateDaysProvision,
      ratePrincipal: this.ratePortfolioProvision,
      rateInterest: this.rateInterestProvision,
      ratePenalty: this.ratePenaltyProvision
    });
    this.provisioning = newProvisioning;
    this.cancelModal();
  }

  deleteProvisioning(prov) {
    const newProvisioning = cloneDeep(this.provisioning);
    newProvisioning.filter(a => {
      if ( a['lateDays'] === prov.lateDays && a['ratePrincipal'] === prov.ratePrincipal
        && a['rateInterest'] === prov.rateInterest && a['ratePenalty'] === prov.ratePenalty ) {
        newProvisioning.splice(newProvisioning.indexOf(a), 1);
      }
    });
    this.provisioning = newProvisioning;
  }

  ngOnDestroy() {
    this.currencyListStore$.dispatch(new fromStore.ResetCurrencies());
    this.currenciesSub.unsubscribe();
    this.entryFeesSub.unsubscribe();
    this.penaltiesSub.unsubscribe();
    this.loanProductSub.unsubscribe();
    this.resetState();
  }

  resetState() {
    this.entryFeeListStore$.dispatch(new fromStore.EntryFeesListReset());
    this.penaltiesStore$.dispatch(new fromStore.PenaltiesReset());
  };

  load() {
    this.entryFeeListStore$.dispatch(new fromStore.LoadEntryFees());
    this.penaltiesStore$.dispatch(new fromStore.LoadPenalties());
  }

  populateFields(loan_product) {
    for (const key in loan_product) {
      if ( this.form.controls.hasOwnProperty(key) && loan_product.hasOwnProperty(key) ) {
        this.form.controls[key].setValue(loan_product[key], {emitEvent: false});
      }
      if ( key === 'currency' ) {
        this.form.controls['currencyId'].setValue(loan_product['currency'] ? loan_product['currency']['id'] : null);
      }

      if ( loan_product.topUpAllow ) {
        this.showTopUp = true;
        this.form.controls['topUpMaxLimit'].setValue(loan_product.topUpMaxLimit);
        this.form.controls['topUpMaxOlb'].setValue(loan_product.topUpMaxOlb);
      }
    }

    this.isHidden = false;
    this.form.updateValueAndValidity();
  }

  selectPenalty(penalty) {
    this.selectedPenalties.push(penalty);
    this.onPenaltyChanged.emit();
  }

  selectFee(entryFee) {
    this.selectedFees.push(entryFee);
    this.onEntryFeeChanged.emit();
  }

  deletePenalty(penalty) {
    this.allPenalties.push(penalty);
    this.sortDataByName(this.allPenalties);
    this.onPenaltyChanged.emit();
  }

  deleteEntryFee(entryFee) {
    this.allEntryFees.push(entryFee);
    this.sortDataByName(this.allEntryFees);
    this.onEntryFeeChanged.emit();
  }

  compareData(selectedValues, all) {
    selectedValues.map(value => {
      all.map(val => {
        if ( value['id'] === val['id'] ) {
          all.splice(all.indexOf(val), 1);
        }
      });
    });
  }
}
