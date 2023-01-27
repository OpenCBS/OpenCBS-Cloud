import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';
import { BorrowingProductExtraService } from '../service/borrowing-product-extra.service';
import { FieldConfig } from '../../../../../../shared/modules/cbs-form/models/field-config.interface';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

const SCHEDULE_TYPE_CONFIG = {scheduleTypeUrl: 'schedule-types'};
const CURRENCY_CONFIG = {url: `${environment.API_ENDPOINT}currencies/lookup`};

@Component({
  selector: 'cbs-borrowing-product-form',
  templateUrl: './borrowing-product-form.component.html',
  styleUrls: ['./borrowing-product-form.component.scss']
})

export class BorrowingProductFormComponent implements OnInit, AfterViewInit {
  public form: FormGroup;
  public isHidden = true;
  public scheduleTypes = [];
  public fields: any;
  @Input() isCreateMode = false;
  public scheduleTypeConfig = SCHEDULE_TYPE_CONFIG;
  public currencyConfig = CURRENCY_CONFIG;

  constructor(private httpClient: HttpClient,
              private liabilityProductExtraService: BorrowingProductExtraService,
              private fb: FormBuilder,
              private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      code: new FormControl('', Validators.required),
      currencyId: new FormControl('', Validators.required),
      scheduleType: new FormControl('', Validators.required),
      interestRateMin: new FormControl('', Validators.required),
      interestRateMax: new FormControl('', Validators.required),
      amountMin: new FormControl('', Validators.required),
      amountMax: new FormControl('', Validators.required),
      maturityMin: new FormControl('', Validators.required),
      maturityMax: new FormControl('', Validators.required),
      gracePeriodMin: new FormControl('', Validators.required),
      gracePeriodMax: new FormControl('', Validators.required),
      accountList: this.fb.array([], Validators.required)
    });

    this.getScheduleType(this.scheduleTypeConfig.scheduleTypeUrl).subscribe(
      res => {
        this.scheduleTypes = res;
      },
      err => {
        this.toastrService.error(err.error.message, '', environment.ERROR_TOAST_CONFIG);
      });
    this.liabilityProductExtraService.getBorrowingProductAccounts()
      .subscribe(data => {
        this.getAccounts(data);
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

  ngAfterViewInit() {
    if ( this.isCreateMode ) {
      this.isHidden = false;
    }
  }

  private getScheduleType(url) {
    return this.httpClient.get<any[]>(environment.API_ENDPOINT + url);
  }

  populateFields(loan_product) {
    // tslint:disable-next-line:forin
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
}
