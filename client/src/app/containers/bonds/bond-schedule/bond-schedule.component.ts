import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';

import {
  BondFormState,
  BondState,
  IBondSchedule
} from '../../../core/store/bond';
import { LoanInstallmentsTableComponent } from '../../../shared/components/cbs-loan-installments-table/loan-installments-table.component';

@Component({
  selector: 'cbs-bond-schedule',
  templateUrl: 'bond-schedule.component.html'
})
export class BondScheduleComponent implements OnInit, OnDestroy {
  @ViewChild(LoanInstallmentsTableComponent, {static: false}) installmentsTableComponent: LoanInstallmentsTableComponent;
  public bondFormState: BondFormState;
  public installments: {};
  public breadcrumb = [];
  private bondSub: any;
  private bond: any;
  private bondFormSub: any;
  private getScheduleDataSub: any;

  constructor(private bondFormStore$: Store<BondFormState>,
              private bondScheduleStore$: Store<IBondSchedule>,
              private bondStore$: Store<BondState>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.bondFormStore$.dispatch(new fromStore.SetStateBond('schedule'));

    this.bondSub = this.store$.select(fromRoot.getBondState)
    .subscribe((state: BondState) => {
      if (state.loaded && state.success) {
        this.bond = state.bond;
        const bondProfile = this.bond['profile'];
        const profileType = bondProfile['type'] === 'PERSON' ? 'people' : 'companies';
        this.breadcrumb = [
          {
            name: bondProfile['name'],
            link: `/profiles/${profileType}/${bondProfile['id']}/info`
          },
          {
            name: 'BONDS',
            link: `/profiles/${profileType}/${bondProfile['id']}/bonds`
          },
          {
            name: 'SCHEDULE',
            link: ''
          }
        ];
      }
    });

    setTimeout(() => {
      if (this.bondFormState && this.bondFormState.currentRoute === 'edit') {
        return;
      }
      this.bondStore$.dispatch(new fromStore.SetBondBreadcrumb(this.breadcrumb));
    }, 700);

    this.bondFormSub = this.bondFormStore$.select(fromRoot.getBondFormState)
    .subscribe((bondFormState: BondFormState) => {
      let formData = {};
      if (bondFormState.loaded) {
        this.bondFormState = bondFormState;
        if (bondFormState.data.bondProductId || bondFormState.data.bondProduct) {
          formData = {
            profileId: bondFormState.data.profileId || bondFormState.data.profile.id,
            bondProductId: bondFormState.data.bondProductId || bondFormState.data.bondProduct.id,
            bondAmount: bondFormState.data.bondAmount,
            interestRate: bondFormState.data.interestRate,
            maturity: bondFormState.data.maturity,
            number: bondFormState.data.number,
            equivalentCurrencyId: bondFormState.data.equivalentCurrencyId || bondFormState.data.equivalentCurrency.id,
            expireDate: bondFormState.data.expireDate,
            bankAccountId: bondFormState.data.bankAccountId || bondFormState.data.bankAccount.id,
            frequency: bondFormState.data.frequency,
            sellDate: bondFormState.data.sellDate,
            couponDate: bondFormState.data.couponDate,
            interestScheme: bondFormState.data.interestScheme
          };
        }

        if (this.bond && (this.bond['status'] === 'SOLD' || this.bond['status'] === 'CLOSED')) {
          this.installmentsTableComponent.isLoading = true;
          this.bondScheduleStore$.dispatch(new fromStore.LoadActiveBondSchedule(bondFormState.data['id']));
        } else {
          this.installmentsTableComponent.isLoading = false;
          if (bondFormState.valid) {
            this.installmentsTableComponent.isLoading = true;
            this.bondScheduleStore$.dispatch(new fromStore.LoadBondSchedule(formData));
          }
        }
      }
    });

    this.getScheduleDataSub = this.bondScheduleStore$.select(fromRoot.getBondScheduleState)
    .subscribe((state: IBondSchedule) => {
      if (state.loaded && state.success) {
        this.installments = state.bondSchedule;
        this.installmentsTableComponent.isLoading = false;
        return;
      }
      if (state.loaded && state.error) {
        this.translate.get('CREATE_ERROR')
        .subscribe((res: string) => {
          this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
        });
        this.installmentsTableComponent.isLoading = false;
        this.resetScheduleState();
      }
    });
  }

  resetScheduleState() {
    this.bondScheduleStore$.dispatch(new fromStore.ResetBondSchedule());
  }

  ngOnDestroy() {
    this.bondFormSub.unsubscribe();
    this.getScheduleDataSub.unsubscribe();
    this.resetScheduleState();
    this.bondSub.unsubscribe();
  }
}
