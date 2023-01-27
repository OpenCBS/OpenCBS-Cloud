import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ICurrencyList } from '../../../../../../core/store/currencies/currency-list';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../../../../core/core.reducer';
import * as fromStore from '../../../../../../core/store';
import { environment } from '../../../../../../../environments/environment';
import { CommonService } from '../../../../../../core/services';

@Component({
  selector: 'cbs-saving-product-form',
  templateUrl: './saving-product-form.component.html',
  styleUrls: ['./saving-product-form.component.scss']
})
export class SavingProductFormComponent implements OnInit {
  public sharedConfig = {
    url: `${environment.API_ENDPOINT}accounting/lookup?accountTypes=BALANCE,SUBGROUP`
  };
  public interestExpenseConfig: any = {...this.sharedConfig};
  public savingConfig: any = {...this.sharedConfig};
  public interestConfig: any = {...this.sharedConfig};
  public depositFeeConfig: any = {...this.sharedConfig};
  public depositFeeIncomeConfig: any = {...this.sharedConfig};
  public withdrawalFeeConfig: any = {...this.sharedConfig};
  public withdrawalFeeIncomeConfig: any = {...this.sharedConfig};
  public managementFeeConfig: any = {...this.sharedConfig};
  public managementFeeIncomeConfig: any = {...this.sharedConfig};
  public entryFeeConfig: any = {...this.sharedConfig};
  public entryFeeIncomeConfig: any = {...this.sharedConfig};
  public closeFeeConfig: any = {...this.sharedConfig};
  public closeFeeIncomeConfig: any = {...this.sharedConfig};
  public currencyConfig = {
    url: `${environment.API_ENDPOINT}currencies/lookup?&sort=id,asc`,
    defaultQuery: ''
  };

  public statusTypeData = [
    {
      value: 'ACTIVE',
      name: 'ACTIVE'
    },
    {
      value: 'INACTIVE',
      name: 'INACTIVE'
    },
  ];

  public frequency = [
    {
      value: 'DAILY',
      name: 'DAILY'
    },
    {
      value: 'MONTHLY',
      name: 'MONTHLY'
    },
    {
      value: 'END_OF_MONTH',
      name: 'END_OF_MONTH'
    },
    {
      value: 'YEARLY',
      name: 'YEARLY'
    }
  ];

  @Input() isCreateMode = false;
  public form: FormGroup;
  public currencies = [];
  public currenciesSub: any;
  public currentInstance: string;

  constructor(private fb: FormBuilder,
              private store$: Store<fromRoot.State>,
              private currencyListStore$: Store<ICurrencyList>,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.currentInstance = this.commonService.getData();
    this.form = new FormGroup({
      statusType: new FormControl('ACTIVE'),
      name: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      availability: this.fb.array([
        this.fb.group({
          person_profile: ['']
        }),
        this.fb.group({
          company_profile: ['']
        })
      ], (control) => {
        if ( control.value[0]['person_profile'] || control.value[1]['company_profile'] ) {
          return null;
        } else {
          return {
            atLeastOne: true
          };
        }
      }),
      currencyId: new FormControl('', Validators.required),
      minBalance: new FormControl(0),
      initialAmountMin: new FormControl('', Validators.required),
      initialAmountMax: new FormControl('', Validators.required),
      savingAccount: new FormControl('', Validators.required),
      interestAccount: new FormControl('', Validators.required),
      interestRateMin: new FormControl('', Validators.required),
      interestRateMax: new FormControl('', Validators.required),
      interestAccrualFrequency: new FormControl('DAILY', Validators.required),
      postingFrequency: new FormControl('END_OF_MONTH', Validators.required),
      capitalized: new FormControl(''),
      interestExpenseAccount: new FormControl('', Validators.required),

      depositAmountMin: new FormControl('', Validators.required),
      depositAmountMax: new FormControl('', Validators.required),
      depositFeeRateMin: new FormControl('', Validators.required),
      depositFeeRateMax: new FormControl('', Validators.required),
      depositFeeFlatMin: new FormControl('', Validators.required),
      depositFeeFlatMax: new FormControl('', Validators.required),
      depositFeeAccount: new FormControl('', Validators.required),
      depositFeeIncomeAccount: new FormControl('', Validators.required),

      withdrawalAmountMin: new FormControl('', Validators.required),
      withdrawalAmountMax: new FormControl('', Validators.required),
      withdrawalFeeRateMin: new FormControl('', Validators.required),
      withdrawalFeeRateMax: new FormControl('', Validators.required),
      withdrawalFeeFlatMin: new FormControl('', Validators.required),
      withdrawalFeeFlatMax: new FormControl('', Validators.required),
      withdrawalFeeAccount: new FormControl('', Validators.required),
      withdrawalFeeIncomeAccount: new FormControl('', Validators.required),

      managementFeeRateMin: new FormControl('', Validators.required),
      managementFeeRateMax: new FormControl('', Validators.required),
      managementFeeFlatMin: new FormControl('', Validators.required),
      managementFeeFlatMax: new FormControl('', Validators.required),
      managementFeeFrequency: new FormControl('END_OF_MONTH', Validators.required),
      managementFeeAccount: new FormControl('', Validators.required),
      managementFeeIncomeAccount: new FormControl('', Validators.required),

      entryFeeRateMin: new FormControl('', Validators.required),
      entryFeeRateMax: new FormControl('', Validators.required),
      entryFeeFlatMin: new FormControl('', Validators.required),
      entryFeeFlatMax: new FormControl('', Validators.required),
      entryFeeAccount: new FormControl('', Validators.required),
      entryFeeIncomeAccount: new FormControl('', Validators.required),

      closeFeeRateMin: new FormControl('', Validators.required),
      closeFeeRateMax: new FormControl('', Validators.required),
      closeFeeFlatMin: new FormControl('', Validators.required),
      closeFeeFlatMax: new FormControl('', Validators.required),
      closeFeeAccount: new FormControl('', Validators.required),
      closeFeeIncomeAccount: new FormControl('', Validators.required)
    });

    this.currencyListStore$.dispatch(new fromStore.LoadCurrencies());

    this.currenciesSub = this.store$.select(fromRoot.getCurrencyListState).subscribe(
      (currencyList: ICurrencyList) => {
        if ( currencyList.success && currencyList.loaded && currencyList.currencies ) {
          this.currencies = currencyList.currencies;
        }
      });
  }

  configsForAccounts(savingProduct) {
    this.interestExpenseConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['INTEREST_EXPENSE']['number']
    };

    this.savingConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['SAVING']['number']
    };

    this.interestConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['INTEREST']['number']
    };

    this.depositFeeConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['DEPOSIT_FEE']['number']
    };

    this.depositFeeIncomeConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['DEPOSIT_FEE_INCOME']['number']
    };

    this.withdrawalFeeConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['WITHDRAWAL_FEE']['number']
    };

    this.withdrawalFeeIncomeConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['WITHDRAWAL_FEE_INCOME']['number']
    };

    this.managementFeeConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['MANAGEMENT_FEE']['number']
    };

    this.managementFeeIncomeConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['MANAGEMENT_FEE_INCOME']['number']
    };

    this.entryFeeConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['ENTRY_FEE']['number']
    };

    this.entryFeeIncomeConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['ENTRY_FEE_INCOME']['number']
    };

    this.entryFeeIncomeConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['ENTRY_FEE_INCOME']['number']
    };

    this.closeFeeConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['CLOSE_FEE']['number']
    };

    this.closeFeeIncomeConfig = {
      ...this.sharedConfig,
      defaultQuery: savingProduct['accounts']['CLOSE_FEE_INCOME']['number']
    };

    this.currencyConfig = {
      ...this.currencyConfig,
      defaultQuery: savingProduct['currency']['name']
    };
  }

  populate(savingProduct) {
    if ( this.form ) {
      for (const key in savingProduct) {
        if ( this.form.controls.hasOwnProperty(key) && savingProduct.hasOwnProperty(key) ) {
          this.form.controls[key].setValue(savingProduct[key], {emitEvent: false})
        }
        if ( key === 'currency' ) {
          this.form.controls['currencyId'].setValue(savingProduct['currency']['id']);
        }
      }
      this.form.controls['interestExpenseAccount'].setValue(savingProduct['accounts']['INTEREST_EXPENSE']['id']);
      this.form.controls['savingAccount'].setValue(savingProduct['accounts']['SAVING']['id']);
      this.form.controls['interestAccount'].setValue(savingProduct['accounts']['INTEREST']['id']);
      this.form.controls['depositFeeAccount'].setValue(savingProduct['accounts']['DEPOSIT_FEE']['id']);
      this.form.controls['depositFeeIncomeAccount'].setValue(savingProduct['accounts']['DEPOSIT_FEE_INCOME']['id']);
      this.form.controls['withdrawalFeeAccount'].setValue(savingProduct['accounts']['WITHDRAWAL_FEE']['id']);
      this.form.controls['withdrawalFeeIncomeAccount'].setValue(savingProduct['accounts']['WITHDRAWAL_FEE_INCOME']['id']);
      this.form.controls['managementFeeAccount'].setValue(savingProduct['accounts']['MANAGEMENT_FEE']['id']);
      this.form.controls['managementFeeIncomeAccount'].setValue(savingProduct['accounts']['MANAGEMENT_FEE_INCOME']['id']);
      this.form.controls['entryFeeAccount'].setValue(savingProduct['accounts']['ENTRY_FEE']['id']);
      this.form.controls['entryFeeIncomeAccount'].setValue(savingProduct['accounts']['ENTRY_FEE_INCOME']['id']);
      this.form.controls['closeFeeAccount'].setValue(savingProduct['accounts']['CLOSE_FEE']['id']);
      this.form.controls['closeFeeIncomeAccount'].setValue(savingProduct['accounts']['CLOSE_FEE_INCOME']['id']);
    }
  }
}
