import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { environment } from '../../../../../../environments/environment';
import * as fromStore from '../../../../../core/store';
import { ICreateTill, ICurrencyList, TillCreateActions } from '../../../../../core/store';
import { AccountsService } from '../../../../../core/services/accounts.service';
import { FieldConfig } from '../../../../../shared/modules/cbs-form/models/field-config.interface';
import * as fromRoot from '../../../../../core/core.reducer';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cbs-till-create',
  templateUrl: 'till-create.component.html'
})

export class TillCreateComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public config = {
    url: `${environment.API_ENDPOINT}branches/lookup?&sort=id,asc`
  };
  public accounts = [];
  public customFields = [];
  public isLoading = true;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'TELLER_MANAGEMENT',
      link: '/configuration/tills'
    },
    {
      name: 'CREATE',
      link: ''
    }
  ];
  public svgData = {
    collection: 'standard',
    class: 'client',
    name: 'client'
  };

  private currenciesSub: Subscription;
  private tillCreateSub: Subscription;

  constructor(private router: Router,
              private tillCreateStore$: Store<ICreateTill>,
              private tillCreateActions: TillCreateActions,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private accountsService: AccountsService,
              private currencyListStore$: Store<ICurrencyList>,
              private translate: TranslateService,
              private fb: FormBuilder) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      branchId: new FormControl('', Validators.required),
      accounts: new FormArray([])
    });
  }

  ngOnInit() {
    this.tillCreateSub = this.store$.select(fromRoot.getTillCreateState)
    .subscribe((tillCreate: ICreateTill) => {
      if (tillCreate.loaded && tillCreate.success && !tillCreate.error) {
        this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
          this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.resetState();
        this.goToTillInfo(tillCreate.data['id']);
      } else if (tillCreate.loaded && !tillCreate.success && tillCreate.error) {
        this.translate.get('CREATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(tillCreate.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.resetState();
      }
    });

    this.currenciesSub = this.store$.select(fromRoot.getCurrencyListState)
    .subscribe((currency: ICurrencyList) => {
      if (currency.loaded && currency.success && !currency.error) {
        this.getCurrenciesName(currency.currencies);
      }
    });
    this.accountsService.getAccounts().subscribe(data => {
      if (data.content) {
        this.accounts = data.content;
      }
    });

    this.currencyListStore$.dispatch(new fromStore.LoadCurrencies());
  }

  getCurrenciesName(currencies) {
    const arr = [];
    currencies.map(currency => {
      arr.push(
        {
          name: currency.name,
          required: true,
          caption: currency.name,
          fieldType: 'LOOKUP',
          extra: {
            url: `${environment.API_ENDPOINT}accounting/lookup?currencyId=${currency.id}`,
            code: true
          }
        })
    });

    this.generateCustomFields(arr);
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
  }


  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if (required) {
      validationOptions.push(Validators.required);
    }
    this.isLoading = false;
    return this.fb.control({disabled, value}, validationOptions);
  }

  goToViewTills() {
    this.router.navigate(['configuration', 'tills'])
  }

  goToTillInfo(id) {
    this.router.navigate(['configuration', 'tills', id])
  }

  resetState() {
    this.tillCreateStore$.dispatch(this.tillCreateActions.fireResetAction());
    this.currencyListStore$.dispatch(new fromStore.ResetCurrencies());
  }

  submit() {
    this.form.value['accounts'] = this.form.value['accounts']
    .map(currency => currency[Object.keys(currency)[0]]);
    this.tillCreateStore$.dispatch(this.tillCreateActions.fireInitialAction(this.form.value));
  }

  ngOnDestroy() {
    this.resetState();
    this.tillCreateSub.unsubscribe();
  }
}
