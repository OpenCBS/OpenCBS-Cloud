import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from '../../../../../../../environments/environment';
import { FieldConfig } from '../../../../../../shared/modules/cbs-form/models/field-config.interface';
import * as fromRoot from '../../../../../../core/core.reducer';
import { IBorrowingProductInfo } from '../../../../../../core/store/borrowing-products/borrowing-product-info';
import { Store } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

const CURRENCY_CONFIG = {url: `${environment.API_ENDPOINT}currencies/lookup?&sort=id,asc`, defaultQuery: ''};
const SCHEDULE_TYPE_CONFIG = {scheduleTypeUrl: 'schedule-types'};

@Component({
  selector: 'cbs-edit-borrowing-product-form',
  templateUrl: './edit-borrowing-product-form.component.html',
  styleUrls: ['./edit-borrowing-product-form.component.scss']
})

export class EditBorrowingProductFormComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() isCreateMode = false;
  public form: FormGroup;
  public isHidden = true;
  public scheduleTypes = [];
  public productAccounts: any;
  public borrowingProductSub: any;
  public config = SCHEDULE_TYPE_CONFIG;
  public currencyConfig = CURRENCY_CONFIG;

  constructor(private httpClient: HttpClient,
              private store$: Store<fromRoot.State>,
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

    this.getScheduleType(this.config.scheduleTypeUrl).subscribe(
      res => {
        this.scheduleTypes = res;
      },
      err => {
        this.toastrService.error(err.error.message, '', environment.ERROR_TOAST_CONFIG);
      });

    this.borrowingProductSub = this.store$.select(fromRoot.getBorrowingProductInfoState).subscribe(
      (borrowingProductState: IBorrowingProductInfo) => {
        if ( borrowingProductState.success && borrowingProductState.loaded && !borrowingProductState.error ) {
          this.generateAccounts(this.getLoanProductAccounts(borrowingProductState.data['accounts']));
        }
      })
  }

  getLoanProductAccounts(accounts) {
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

  ngOnDestroy() {
    this.borrowingProductSub.unsubscribe();
  }
}
