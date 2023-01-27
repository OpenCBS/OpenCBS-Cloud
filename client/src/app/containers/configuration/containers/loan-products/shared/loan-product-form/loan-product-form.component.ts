import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../core/core.reducer';
import * as fromStore from '../../../../../../core/store';
import { PenaltiesState } from '../../../../../../core/store';
import { EntryFeeListState } from '../../../../../../core/store/entry-fees';
import { ICurrencyList } from '../../../../../../core/store/currencies/currency-list';
import { environment } from '../../../../../../../environments/environment';
import { LoanProductExtraService } from '../service/loan-product-extra.service';
import { FieldConfig } from '../../../../../../shared/modules/cbs-form/models/field-config.interface';
import { Subscription } from 'rxjs';
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
  }
];
const EARLY_TOTAL_REPAYMENT_FEE_TYPE = [
  {
    value: 'OLB',
    name: 'OLB'
  },
  {
    value: 'AMOUNT_DUE',
    name: 'AMOUNT_DUE'
  }
];

@Component({
  selector: 'cbs-loan-product-form',
  templateUrl: 'loan-product-form.component.html',
  styleUrls: ['loan-product-form.component.scss']
})

export class LoanProductFormComponent implements OnInit, OnDestroy, AfterViewInit {
  public currencyConfig = {
    url: `${environment.API_ENDPOINT}currencies/lookup`
  };
  public scheduleTypeConfig = {
    url: `${environment.API_ENDPOINT}schedule-types/lookup`
  };
  public scheduleBasedTypeConfig = {
    url: `${environment.API_ENDPOINT}schedule-based-types/lookup`
  };
  public earlyPartialRepaymentFeeType = EARLY_PARTIAL_REPAYMENT_FEE_TYPE;
  public earlyTotalRepaymentFeeType = EARLY_TOTAL_REPAYMENT_FEE_TYPE;
  @Input() isCreateMode = false;
  @Output() onEntryFeeChanged = new EventEmitter();
  @Output() onPenaltyChanged = new EventEmitter();
  @Input() fields: any;

  public form: FormGroup;
  public isHidden = true;
  public selectedFees = [];
  public selectedPenalties = [];
  public allEntryFees = [];
  public allPenalties = [];
  public provisioning = [];
  public currencies = [];
  public accountList: any;
  public showTopUp = false;
  public topUpEmpty = false;
  public statusTypeData = STATUS_TYPE_DATA;
  public disableCheckboxPenalties = false;
  public disableCheckboxGroup = false;
  public disableCheckboxHasPayees = false;
  public disableCheckboxEntryFees = false;
  public byInstallment = true;
  public isOpenProvision = false;
  public lateDaysProvision: number;
  public ratePortfolioProvision: number;
  public rateInterestProvision: number;
  public ratePenaltyProvision: number;
  public currentInstance: string;

  public currenciesSub: Subscription;
  private entryFeesSub: Subscription;
  private penaltiesSub: Subscription;

  constructor(private fb: FormBuilder,
              private currencyListStore$: Store<ICurrencyList>,
              private loanProductExtraService: LoanProductExtraService,
              private store$: Store<fromRoot.State>,
              private penaltiesStore$: Store<PenaltiesState>,
              private entryFeeListStore$: Store<EntryFeeListState>,
              private commonService: CommonService) {
    this.entryFeesSub = this.store$.pipe(select(fromRoot.getEntryFeeListState))
      .subscribe((entryFeesState: EntryFeeListState) => {
        if ( entryFeesState.success && entryFeesState.loaded && entryFeesState.entryFees ) {
          entryFeesState.entryFees.map(entryFee => {
            this.allEntryFees.push(entryFee);
          });
          if ( this.allEntryFees.length ) {
            this.sortDataByName(this.allEntryFees);
            this.compareData(this.selectedFees, this.allEntryFees);
          }
        }
      });

    this.penaltiesSub = this.store$.pipe(select(fromRoot.getPenaltiesState))
      .subscribe((penaltiesState: PenaltiesState) => {
        if ( penaltiesState.success && penaltiesState.loaded && penaltiesState.penalties ) {
          penaltiesState.penalties.map(penalties => {
            this.allPenalties.push(penalties);
          });
          if ( this.allPenalties.length ) {
            this.sortDataByName(this.allPenalties);
            this.compareData(this.selectedPenalties, this.allPenalties);
          }
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
      statusType: new FormControl('ACTIVE'),
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
        if ( control.value[0]['person_profile'] || control.value[1]['company_profile'] || control.value[2]['group_profile'] ) {
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
    this.currencyListStore$.dispatch(new fromStore.LoadCurrencies());

    this.loanProductExtraService.getLoanProductAccounts().subscribe(data => {
      this.getAccounts(data);
    })
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

  checkboxGroup() {
    this.disableCheckboxGroup = !this.disableCheckboxGroup;
    if ( this.disableCheckboxGroup === true ) {
      this.form.controls.hasPayees.disable();
    } else {
      this.form.controls.hasPayees.enable();
    }
  }

  checkboxHasPayees() {
    this.disableCheckboxHasPayees = !this.disableCheckboxHasPayees;
    if ( this.disableCheckboxHasPayees || this.disableCheckboxEntryFees ) {
      this.form.controls['availability']['controls'][2].disable();
    } else {
      this.form.controls['availability']['controls'][2].enable();
    }
  }

  checkboxPenalties() {
    this.disableCheckboxPenalties = !this.disableCheckboxPenalties;
    if ( this.disableCheckboxPenalties || this.disableCheckboxHasPayees ) {
      this.form.controls['availability']['controls'][2].disable();
    } else {
      this.form.controls['availability']['controls'][2].enable();
    }
  }

  checkboxEntryFees() {
    this.disableCheckboxEntryFees = !this.disableCheckboxEntryFees;
    if ( this.disableCheckboxEntryFees || this.disableCheckboxHasPayees ) {
      this.form.controls['availability']['controls'][2].disable();
    } else {
      this.form.controls['availability']['controls'][2].enable();
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

  getAccounts(data) {
    const arr = [];
    data.map(item => {
      arr.push(
        {
          name: item,
          required: true,
          caption: item,
          fieldType: 'LOOKUP',
          extra: {
            url: `${environment.API_ENDPOINT}accounting/lookup?accountTypes=BALANCE,SUBGROUP`,
            code: true
          }
        })
    });

    this.generateLookupAccounts(arr);
  }

  generateLookupAccounts(fieldsArray) {
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

    this.fields = fieldsArray;
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
    this.provisioning.push({
      lateDays: this.lateDaysProvision,
      ratePrincipal: this.ratePortfolioProvision,
      rateInterest: this.rateInterestProvision,
      ratePenalty: this.ratePenaltyProvision
    });
    this.cancelModal();
  }

  deleteProvisioning(prov) {
    this.provisioning.filter(a => {
      if ( a['lateDays'] === prov.lateDays && a['ratePrincipal'] === prov.ratePrincipal
        && a['rateInterest'] === prov.rateInterest && a['ratePenalty'] === prov.ratePenalty ) {
        this.provisioning.splice(this.provisioning.indexOf(a), 1);
      }
    });
  }

  ngOnDestroy() {
    this.currencyListStore$.dispatch(new fromStore.ResetCurrencies());
    this.currenciesSub.unsubscribe();
    this.entryFeesSub.unsubscribe();
    this.penaltiesSub.unsubscribe();
    this.resetState();
  }

  resetState() {
    this.entryFeeListStore$.dispatch(new fromStore.EntryFeesListReset());
    this.penaltiesStore$.dispatch(new fromStore.PenaltiesReset());
  };

  load() {
    this.penaltiesStore$.dispatch(new fromStore.LoadPenalties());
    this.entryFeeListStore$.dispatch(new fromStore.LoadEntryFees());
  }

  populateFields(loan_product) {
    for (const key in loan_product) {
      if ( this.form.controls.hasOwnProperty(key) && loan_product.hasOwnProperty(key) ) {
        this.form.controls[key].setValue(loan_product[key], {emitEvent: false});
      }
      if ( key === 'currency' ) {
        this.form.controls['currencyId'].setValue(loan_product['currency']['id']);
      }
    }
    this.isHidden = false;
    this.form.updateValueAndValidity();
  }

  selectedPenalty(penalty) {
    this.selectedPenalties.push(penalty);
    this.onPenaltyChanged.emit();
  }

  deletePenalty(penalty) {
    this.allPenalties.push(penalty);
    this.sortDataByName(this.allPenalties);
    this.onPenaltyChanged.emit();
  }

  selectFee(entryFee) {
    this.selectedFees.push(entryFee);
    this.onEntryFeeChanged.emit();
  }

  deleteEntryFee(entryFee) {
    this.allEntryFees.push(entryFee);
    this.sortDataByName(this.allEntryFees);
    this.onEntryFeeChanged.emit();
  }

  compareData(selectedData, all) {
    selectedData.map(value => {
      all.map(val => {
        if ( value['id'] === val['id'] ) {
          all.splice(all.indexOf(val), 1);
        }
      });
    });
  }
}
