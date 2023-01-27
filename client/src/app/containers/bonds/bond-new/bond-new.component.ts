import { debounceTime } from 'rxjs/operators';
import {
  Component,
  AfterViewInit,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store/bond';
import { BondFormState } from '../../../core/store/bond/bond-form/bond-form.interfaces';
import { BondFormExtraService } from '../shared/services/bond-extra.service';
import { BondDetailsFormComponent } from '../shared/components/bond-details-form/bond-details-form.component';
import * as _ from 'lodash';
import { environment } from '../../../../environments/environment';
import * as moment from 'moment';

@Component({
  selector: 'cbs-bond-new',
  templateUrl: './bond-new.component.html',
  styleUrls: ['./bond-new.component.scss']
})
export class BondNewComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(BondDetailsFormComponent, {static: false}) formComponent: BondDetailsFormComponent;
  public bondFormState: BondFormState;
  public formVisible = false;
  public bondFormSub: any;
  private amountsSub: any;
  private queryParams = false;
  public formChangeSub: any;
  private routeSub: any;
  public formStatusChanged: any;
  public bond: any;
  private DATA_FORMAT = 'YYYY-MM-DD';

  constructor(
    public route: ActivatedRoute,
    private router: Router,
    private store$: Store<fromRoot.State>,
    private bondFormExtraService: BondFormExtraService,
    public bondFormStore$: Store<BondFormState>) {
  }

  ngOnInit() {
    this.formComponent.createForm();

    this.routeSub = this.route.queryParams.subscribe(params => {
      if (Object.keys(params).length && +params['profileId'] > 0) {
        this.bondFormStore$.dispatch(new fromStore.SetProfileBond(params));
        setTimeout(() => {
          this.setProfileData(params);
        });
        this.queryParams = true;
      }
    });

    this.bondFormSub = this.store$
      .select(fromRoot.getBondFormState)
      .subscribe((bondFormState: BondFormState) => {
        this.bond = bondFormState.data;
        if (bondFormState.loaded || bondFormState.currentRoute === 'create') {
          this.setProfileData(bondFormState.profile);
          if (
            !this.queryParams &&
            !bondFormState.profile['profileId'] &&
            bondFormState.currentRoute === 'create'
          ) {
            this.router.navigate(['/profiles']);
          }
          this.bondFormState = {
            valid: bondFormState.valid,
            data: {
              ...bondFormState.data
            },
            profile: bondFormState.profile,
            bondProduct: {...bondFormState.bondProduct},
            currentRoute: bondFormState.currentRoute
          };

          if (!_.isEmpty(this.bondFormState.data)) {
            setTimeout(() => {
              this.formComponent.populateFields(this.bondFormState.data, bondFormState.bondProduct);
              this.formVisible = true;
            });
          } else {
            this.formVisible = true;
          }

          if (bondFormState.bondProduct) {
            this.formComponent.setControlValue('bondProductId', bondFormState.bondProduct.id);
            this.formComponent.addValidationRules(bondFormState.bondProduct);
          }

          this.formComponent.disableControl('expireDate');
          this.formComponent.disableControl('couponDate');
        }
      });
  }

  ngAfterViewInit() {
    this.formChangeSub = this.formComponent.form.valueChanges
      .pipe(debounceTime(300))
      .subscribe(newValue => {
        const rawValue = this.formComponent.form.getRawValue();
        this.bondFormState = {
          ...this.bondFormState,
          ...{
            data: {
              ...this.bondFormState.data,
              ...rawValue
            },
            valid: this.formComponent.form.valid && !!rawValue.amount && !!rawValue.equivalentAmount
          }
        };
        if (this.bondFormState.currentRoute !== 'create' && this.bondFormState.currentRoute !== 'edit') {
          this.formStatusChanged = this.compareChanges(newValue, this.bond);
          this.bondFormExtraService.announceFormStatusChange(this.bondFormState.valid && this.formStatusChanged);
        } else {
          this.bondFormExtraService.announceFormStatusChange(this.bondFormState.valid);
        }
        this.bondFormExtraService.setState(this.bondFormState);
      });
  }

  compareChanges(newData, oldData) {
    let status = false;
    for (const value in newData) {
      if (newData.hasOwnProperty(value)) {
        if (value === 'bankAccountId') {
          if (newData[value] !== oldData['bankAccountId']) {
            status = true;
          }
        } else if (value === 'equivalentCurrencyId') {
          if (newData[value] !== oldData['equivalentCurrencyId']) {
            status = true;
          }
        } else if (value === 'sellDate') {
          const oldDate = moment(oldData['sellDate']).format(environment.DATE_FORMAT_MOMENT);
          if (newData['sellDate'] !== oldDate) {
            status = true;
          }
        } else {
          for (const k in oldData) {
            if (oldData.hasOwnProperty(k)) {
              if (value === k && newData[value] != oldData[k]) {
                status = true;
              }
            }
          }
        }
      }
    }
    return status;
  }

  setProfileData(data) {
    if (data) {
      this.formComponent.setControlValue('profileId', +data['profileId'], {emitEvent: false});
      this.formComponent.setProfileName(data['profileName']);
    }
  }

  onAmountRelatedFieldChanged(value: any) {
    if (!value.number || !value.equivalentCurrencyId || !value.sellDate) {
      return;
    }
    this.formComponent.setCouponDate(this.getCouponDate(value));

    this.amountsSub = this.bondFormExtraService.getAmounts(
      value.number,
      value.equivalentCurrencyId,
      value.sellDate)
      .subscribe((data: any) => {
        if (!data) {
          return;
        }
        this.formComponent.setControlValue('amount', data.amount);
        this.formComponent.setControlValue('equivalentAmount', data.equivalentAmount);
        this.formComponent.setAmount(data.amount);
        this.formComponent.setEquivalentAmount(data.equivalentAmount);
      });
  }

  getCouponDate(value: any) {
    if (!value.frequency) {
      return null;
    }
    if ('MONTHLY' === value.frequency) {
      return moment(value.sellDate, this.DATA_FORMAT, true).add(1, 'month').format(this.DATA_FORMAT);
    }

    if ('QUARTERLY' === value.frequency) {
      return moment(value.sellDate, this.DATA_FORMAT, true).add(3, 'month').format(this.DATA_FORMAT);
    }

    return moment(value.sellDate, this.DATA_FORMAT, true).add(6, 'month').format(this.DATA_FORMAT);
  }

  onGetCouponRelatedFieldChanged(value: any) {
    if (!value.frequency || !value.maturity) {
      return;
    }
    this.bondFormExtraService.getExpireDate(
      {
        ...this.bondFormState.data,
        ...value,
        ...{couponDate: this.getCouponDate(value)},
        ...{bondProductId: this.bondFormState.data.bondProductId || this.bondFormState.data.bondProduct.id}
      })
      .subscribe(date => {
        if (date) {
          this.formComponent.setExpireDate(date);
        }
      });
  }

  ngOnDestroy() {
    this.bondFormSub.unsubscribe();
    this.formChangeSub.unsubscribe();
    this.bondFormStore$.dispatch(
      new fromStore.PopulateBond(
        {
          data: {
            ...this.bondFormState.data,
            ...{
              bondAmount: {
                amount: this.formComponent.getAmount(),
                equivalentAmount: this.formComponent.getEquivalentAmount()
              }
            }
          },
          valid: this.bondFormState.valid && this.bondFormState.data.number > 0,
          bondProduct: this.bondFormState.bondProduct
        }));
  }
}
