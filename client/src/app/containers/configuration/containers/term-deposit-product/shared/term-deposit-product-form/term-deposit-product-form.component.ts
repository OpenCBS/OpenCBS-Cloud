import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';
import { TermDepositProductExtraService } from '../service/term-deposit-product-extra.service';
import { FieldConfig } from '../../../../../../shared/modules/cbs-form/models/field-config.interface';
import { CommonService } from '../../../../../../core/services';

@Component({
  selector: 'cbs-term-deposit-product-form',
  templateUrl: './term-deposit-product-form.component.html',
  styleUrls: ['./term-deposit-product-form.component.scss']
})

export class TermDepositProductFormComponent implements OnInit, AfterViewInit {
  @Input() isCreateMode = false;
  public form: FormGroup;
  public isHidden = true;
  public fields: any;
  public currentInstance: string;
  public accountUrl = `${environment.API_ENDPOINT}accounting/lookup?accountTypes=BALANCE,SUBGROUP`;

  public currencyConfig = {
    url: `${environment.API_ENDPOINT}currencies/lookup`
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

  private isNewProduct = true;

  constructor(private termDepositProductExtraService: TermDepositProductExtraService,
              private fb: FormBuilder,
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
      amountMin: new FormControl('', Validators.required),
      amountMax: new FormControl('', Validators.required),
      termAgreementMin: new FormControl('', Validators.required),
      termAgreementMax: new FormControl('', Validators.required),
      interestRateMin: new FormControl('', Validators.required),
      interestRateMax: new FormControl('', Validators.required),
      earlyCloseFeeRateMin: new FormControl('', Validators.required),
      earlyCloseFeeRateMax: new FormControl('', Validators.required),
      earlyCloseFeeFlatMin: new FormControl('', Validators.required),
      earlyCloseFeeFlatMax: new FormControl('', Validators.required),
      interestAccrualFrequency: new FormControl('END_OF_MONTH', Validators.required),
      accountList: this.fb.array([], Validators.required)
    });

    this.termDepositProductExtraService.getTermDepositProductAccounts().subscribe(data => {
      this.getAccounts(data);
    });
  }

  hasError(controlName: string) {
    return this.form.get(controlName).errors && this.form.get(controlName).touched;
  }

  isValid(controlName: string) {
    return this.form.get(controlName).invalid && this.form.get(controlName).touched
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
            url: this.accountUrl,
            code: true
          }
        });
    });

    if ( this.isNewProduct ) {
      this.generateLookupAccounts(arr);
    }
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

  getTermDepositProductAccounts(accounts) {
    const arr = [];
    accounts.map(account => {
      arr.push(
        {
          name: account.accountRuleType,
          required: true,
          caption: account.accountRuleType,
          value: {id: account.accountDto['id']},
          fieldType: 'LOOKUP',
          extra: {
            url: `${environment.API_ENDPOINT}accounting/lookup?accountTypes=BALANCE,SUBGROUP`,
            code: true,
            defaultQuery: account.accountDto.number
          }
        });
    });
    return arr;
  }

  createControl(config: FieldConfig) {
    const {disabled, validation, value, required} = config;
    const validationOptions = validation || [];
    if ( required ) {
      validationOptions.push(Validators.required);
    }
    return this.fb.control({disabled, value}, validationOptions);
  }

  ngAfterViewInit() {
    if ( this.isCreateMode ) {
      this.isHidden = false;
    }
  }

  populateFields(termDepositProduct) {
    for (const key in termDepositProduct) {
      if ( this.form.controls.hasOwnProperty(key) && termDepositProduct.hasOwnProperty(key) ) {
        this.form.controls[key].setValue(termDepositProduct[key], {emitEvent: false});
      }
      if ( key === 'currency' ) {
        this.form.controls['currencyId'].setValue(termDepositProduct['currency']['id']);
      }
    }
    this.generateLookupAccounts(this.getTermDepositProductAccounts(termDepositProduct['accounts']));
    this.isHidden = false;
    this.isNewProduct = false;
    this.form.updateValueAndValidity();
  }
}
