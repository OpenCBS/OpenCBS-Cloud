import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountsService } from '../../../../../core/services/accounts.service';
import { environment } from '../../../../../../environments/environment';
import { FieldConfig } from '../../../../../shared/modules/cbs-form/models/field-config.interface';
import * as fromRoot from '../../../../../core/core.reducer';
import { TransactionTemplatesInfoState } from '../../../../../core/store';
import { Subscription } from 'rxjs/Rx';

@Component({
  selector: 'cbs-transaction-templates-form',
  templateUrl: 'transaction-templates-form.component.html'
})

export class TransactionTemplatesFormComponent implements OnInit, OnDestroy, AfterViewInit {
  public form: FormGroup;
  public isLoading = true;
  public transactionTemplateDebitAccounts = [];
  public transactionTemplateCreditAccounts = [];
  public customFields = [];
  public formChanged = false;

  private cachedData;
  private transactionTemplatesInfoSub: Subscription;

  constructor(private accountsService: AccountsService,
              private store$: Store<fromRoot.State>,
              private fb: FormBuilder) {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      debitAccounts: this.fb.array([], Validators.required),
      creditAccounts: this.fb.array([], Validators.required)
    });
  }

  ngOnInit() {
    this.transactionTemplatesInfoSub = this.store$.pipe(select(fromRoot.getTransactionTemplatesInfoState))
      .subscribe((info: TransactionTemplatesInfoState) => {
        if (info.loaded && info.success && !info.error) {
          this.setValues(info);
          this.generateDebitAccounts(this.getTransactionTemplateAccounts(info.transactionTemplatesInfo['debitAccounts']));
          this.generateCreditAccounts(this.getTransactionTemplateAccounts(info.transactionTemplatesInfo['creditAccounts']));
        }
      });
  }

  ngAfterViewInit() {
    this.form.valueChanges.subscribe(formValue => {
      this.formChanged = this.compare(formValue);
    })
  }

  compare(formValue) {
    let status = false;
    for (const key in this.cachedData) {
      if (formValue.hasOwnProperty(key) && key !== 'debitAccounts' && key !== 'creditAccounts') {
        if (formValue[key] !== this.cachedData[key]) {
          status = true;
        }
      } else if (key === 'debitAccounts' || key === 'creditAccounts') {
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

  getTransactionTemplateAccounts(accounts) {
    const arr = [];
    accounts.map(account => {
      this.cachedData = this.form.value;
      arr.push(
        {
          name: account.name,
          required: true,
          isTemplateDebit: account.isTemplateDebit,
          caption: account.name,
          value: {id: account['id']},
          fieldType: 'LOOKUP',
          extra: {
            url: `${environment.API_ENDPOINT}accounting/lookup?accountTypes=BALANCE`,
            code: true,
            defaultQuery: account.number
          }
        });
    });
    return arr;
  };

  generateDebitAccounts(fieldsArray) {
    const fields = <FormArray>this.form.controls['debitAccounts'];
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

    this.transactionTemplateDebitAccounts = fieldsArray;
    this.isLoading = false;
  }

  generateCreditAccounts(fieldsArray) {
    const fields = <FormArray>this.form.controls['creditAccounts'];
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

    this.transactionTemplateCreditAccounts = fieldsArray;
    this.isLoading = false;
  }

  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if (required) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }

  setValues(value) {
    this.form.controls['name'].setValue(value['transactionTemplatesInfo']['name']);
    this.cachedData = this.form.value;
  }

  ngOnDestroy() {
    this.transactionTemplatesInfoSub.unsubscribe();
  }
}
