import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { range } from '../shared/components/saving-details-form/saving-details-form-validators';
import * as moment from 'moment';
import { SavingProductService } from '../../../core/store/saving-products/saving-product';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

@Component({
  selector: 'cbs-saving-new',
  templateUrl: './saving-new.component.html',
  styleUrls: ['./saving-new.component.scss']
})

export class SavingNewComponent implements OnInit {
  private queryParams = false;
  private routeSub: any;
  private currentUserSub: any;
  private savingProductId: number;
  private savingProductState: any;

  public formVisible = false;
  public form: FormGroup;
  public isLoading = true;
  public profileName: string;
  public interestRateRange = [];
  public depositFeeRateRange = [];
  public depositFeeFlatRange = [];
  public withdrawalFeeRateRange = [];
  public withdrawalFeeFlatRange = [];
  public entryFeeRateRange = [];
  public entryFeeFlatRange = [];
  public closeFeeRateRange = [];
  public closeFeeFlatRange = [];
  public managementFeeRateRange = [];
  public managementFeeFlatRange = [];
  public profileId: number;
  public currentUserId: number;
  public profileType: any;
  public openDate: any;
  public formConfigSavingProduct = {
    loanProductLookupUrl: {url: `${environment.API_ENDPOINT}saving-products`}
  };
  public formConfigSavingOfficer = {
    savingOfficerLookupUrl: {url: `${environment.API_ENDPOINT}users/lookup`}
  };

  private rangeValidateFields = [
    'interestRate',
    'depositFeeRate',
    'depositFeeFlat',
    'withdrawalFeeRate',
    'withdrawalFeeFlat',
    'entryFeeRate',
    'entryFeeFlat',
    'closeFeeRate',
    'closeFeeFlat',
    'managementFeeRate',
    'managementFeeFlat'];

  constructor(public route: ActivatedRoute,
              private router: Router,
              private savingProductService: SavingProductService,
              private store$: Store<fromRoot.State>,
              private fb: FormBuilder) {
  }

  ngOnInit() {
    this.currentUserSub = this.store$.pipe(select(fromRoot.getCurrentUserState)).subscribe(userState => {
      if (userState['loaded'] && !userState['error'] && userState['success']) {
        this.currentUserId = userState.id;
      }
    });

    this.openDate = moment().format(environment.DATE_FORMAT_MOMENT);
    this.form = this.fb.group({
      profileId: new FormControl({value: '', disabled: true}, Validators.required),
      savingProductId: new FormControl('', Validators.required),
      interestRate: new FormControl('', Validators.required),
      openDate: new FormControl(this.openDate, Validators.required),
      depositFeeRate: new FormControl('', Validators.required),
      depositFeeFlat: new FormControl('', Validators.required),
      withdrawalFeeRate: new FormControl('', Validators.required),
      withdrawalFeeFlat: new FormControl('', Validators.required),
      entryFeeRate: new FormControl('', Validators.required),
      entryFeeFlat: new FormControl('', Validators.required),
      closeFeeRate: new FormControl('', Validators.required),
      closeFeeFlat: new FormControl('', Validators.required),
      managementFeeRate: new FormControl('', Validators.required),
      managementFeeFlat: new FormControl('', Validators.required),
      savingOfficerId: new FormControl(this.currentUserId, Validators.required)
    });


    this.routeSub = this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length && +params['profileId'] > 0) {
        this.profileId = params.profileId;
        this.profileType = params.profileType;
        setTimeout(() => {
          this.setProfileData(params);
          this.formVisible = true;
        });
        this.queryParams = true;
      } else {
        this.formVisible = true;
      }
    });
    this.isLoading = false;
  }

  setProfileData(data) {
    if (data) {
      this.form.controls['profileId'].setValue(+data['profileId'], {emitEvent: false});
      this.profileName = data['profileName'];
      this.form.controls['profileId'].setValue(data['profileId']);
    }
  }

  onSavingSelect(savingProduct) {
    if (savingProduct) {
      this.refreshControlsArray(this.rangeValidateFields);
      this.addValidationRules(savingProduct);
      this.disableField(savingProduct, this.rangeValidateFields);
      this.form.markAsPristine();
      this.form.markAsUntouched();
    } else {
      this.refreshControlsArray(['amount', 'total']);
    }
  }

  disableField(savingProduct, fields: string[]) {
    fields.map((field: string) => {
      if (savingProduct[`${field}Min`] === savingProduct[`${field}Max`]) {
        this.form.controls[field].disable({emitEvent: false});
        this.form.controls[field].setValue(savingProduct[`${field}Min`]);
      }
    });
  }

  refreshControlsArray(controlsArray: string[]) {
    controlsArray.map((controlName: string) => {
      this.form.controls[controlName].enable({emitEvent: false});
    });
  }

  addValidationRules(savingProduct) {
    if (savingProduct.interestRateMin >= 0 && savingProduct.interestRateMax) {
      this.form.controls['interestRate'].clearValidators();
      this.form.controls['interestRate'].setValidators([
        Validators.required,
        range([savingProduct.interestRateMin, savingProduct.interestRateMax])
      ]);
      this.interestRateRange = [savingProduct.interestRateMin, savingProduct.interestRateMax];
    }

    if (savingProduct.depositFeeRateMin >= 0 && savingProduct.depositFeeRateMax >= 0) {
      this.form.controls['depositFeeRate'].clearValidators();
      this.form.controls['depositFeeRate'].setValidators([
        Validators.required,
        range([savingProduct.depositFeeRateMin, savingProduct.depositFeeRateMax])
      ]);
      this.depositFeeRateRange = [savingProduct.depositFeeRateMin, savingProduct.depositFeeRateMax];
    }

    if (savingProduct.depositFeeFlatMin >= 0 && savingProduct.depositFeeFlatMax >= 0) {
      this.form.controls['depositFeeFlat'].clearValidators();
      this.form.controls['depositFeeFlat'].setValidators([
        Validators.required,
        range([savingProduct.depositFeeFlatMin, savingProduct.depositFeeFlatMax])
      ]);
      this.depositFeeFlatRange = [savingProduct.depositFeeFlatMin, savingProduct.depositFeeFlatMax];
    }

    if (savingProduct.withdrawalFeeRateMin >= 0 && savingProduct.withdrawalFeeRateMax >= 0) {
      this.form.controls['withdrawalFeeRate'].clearValidators();
      this.form.controls['withdrawalFeeRate'].setValidators([
        Validators.required,
        range([savingProduct.withdrawalFeeRateMin, savingProduct.withdrawalFeeRateMax])
      ]);
      this.withdrawalFeeRateRange = [savingProduct.withdrawalFeeRateMin, savingProduct.withdrawalFeeRateMax];
    }

    if (savingProduct.withdrawalFeeFlatMin >= 0 && savingProduct.withdrawalFeeFlatMax >= 0) {
      this.form.controls['withdrawalFeeFlat'].clearValidators();
      this.form.controls['withdrawalFeeFlat'].setValidators([
        Validators.required,
        range([savingProduct.withdrawalFeeFlatMin, savingProduct.withdrawalFeeFlatMax])
      ]);
      this.withdrawalFeeFlatRange = [savingProduct.withdrawalFeeFlatMin, savingProduct.withdrawalFeeFlatMax];
    }

    if (savingProduct.entryFeeRateMin >= 0 && savingProduct.entryFeeRateMax >= 0) {
      this.form.controls['entryFeeRate'].clearValidators();
      this.form.controls['entryFeeRate'].setValidators([
        Validators.required,
        range([savingProduct.entryFeeRateMin, savingProduct.entryFeeRateMax])
      ]);
      this.entryFeeRateRange = [savingProduct.entryFeeRateMin, savingProduct.entryFeeRateMax];
    }

    if (savingProduct.entryFeeFlatMin >= 0 && savingProduct.entryFeeFlatMax >= 0) {
      this.form.controls['entryFeeFlat'].clearValidators();
      this.form.controls['entryFeeFlat'].setValidators([
        Validators.required,
        range([savingProduct.entryFeeFlatMin, savingProduct.entryFeeFlatMax])
      ]);
      this.entryFeeFlatRange = [savingProduct.entryFeeFlatMin, savingProduct.entryFeeFlatMax];
    }

    if (savingProduct.closeFeeRateMin >= 0 && savingProduct.closeFeeRateMax >= 0) {
      this.form.controls['closeFeeRate'].clearValidators();
      this.form.controls['closeFeeRate'].setValidators([
        Validators.required,
        range([savingProduct.closeFeeRateMin, savingProduct.closeFeeRateMax])
      ]);
      this.closeFeeRateRange = [savingProduct.closeFeeRateMin, savingProduct.closeFeeRateMax];
    }

    if (savingProduct.closeFeeFlatMin >= 0 && savingProduct.closeFeeFlatMax >= 0) {
      this.form.controls['closeFeeFlat'].clearValidators();
      this.form.controls['closeFeeFlat'].setValidators([
        Validators.required,
        range([savingProduct.closeFeeFlatMin, savingProduct.closeFeeFlatMax])
      ]);
      this.closeFeeFlatRange = [savingProduct.closeFeeFlatMin, savingProduct.closeFeeFlatMax];
    }

    if (savingProduct.managementFeeRateMin >= 0 && savingProduct.managementFeeRateMax >= 0) {
      this.form.controls['managementFeeRate'].clearValidators();
      this.form.controls['managementFeeRate'].setValidators([
        Validators.required,
        range([savingProduct.managementFeeRateMin, savingProduct.managementFeeRateMax])
      ]);
      this.managementFeeRateRange = [savingProduct.managementFeeRateMin, savingProduct.managementFeeRateMax];
    }

    if (savingProduct.managementFeeFlatMin >= 0 && savingProduct.managementFeeFlatMax >= 0) {
      this.form.controls['managementFeeFlat'].clearValidators();
      this.form.controls['managementFeeFlat'].setValidators([
        Validators.required,
        range([savingProduct.managementFeeFlatMin, savingProduct.managementFeeFlatMax])
      ]);
      this.managementFeeFlatRange = [savingProduct.managementFeeFlatMin, savingProduct.managementFeeFlatMax];
    }

    this.form.updateValueAndValidity({emitEvent: false});
  }

  populateFields(saving) {
    this.savingProductId = saving.savingProductId;
    for (const key in saving) {
      if (this.form.controls.hasOwnProperty(key)) {
        this.form.controls[key].setValue(saving[key]);
      }
      if (key === 'openDate') {
        const date = moment(saving['openDate']).format(environment.DATE_FORMAT_MOMENT);
        this.form.controls['openDate'].setValue(date);
      }
    }
    this.profileName = saving.profileName;
    this.getSavingProduct();
    this.form.controls['savingOfficerId'].setValue(saving['savingOfficerId']);
    this.form.controls['savingProductId'].setValue(saving['savingProductId']);
  }

  getSavingProduct() {
    this.savingProductService.getSavingProduct(this.savingProductId).subscribe(res => {
      this.savingProductState = res;
      this.addValidationRules(this.savingProductState);
      this.disableField(this.savingProductState, this.rangeValidateFields);
    }, catchError((err: HttpErrorResponse) => {
      console.error(err.error.message);
      return of(err.error);
    }))
  }
}
