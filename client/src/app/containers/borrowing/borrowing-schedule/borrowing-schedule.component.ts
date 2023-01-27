import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import {
  IBorrowingFormState,
  IBorrowingState,
  IBorrowingSchedule
} from '../../../core/store/borrowings';
import { LoanInstallmentsTableComponent } from '../../../shared/components/cbs-loan-installments-table/loan-installments-table.component';
import {CCRulesFormComponent} from '../../configuration/containers/credit-committee/shared/credit-committee-form.component';

@Component({
  selector: 'cbs-borrowing-schedule',
  templateUrl: 'borrowing-schedule.component.html'
})
export class BorrowingScheduleComponent implements OnInit, OnDestroy {
  @ViewChild(LoanInstallmentsTableComponent, {static: false}) installmentsTableComponent: LoanInstallmentsTableComponent;
  public borrowingFormState: IBorrowingFormState;
  public installments: {};
  public breadcrumb = [];
  private formData: {};
  private borrowingSub: any;
  private borrowing: any;
  private borrowingFormSub: any;
  private getScheduleDataSub: any;

  constructor(private borrowingFormStore$: Store<IBorrowingFormState>,
              private borrowingScheduleStore$: Store<IBorrowingSchedule>,
              private borrowingStore$: Store<IBorrowingState>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.borrowingFormStore$.dispatch(new fromStore.SetStateBond('schedule'));

    this.borrowingSub = this.store$.select(fromRoot.getBorrowingState).subscribe(
      (state: IBorrowingState) => {
        if (state.loaded && state.success) {
          this.borrowing = state.borrowing;
          const borrowingProfile = this.borrowing['profile'];
          const profileType = borrowingProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: borrowingProfile['name'],
              link: `/profiles/${profileType}/${borrowingProfile['id']}/info`
            },
            {
              name: 'BORROWINGS',
              link: `/profiles/${profileType}/${borrowingProfile['id']}/borrowings`
            },
            {
              name: 'SCHEDULE',
              link: ''
            }
          ];
        }
      });
    setTimeout(() => {
      this.borrowingStore$.dispatch(new fromStore.SetBorrowingBreadcrumb(this.breadcrumb));
    }, 700);

    this.borrowingFormSub = this.borrowingFormStore$.select(fromRoot.getBorrowingFormState).subscribe(
      (borrowingFormState: IBorrowingFormState) => {
        if (borrowingFormState.loaded) {
          this.borrowingFormState = borrowingFormState;
          if (borrowingFormState.data.borrowingProductId || borrowingFormState.data.borrowingProduct) {
            this.formData = {
              profileId: borrowingFormState.data.profileId || borrowingFormState.data.profile.id,
              borrowingProductId: borrowingFormState.data.borrowingProductId || borrowingFormState.data.borrowingProduct.id,
              amount: borrowingFormState.data.amount,
              preferredRepaymentDate: borrowingFormState.data.preferredRepaymentDate,
              disbursementDate: borrowingFormState.data.disbursementDate,
              gracePeriod: borrowingFormState.data.gracePeriod,
              interestRate: borrowingFormState.data.interestRate,
              maturity: borrowingFormState.data.maturity,
              scheduleType: borrowingFormState.data.scheduleType,
              correspondenceAccountId: borrowingFormState.data['correspondenceAccountId'] || borrowingFormState.data['correspondenceAccount']['id']
            };
          }

          if (this.borrowing && (this.borrowing['status'] === 'ACTIVE' || this.borrowing['status'] === 'CLOSED')) {
            this.installmentsTableComponent.isLoading = true;
            this.borrowingScheduleStore$.dispatch(new fromStore.LoadActiveBorrowingSchedule(borrowingFormState.data['borrowingId']));
          } else {
            this.installmentsTableComponent.isLoading = false;
            if (borrowingFormState.valid) {
              this.installmentsTableComponent.isLoading = true;
              this.borrowingScheduleStore$.dispatch(new fromStore.LoadBorrowingSchedule(this.formData));
            }
          }
        }
      });

    this.getScheduleDataSub = this.borrowingScheduleStore$.select(fromRoot.getBorrowingScheduleState).subscribe(
      (state: IBorrowingSchedule) => {
        if (state.loaded && state.success) {
          this.installments = state.borrowingSchedule;
          this.installmentsTableComponent.isLoading = false;
        } else if (state.loaded && state.error) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.installmentsTableComponent.isLoading = false;
          this.resetScheduleState();
        }
      });
  }

  resetScheduleState() {
    this.borrowingScheduleStore$.dispatch(new fromStore.ResetBorrowingSchedule());
  }

  ngOnDestroy() {
    this.borrowingFormSub.unsubscribe();
    this.getScheduleDataSub.unsubscribe();
    this.resetScheduleState();
    this.borrowingSub.unsubscribe();
  }
}
