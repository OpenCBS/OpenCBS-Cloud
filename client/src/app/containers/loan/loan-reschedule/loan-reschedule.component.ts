import { AfterViewInit, Component, OnInit, ViewChild, ElementRef, OnDestroy, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { environment } from 'environments/environment';
import { ILoanInfo } from 'app/core/store';
import { RescheduleFormComponent } from '../shared/components/reschedule-form/reschedule-form.component';
import { RescheduleService } from '../shared/services/reschedule.service';
import { ILoanSchedule } from '../../../core/store/loans/loan-schedule/loan-schedule.reducer';
import { LoanInstallmentsTableComponent } from '../../../shared/components/cbs-loan-installments-table/loan-installments-table.component';
import { Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import * as moment from 'moment';
import { ParseDateFormatService } from '../../../core/services';
import { ActualizeLoanService } from '../shared/services/actualize-loan.service';
import { cloneDeep, findIndex } from 'lodash';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom41',
  name: 'custom41'
};

@Component({
  selector: 'cbs-loan-reschedule',
  templateUrl: 'loan-reschedule.component.html',
  styleUrls: ['loan-reschedule.component.scss']
})

export class LoanRescheduleComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(RescheduleFormComponent, {static: true}) rescheduleFormComponent: RescheduleFormComponent;
  @ViewChild(LoanInstallmentsTableComponent, {static: true}) installmentsTableComponent: LoanInstallmentsTableComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;

  public breadcrumb = [];
  public loanId: number;
  public currentLoan: any;
  public loan: any;
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'LOANS',
      link: '/loans'
    }
  ];
  public schedule: any;
  public installments: any;
  public isOpen = false;
  public byMaturity: boolean;
  public formStatusChanged = false;
  public isOpenActualize = false;
  public loanType: string;
  public loanCode: string;
  public editableSchedule: string;
  public editablePaymentDate: string;
  public status: string;
  public totalAmount: number;
  public totalPrincipal: number;

  private newInstallment: any;
  private nextRoute: string;
  private isSubmitting = false;
  private isLeaving = false;
  private routeSub: Subscription;
  private loanSub: Subscription;
  private loanScheduleSub: Subscription;

  constructor(private route: ActivatedRoute,
              private loanStore$: Store<ILoanInfo>,
              private rescheduleService: RescheduleService,
              private translate: TranslateService,
              private toastrService: ToastrService,
              private actualizeLoanService: ActualizeLoanService,
              private store$: Store<fromRoot.State>,
              private loanScheduleStore$: Store<ILoanSchedule>,
              private renderer2: Renderer2,
              private parseDateFormatService: ParseDateFormatService,
              private router: Router) {
  }

  canDeactivate(url?) {
    this.nextRoute = url;
    if ( !this.isSubmitting ) {
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
    const pos = this.router.url.match('reschedule');
    if ( pos ) {
      this.editableSchedule = pos[0] === 'reschedule' ? 'principal' : '';
      this.editablePaymentDate = pos[0] === 'reschedule' ? 'payment_date' : '';
    }

    this.routeSub = this.route.parent.parent.params
      .subscribe((params: { id, loanType }) => {
        if ( params && params.id ) {
          this.loanId = params.id;
          this.loanType = params.loanType;
        }
      });

    this.loanSub = this.store$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe((loanState: ILoanInfo) => {
        if ( loanState['loan'] && loanState.loaded && loanState.success && !loanState.error ) {
          this.currentLoan = loanState.loan;
          this.loanCode = this.currentLoan.code;
          this.byMaturity = !!this.currentLoan.maturityDate;
          this.rescheduleFormComponent.createForm();
          this.rescheduleFormComponent.rescheduleForm.controls['scheduleType'].setValue(this.currentLoan.scheduleType);
          if ( this.byMaturity ) {
            this.rescheduleFormComponent.rescheduleForm.controls['maturityDate'].setValidators(Validators.required);
            this.rescheduleFormComponent.rescheduleForm.controls['maturity'].clearValidators();
            this.rescheduleFormComponent.rescheduleForm.controls['maturity'].setErrors(null);
          } else {
            this.rescheduleFormComponent.rescheduleForm.controls['maturity'].setValidators(Validators.required);
            this.rescheduleFormComponent.rescheduleForm.controls['maturityDate'].clearValidators();
            this.rescheduleFormComponent.rescheduleForm.controls['maturityDate'].setErrors(null);
          }

          if ( loanState['loaded'] && !loanState['error'] && loanState['success'] ) {
            const loanProfile = this.currentLoan['profile'];
            const profileType = loanProfile['type'] === 'PERSON' ? 'people' : 'companies';
            this.breadcrumb = [
              {
                name: loanProfile['name'],
                link: `/profiles/${profileType}/${loanProfile['id']}/info`
              },
              {
                name: 'LOANS',
                link: '/loans'
              },
              {
                name: this.currentLoan['code'],
                link: ''
              },
              {
                name: 'OPERATIONS',
                link: `/loans/${this.currentLoan['id']}/operations`
              },
              {
                name: 'RESCHEDULE',
                link: ''
              }
            ];
            if ( loanState['loan'] && this.rescheduleFormComponent.rescheduleForm ) {
              this.rescheduleFormComponent.rescheduleForm.controls['interestRate'].setValue(this.currentLoan['interestRate']);
              if ( this.byMaturity ) {
                this.rescheduleFormComponent.rescheduleForm.controls['maturityDate'].setValue(this.currentLoan['maturityDate']);
              } else {
                this.rescheduleFormComponent.rescheduleForm.controls['maturity'].setValue(this.currentLoan['maturity']);
              }
            }
            this.loanScheduleStore$.dispatch(new fromStore.LoadLoanSchedule(this.loanId));
          }
        }
      });

    this.loanScheduleSub = this.store$.pipe(select(fromRoot.getLoanScheduleState))
      .subscribe(
        (schedule: ILoanSchedule) => {
          if ( schedule && schedule.loaded && schedule.success && !schedule.error ) {
            this.schedule = schedule;
            this.installments = this.schedule['loanSchedule'];
            this.status = this.installments['status'];
            this.installmentsTableComponent.isLoading = false;
          }

          if ( this.installments && this.installments['totalAmount'] && this.installments['totalPrincipal'] ) {
            this.totalAmount = this.installments['totalAmount'];
            this.totalPrincipal = this.installments['totalPrincipal'];
          }
        });

    this.loan = this.store$.pipe(select(fromRoot.getLoanInfoState));
  }

  ngAfterViewInit() {
    this.rescheduleFormComponent.rescheduleForm.valueChanges.pipe(debounceTime(300))
      .subscribe(newRescheduleData => {
        this.formStatusChanged = this.compareChanges(newRescheduleData, this.currentLoan);
      })
  }

  compareChanges(newRescheduleData, oldRescheduleData) {
    let status = false;
    for ( const value in newRescheduleData ) {
      if ( newRescheduleData.hasOwnProperty(value) ) {
        if ( value === 'firstInstallmentDate' ) {
          const oldDate = moment(oldRescheduleData.preferredRepaymentDate).format(environment.DATE_FORMAT_MOMENT);
          if ( newRescheduleData.firstInstallmentDate !== oldDate ) {
            status = true;
          }
        } else if ( value === 'gracePeriod' ) {
          if ( newRescheduleData[value] !== oldRescheduleData.gracePeriod ) {
            status = true;
          }
        } else if ( value === 'interestRate' ) {
          if ( newRescheduleData[value] !== oldRescheduleData.interestRate ) {
            status = true;
          }
        } else if ( value === 'maturity' ) {
          const oldMaturity = oldRescheduleData.maturity === 0 ? '' : oldRescheduleData.maturity;
          if ( newRescheduleData[value] !== oldMaturity ) {
            status = true;
          }
        } else if ( value === 'maturityDate' ) {
          const oldDate = moment(oldRescheduleData.maturityDate).format(environment.DATE_FORMAT_MOMENT);
          if ( newRescheduleData.maturityDate !== oldDate ) {
            status = true;
          }
        } else if ( value === 'rescheduleDate' ) {
          const oldDate = moment(oldRescheduleData.rescheduleDate).format(environment.DATE_FORMAT_MOMENT);
          if ( newRescheduleData.rescheduleDate !== oldDate ) {
            status = true;
          }
        } else {
          for ( const k in oldRescheduleData ) {
            if ( oldRescheduleData.hasOwnProperty(k) ) {
              if ( value === k && newRescheduleData[value] !== oldRescheduleData[k] ) {
                status = true;
              }
            }
          }
        }
      }
    }
    return status;
  }

  preview() {
    this.setValueDateFormat();
    this.installmentsTableComponent.isLoading = true;
    this.rescheduleService.reschedule(this.loanId, this.rescheduleFormComponent.rescheduleForm.value, 'preview')
      .subscribe(response => {
        if ( response.error ) {
          this.formStatusChanged = false;
          this.disableBtn(this.submitButton.nativeElement, false);
          this.toastrService.clear();
          this.toastrService.error(response.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        } else {
          this.formStatusChanged = true;
          this.installments = response;
        }
        this.installmentsTableComponent.isLoading = false;
      });
  }

  getCellData(data) {
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
        this.loanStore$.dispatch(new fromStore.ValidateLoanSchedule({
          id: this.loanId,
          scheduleDto: this.newInstallment,
          rescheduleDto: this.rescheduleFormComponent.rescheduleForm.value
        }));
      }
    }
  }

  rescheduleApply() {
    this.setValueDateFormat();
    this.installmentsTableComponent.isLoading = true;
    this.rescheduleService
      .reschedule(
        this.loanId,
        {rescheduleDto: this.rescheduleFormComponent.rescheduleForm.value, scheduleDto: this.installments},
        'apply'
      )
      .subscribe(response => {
        if ( response.error ) {
          this.disableBtn(this.submitButton.nativeElement, false);
          this.toastrService.clear();
          if ( response.message === `You have to actualize contract (ID = ${this.loanId})` ) {
            this.isOpenActualize = true;
          } else {
            this.toastrService.error(response.message ? response.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          }
        } else {
          this.isSubmitting = true;
          this.toastrService.clear();
          this.translate.get('RESCHEDULE_SUCCESS').subscribe((message: string) => {
            this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.router.navigate(['loans', this.loanId, this.loanType, 'schedule']);
          this.installments = response;
        }
        this.installmentsTableComponent.isLoading = false;
      });
  }

  submitActualizeLoan() {
    this.isOpenActualize = false;
    this.installmentsTableComponent.isLoading = true;
    const actualizeDate = this.parseDateFormatService.parseDateValue(this.rescheduleFormComponent.rescheduleForm.value.rescheduleDate);
    this.actualizeLoanService.actualizeLoan(this.loanId, actualizeDate).subscribe(res => {
      if ( res.error ) {
        this.toastrService.clear();
        this.toastrService.error(res.message, '', environment.ERROR_TOAST_CONFIG);
        this.installmentsTableComponent.isLoading = false;
      } else {
        const message = 'Actualize loan finished';
        this.translate.get(message).subscribe((translation: string) => {
          this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.installmentsTableComponent.isLoading = false;
      }
    });
  }

  setValueDateFormat() {
    this.rescheduleFormComponent.rescheduleForm.controls['rescheduleDate']
      .setValue(this.parseDateFormatService.parseDateValue(this.rescheduleFormComponent.rescheduleForm.value.rescheduleDate));
    this.rescheduleFormComponent.rescheduleForm.controls['firstInstallmentDate']
      .setValue(this.parseDateFormatService.parseDateValue(this.rescheduleFormComponent.rescheduleForm.value.firstInstallmentDate));
    this.rescheduleFormComponent.rescheduleForm.controls['maturityDate']
      .setValue(this.parseDateFormatService.parseDateValue(this.rescheduleFormComponent.rescheduleForm.value.maturityDate));
  }

  disableBtn(btn, bool) {
    this.renderer2.setProperty(btn, 'disabled', bool);
  }

  resetPreview() {
    this.installmentsTableComponent.isLoading = true;
    this.rescheduleFormComponent.createForm();
    this.rescheduleFormComponent.rescheduleForm.controls['interestRate'].setValue(this.currentLoan['interestRate']);
    this.rescheduleFormComponent.rescheduleForm.controls['scheduleType'].setValue(this.currentLoan['scheduleType']);
    this.rescheduleFormComponent.scheduleType = this.currentLoan['scheduleType'];
    if ( this.byMaturity ) {
      this.rescheduleFormComponent.rescheduleForm.controls['maturityDate'].setValue(this.currentLoan['maturityDate']);
    } else {
      this.rescheduleFormComponent.rescheduleForm.controls['maturity'].setValue(this.currentLoan['maturity']);
    }
    this.installments = this.schedule['loanSchedule'];
    this.installmentsTableComponent.isLoading = false;
  }

  cancel() {
    this.router.navigate(['loans', this.loanId, this.loanType, 'operations']);
  }

  ngOnDestroy() {
    this.loanSub.unsubscribe();
  }
}
