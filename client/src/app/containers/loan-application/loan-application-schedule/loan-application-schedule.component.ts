import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../../environments/environment';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ILoanAppFormState, ILoanAppSchedule, ILoanAppState, } from '../../../core/store/loan-application';
import { LoanInstallmentsTableComponent } from '../../../shared/components/cbs-loan-installments-table/loan-installments-table.component';
import { Router } from '@angular/router';
import { ParseDateFormatService } from '../../../core/services';
import { findIndex, cloneDeep } from 'lodash'
import { Subscription } from 'rxjs';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom41',
  name: 'custom41'
};

@Component({
  selector: 'cbs-loan-application-schedule',
  templateUrl: 'loan-application-schedule.component.html',
  styles: ['.text-error { font-weight: bold; padding: 0 4px;}']
})
export class LoanAppScheduleComponent implements OnInit, OnDestroy {
  @ViewChild(LoanInstallmentsTableComponent, {static: true}) installmentsTableComponent: LoanInstallmentsTableComponent;
  public loanAppFormState: ILoanAppFormState;
  public svgData = SVG_DATA;
  public installments: {};
  public status: string;
  public breadcrumbLinks = [];
  public editableSchedule: string;
  public editablePaymentDate: string;
  public newInstallment: any;
  public totalAmount: number;
  public totalPrincipal: number;
  public isOpen = false;
  public loanAppId: number;

  private isLeaving = false;
  private nextRoute: string;
  private isSubmitting = false;
  private formData: {};
  private loanAppSub: Subscription;
  private loanApplicationFormSub: Subscription;
  private getScheduleDataSub: Subscription;

  constructor(private loanAppFormStore$: Store<ILoanAppFormState>,
              private loanAppScheduleStore$: Store<ILoanAppSchedule>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private store$: Store<fromRoot.State>,
              private parseDateFormatService: ParseDateFormatService,
              private router: Router) {
  }

  canDeactivate(url?) {
    this.nextRoute = url;
    if ( !this.isSubmitting && this.editableSchedule && this.editableSchedule === 'principal' ) {
      this.isOpen = true;
      return this.isLeaving;
    } else {
      return true;
    }
  }

  goToNextRoute() {
    this.isLeaving = true;
    this.router.navigateByUrl(this.nextRoute);
  }

  closeConfirmPopup() {
    this.isOpen = false;
  }

  ngOnInit() {
    const pos = this.router.url.match('edit');
    if ( pos ) {
      this.editableSchedule = pos[0] === 'edit' ? 'principal' : '';
      this.editablePaymentDate = pos[0] === 'edit' ? 'payment_date' : '';
    }

    this.loanAppFormStore$.dispatch(new fromStore.SetState('schedule'));
    this.loanAppSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((state: ILoanAppState) => {
        if ( state.loaded && state.success ) {
          this.loanAppId = state.loanApplication['id'];
          const profile = state['loanApplication']['profile'];
          const profileType = profile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumbLinks = [
            {
              name: profile['name'],
              link: `/profiles/${profileType}/${profile['id']}/info`
            },
            {
              name: 'LOAN APPLICATIONS',
              link: '/loan-applications'
            },
            {
              name: state['loanApplication']['code'],
              link: ''
            },
            {
              name: 'SCHEDULE',
              link: ''
            }
          ];
          this.loanAppFormStore$.dispatch(new fromStore.SetBreadcrumb(this.breadcrumbLinks))
        }
      });

    this.loanApplicationFormSub = this.loanAppFormStore$.pipe(select(fromRoot.getLoanAppFormState))
      .subscribe((loanAppFormState: ILoanAppFormState) => {
        if ( loanAppFormState.loaded ) {
          const entryFees = [];
          const amounts = [];

          if ( loanAppFormState.entryFees.length ) {
            loanAppFormState.entryFees.map(fee => {
              entryFees.push({
                entryFeeId: fee['id'],
                amount: fee['amount']
              });
            });
          }

          if ( loanAppFormState.data.amounts ) {
            amounts.push({
              memberId: loanAppFormState.data.profileId,
              amount: loanAppFormState.data.amounts
            });
          }

          this.loanAppFormState = loanAppFormState;
          this.formData = {
            profileId: loanAppFormState.data.profileId,
            loanProductId: loanAppFormState.data.loanProductId,
            amounts: amounts,
            disbursementDate: this.parseDateFormatService.parseDateValue(this.loanAppFormState.data.disbursementDate),
            preferredRepaymentDate: this.parseDateFormatService.parseDateValue(this.loanAppFormState.data.preferredRepaymentDate),
            gracePeriod: loanAppFormState.data.gracePeriod,
            interestRate: loanAppFormState.data.interestRate,
            maturity: loanAppFormState.data.maturity,
            maturityDate: this.parseDateFormatService.parseDateValue(this.loanAppFormState.data.maturityDate),
            scheduleType: loanAppFormState.data.scheduleType,
            scheduleBasedType: loanAppFormState.loanProduct.scheduleBasedType,
            entryFees: entryFees,
            currencyId: loanAppFormState.data.currencyId
          };

          if ( this.loanAppFormState ) {
            if ( this.loanAppFormState.currentRoute === 'create' || this.loanAppFormState.currentRoute === 'edit' ) {
              this.installmentsTableComponent.isLoading = false;
              if ( this.loanAppFormState ) {
                this.installmentsTableComponent.isLoading = true;
                this.loanAppScheduleStore$.dispatch(new fromStore.LoadLoanAppSchedule({
                  id: this.loanAppId,
                  form: this.formData
                }));
              }
            } else {
              this.installments = this.loanAppFormState.data.installments;
              this.installmentsTableComponent.isLoading = false;
            }
          }
        }
      });

    this.getScheduleDataSub = this.loanAppScheduleStore$.pipe(select(fromRoot.getLoanAppScheduleState))
      .subscribe((state: ILoanAppSchedule) => {
        if ( state.loaded && state.success ) {
          this.installments = state.loanAppSchedule;
          this.status = this.installments['status'];
          if ( this.installments['totalAmount'] && this.installments['totalPrincipal'] ) {
            this.totalAmount = this.installments['totalAmount'];
            this.totalPrincipal = this.installments['totalPrincipal'];
          }

          this.installmentsTableComponent.isLoading = false;
        } else if ( state.loaded && state.error ) {
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
            this.router.navigate(['/loan-applications/create/info']);
          });
          this.installmentsTableComponent.isLoading = false;
          this.resetScheduleState();
        }
      });
  }

  getCellData(data) {
    // TODO Need to improve this code 'cloneDeep'
    this.newInstallment = cloneDeep(this.installments);
    if ( data.value ) {
      if ( (data.row.principal !== data.value && data.column.field === 'principal')
        || (data.row.payment_date !== data.value && data.column.field === 'payment_date') ) {
        const index = findIndex(this.newInstallment['columns'], function (val) {
          return val === data.column.header;
        });
        const rowIndex = data.row['#'] - 1;
        this.newInstallment['rows'][rowIndex].data[index] = data.column.field === 'principal'
          ? parseFloat(data.value.replace(/,/g, ''))
          : data.value;
        this.loanAppScheduleStore$.dispatch(new fromStore.ValidateLoanAppSchedule({
          id: this.loanAppId,
          installment: this.newInstallment
        }));
      }
    }
  }

  cancel(id) {
    this.isOpen = false;
    this.router.navigate(['/loan-applications', id, 'schedule']);
  }

  saveNewSchedule() {
    this.isSubmitting = true;
    this.loanAppScheduleStore$.dispatch(new fromStore.UpdateLoanAppSchedule({
      id: this.loanAppId,
      installment:  this.installments
    }));
    this.router.navigate(['/loan-applications', this.loanAppId, 'schedule']);
  }

  resetScheduleState() {
    this.loanAppScheduleStore$.dispatch(new fromStore.ResetLoanAppSchedule());
  }

  ngOnDestroy() {
    this.loanApplicationFormSub.unsubscribe();
    this.getScheduleDataSub.unsubscribe();
    this.resetScheduleState();
    this.loanAppSub.unsubscribe();
  }
}
