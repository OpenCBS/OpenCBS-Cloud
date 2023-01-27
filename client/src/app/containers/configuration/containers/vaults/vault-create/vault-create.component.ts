import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../../../../environments/environment';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { ICreateVault, ICurrencyList, VaultCreateActions } from '../../../../../core/store';
import { AccountsService } from '../../../../../core/services/accounts.service';
import { FieldConfig } from '../../../../../shared/modules/cbs-form/models/field-config.interface';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'custom', class: 'custom17', name: 'custom17'};
const branchConfig = {url: `${environment.API_ENDPOINT}branches`};

@Component({
  selector: 'cbs-vault-create',
  templateUrl: 'vault-create.component.html'
})

export class VaultCreateComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public config = branchConfig;
  public isLoading = true;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'VAULTS',
      link: '/configuration/vaults'
    },
    {
      name: 'CREATE',
      link: ''
    }
  ];
  public form: FormGroup;
  public accounts = [];
  public customFields = [];

  private vaultCreateSub: Subscription;
  private currenciesSub: Subscription;
  private accountsSub: Subscription;

  constructor(private currencyListStore$: Store<ICurrencyList>,
              private fb: FormBuilder,
              private vaultCreateStore$: Store<ICreateVault>,
              private vaultCreateActions: VaultCreateActions,
              private toastrService: ToastrService,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService,
              private router: Router,
              private accountsService: AccountsService) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      branchId: new FormControl('', Validators.required),
      accounts: new FormArray([], (formArray) => {
        const hasAtLeastOne = formArray.value.some(obj => obj[_.keys(obj)[0]]);
        return hasAtLeastOne ? null : {
          atLeastOne: true
        };
      })
    });
  }

  ngOnInit() {
    this.vaultCreateSub = this.store$.pipe(select(fromRoot.getVaultCreateState))
      .subscribe((vaultCreate: ICreateVault) => {
        if ( vaultCreate.loaded && vaultCreate.success && !vaultCreate.error ) {
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.goToVaultInfo(vaultCreate.data['id']);
        } else if ( vaultCreate.loaded && !vaultCreate.success && vaultCreate.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(vaultCreate.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
        }
      });

    this.currenciesSub = this.store$.pipe(select(fromRoot.getCurrencyListState))
      .subscribe((currency: ICurrencyList) => {
        if ( currency.loaded && currency.success && !currency.error ) {
          this.getCurrenciesName(currency.currencies);
        }
      });

    this.accountsSub = this.accountsService.getAccounts().subscribe(data => {
      if ( data.content ) {
        this.accounts = data.content;
      }
    });

    this.currencyListStore$.dispatch(new fromStore.LoadCurrencies());
  }

  getCurrenciesName(currencies) {
    const arr = [];
    currencies.map(currency => {
      arr.push({
        name: currency.name,
        required: false,
        caption: currency.name,
        fieldType: 'LOOKUP',
        extra: {
          url: `${environment.API_ENDPOINT}accounting/lookup?currencyId=${currency.id}`,
          code: true
        }
      });
    });

    this.generateCustomFields(arr);
  };

  generateCustomFields(fieldsArray) {
    const fields = <FormArray>this.form.controls['accounts'];
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

    this.customFields = fieldsArray;
  }


  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if ( required ) {
      validationOptions.push(Validators.required);
    }
    this.isLoading = false;
    return this.fb.control({disabled, value}, validationOptions);
  }

  goToVaultInfo(id) {
    this.router.navigate(['configuration', 'vaults', id])
  }

  goToViewVaults() {
    this.router.navigate(['configuration', 'vaults'])
  }

  resetState() {
    this.currencyListStore$.dispatch(new fromStore.ResetCurrencies());
    this.vaultCreateStore$.dispatch(this.vaultCreateActions.fireResetAction())
  }

  submit() {
    const accountsValue = this.form.value.accounts
      .filter(currency => currency[_.keys(currency)[0]])
      .map(currency => currency[_.keys(currency)[0]]);
    const newVault = _.assign({}, this.form.value, {
      accounts: accountsValue
    });
    this.vaultCreateStore$.dispatch(this.vaultCreateActions.fireInitialAction(newVault));
  }

  ngOnDestroy() {
    this.resetState();
    this.vaultCreateSub.unsubscribe();
  }
}
