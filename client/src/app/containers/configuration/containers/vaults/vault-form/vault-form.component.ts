import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from '../../../../../core/services/accounts.service';
import { environment } from '../../../../../../environments/environment';
import * as fromStore from '../../../../../core/store';
import { ICurrencyList } from '../../../../../core/store';
import { FieldConfig } from '../../../../../shared/modules/cbs-form/models/field-config.interface';
import * as fromRoot from '../../../../../core/core.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cbs-vault-form',
  templateUrl: 'vault-form.component.html'
})

export class VaultFormComponent implements OnInit, OnDestroy, AfterViewInit {
  public form: FormGroup;
  public config = {
    url: `${environment.API_ENDPOINT}branches`
  };
  public isLoading = true;
  public accounts = [];
  public customFields = [];
  public cachedData;
  public data = [];
  public currencies: any;
  public formChanged = false;

  private accountsSub: Subscription;

  constructor(private currencyListStore$: Store<ICurrencyList>,
              private accountsService: AccountsService,
              private store$: Store<fromRoot.State>,
              private fb: FormBuilder) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      branchId: new FormControl('', Validators.required),
      accounts: new FormArray([])
    });
  }

  ngOnInit() {
    this.currencies = this.store$.pipe(select(fromRoot.getCurrencyListState))
    .subscribe((currency: ICurrencyList) => {
      if (currency.loaded && currency.success && !currency.error) {
        this.generateCustomFields(this.getCurrenciesName(currency.currencies, this.data));
      }
    });

    this.accountsSub = this.accountsService.getAccounts().subscribe(data => {
      if (data.content) {
        this.accounts = data.content;
      }
    });
  }

  loadCurrencies(data = null) {
    this.data = data;
    this.currencyListStore$.dispatch(new fromStore.LoadCurrencies());
  }

  ngAfterViewInit() {
    this.form.valueChanges.subscribe(formValue => {
      this.formChanged = this.compare(formValue);
    })
  }

  compare(formValue) {
    let status = false;
    for (const key in this.cachedData) {
      if (formValue.hasOwnProperty(key) && key !== 'accounts') {
        if (formValue[key] !== this.cachedData[key]) {
          status = true;
        }
      } else if (key === 'accounts') {
        if (this.cachedData[key].length !== formValue[key].length) {
          status = true;
        } else {
          formValue[key].map(accountItem => {
            this.cachedData[key].map(cachedAccountItem => {
              const accountItemKey = Object.keys(accountItem)[0],
                cachedAccountItemKey = Object.keys(cachedAccountItem)[0];
              if (accountItemKey === cachedAccountItemKey && accountItem[accountItemKey] !== cachedAccountItem[cachedAccountItemKey]) {
                status = true;
              }
            });
          });
        }
      }
    }
    return status
  }

  getCurrenciesName(currencies, till) {
    let arr = [];
    currencies.map(currency => {
      this.setValues(till);
      till.data.accounts.map(account => {
        if (account.currency.name === currency.name) {
          arr.push(
            {
              name: currency.name,
              required: true,
              caption: currency.name,
              value: {id: account['id']},
              fieldType: 'LOOKUP',
              extra: {
                url: `${environment.API_ENDPOINT}accounting/lookup`,
                code: true,
                defaultQuery: account.number
              }
            });
          const obj = {};
          obj[currency.name] = account.id;
          this.cachedData.accounts.push(obj)
        }
      });
    });
    return arr;
  };

  generateCustomFields(fieldsArray) {
    const fields = <FormArray>this.form.controls['accounts'];
    if (fields.length) {
      fields.value.map(field => {
        fields.removeAt(fields.controls.indexOf(field));
      });
    }

    fieldsArray.map(item => {
      const group = this.fb.group({});
      group.addControl(item.name, this.createControl(item));
      fields.push(group);
    });

    this.customFields = fieldsArray;
    this.isLoading = false;
  }

  setValues(till) {
    this.form.controls['name'].setValue(till.data.name);
    this.form.controls['branchId'].setValue(till.data.branch.id);
    this.cachedData = this.form.value;
  }

  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if (required) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }

  resetState() {
    this.currencyListStore$.dispatch(new fromStore.ResetCurrencies());
  }

  ngOnDestroy() {
    this.currencies.unsubscribe();
    this.accountsSub.unsubscribe();
  }
}
