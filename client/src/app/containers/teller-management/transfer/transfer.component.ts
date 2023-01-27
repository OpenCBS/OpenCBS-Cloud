import { of as observableOf } from 'rxjs';

import { catchError } from 'rxjs/operators';
import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import { FieldConfig } from '../../../shared/modules/cbs-form/models/field-config.interface';
import { IVaultInfo } from '../../../core/store/vaults/vault-info/vault-info.reducer';
import { VaultInfoActions } from '../../../core/store/vaults/vault-info/vault-info.actions';
import { TillInfoService } from '../../../core/store/tills/till-info/till-info.service';
import { ITillList } from '../../../core/store/tills/till-list/till-list.reducer';
import { TillListActions } from '../../../core/store/tills/till-list/till-list.actions';


@Component({
  selector: 'cbs-till-transfer',
  templateUrl: 'transfer.component.html',
  styleUrls: ['transfer.component.scss']
})

export class TransferComponent implements OnInit, AfterViewInit, OnDestroy {
  public config = {
    url: `${environment.API_ENDPOINT}vaults`
  };
  public tillId: number;
  public form: FormGroup;
  public breadcrumbLinks = [];
  public isTransferToVault: boolean;
  public accountFields = [];
  public svgData = {
    collection: 'standard',
    class: 'groups',
    name: 'groups'
  };
  private routerSub: any;
  private vaultValueSub: any;
  private vaultSub: any;
  private tillAccounts: any;
  private tillsSub: any;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private store$: Store<fromRoot.State>,
    private vaultInfoStore$: Store<IVaultInfo>,
    private vaultInfoActions: VaultInfoActions,
    private tillService: TillInfoService,
    private router: Router,
    private translate: TranslateService,
    private toastrService: ToastrService,
    private tillListStore$: Store<ITillList>,
    private tillListAction: TillListActions,
  ) {
  }

  ngOnInit() {
    this.routerSub = this.route.params.subscribe(params => {
      this.isTransferToVault = params['type'] === 'to-vault';
      this.tillId = params['id'];
      this.breadcrumbLinks = [
        {
          name: 'TILL',
          link: '/till'
        },
        {
          name: this.tillId,
          link: ''
        },
        {
          name: this.isTransferToVault ? 'TRANSFER_TO_VAULT' : 'TRANSFER_FROM_VAULT',
          link: ''
        }
      ];

      this.form = new FormGroup({
        tillId: new FormControl(this.tillId, Validators.required),
        vaultId: new FormControl('', Validators.required),
        transactions: new FormArray([]),
        description: new FormControl('')
      });
    });

    let loadTillsCalled = false;
    this.tillsSub = this.store$.select(fromRoot.getTillListState).subscribe(
      (tills: ITillList) => {
        if ( tills.loaded && tills.success && !tills.error ) {
          if ( tills.data.content && tills.data.content.length ) {
            tills.data.content.map(item => {
              if ( item.id === +this.tillId ) {
                this.tillAccounts = item.accounts;
              }
            });
          }
        } else if ( !loadTillsCalled ) {
          this.tillListStore$.dispatch(this.tillListAction.fireInitialAction());
        }
        loadTillsCalled = true;
      }
    );

    this.vaultSub = this.store$.select(fromRoot.getVaultInfoState).subscribe((vault: IVaultInfo) => {
      if ( vault.loaded && vault.success ) {
        if ( vault.data.accounts && vault.data.accounts.length ) {
          this.accountFields = [];
          vault.data.accounts.map(item => {
            this.accountFields.push({
              name: `currencyId-${item.currency.id}`,
              caption: item.currency.name,
              fieldType: 'NUMERIC',
              required: true,
              value: 0,
              disabled: !this.tillAccounts.some(cur => cur.currency.id === item.currency.id)
            });
          });
          this.generateCustomFields(this.accountFields);
        } else {
          console.warn('No accounts provided in current vault.');
        }
      }
    });
  }

  ngAfterViewInit() {
    this.vaultValueSub = this.form.controls['vaultId'].valueChanges.subscribe(vaultId => {
      this.clearForm();
      if ( vaultId ) {
        this.vaultInfoStore$.dispatch(this.vaultInfoActions.fireInitialAction(vaultId));
      }
    });
  }

  submit({value, valid}) {
    if ( valid ) {
      const data = {
        tillId: value.tillId,
        vaultId: value.vaultId,
        description: value.description,
        transactions: []
      };
      value.transactions.map(item => {
        const name = Object.keys(item)[0];
        data.transactions.push({
          currencyId: name.split('-')[1],
          amount: item[name]
        });
      });
      this.tillService.transferToVault(data, this.isTransferToVault).pipe(
        catchError(err => observableOf(err)))
        .subscribe(res => {
          if ( res.status === 200 ) {
            this.translate.get('TRANSFER_SUCCESS').subscribe((translation: string) => {
              this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.goToTills();
          } else {
            const err = res.error;
            this.toastrService.error(null, err.message, environment.ERROR_TOAST_CONFIG);
          }
        });
    } else {
      console.warn('Form invalid.');
    }
  }

  generateCustomFields(fieldsArray) {
    const fields = <FormArray>this.form.controls['transactions'];
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

    this.accountFields = fieldsArray;
    this.vaultInfoStore$.dispatch(this.vaultInfoActions.fireResetAction());
  }


  clearForm() {
    const fields = <FormArray>this.form.controls['transactions'];
    if ( fields.length ) {
      fields.value.map(field => {
        fields.removeAt(fields.controls.indexOf(field));
      });
    }
    this.accountFields = [];
  }

  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if ( required ) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }

  goToTills() {
    this.router.navigate(['till']);
  }


  ngOnDestroy() {
    this.routerSub.unsubscribe();
    this.vaultSub.unsubscribe();
    this.tillsSub.unsubscribe();
    this.vaultValueSub.unsubscribe();
    this.clearForm();
    this.form.reset();
    this.vaultInfoStore$.dispatch(this.vaultInfoActions.fireResetAction());
  }
}
