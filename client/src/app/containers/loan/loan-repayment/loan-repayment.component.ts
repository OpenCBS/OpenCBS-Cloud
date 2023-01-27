import { debounceTime } from 'rxjs/operators';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import * as fromStore from '../../../core/store';
import { ILoanInfo } from '../../../core/store';
import { LoanInstallmentsTableComponent } from '../../../shared/components/cbs-loan-installments-table/loan-installments-table.component';
import { RepaymentService } from '../shared/services/repayment.service';
import { RepaymentFormComponent } from '../shared/components/repayment-form/repayment-form.component';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../core/core.reducer';
import { ActualizeLoanService } from '../shared/services/actualize-loan.service';
import { CommonService, ParseDateFormatService } from '../../../core/services';
import { round } from 'lodash'

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-loan-repayment',
  templateUrl: './loan-repayment.component.html',
  styleUrls: ['./loan-repayment.component.scss']
})

export class LoanRepaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(LoanInstallmentsTableComponent, {static: true}) installmentsTableComponent: LoanInstallmentsTableComponent;
  @ViewChild(RepaymentFormComponent, {static: false}) formComponent: RepaymentFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  @ViewChild('previewButton', {static: false}) previewButton: ElementRef;
  public installments: any;
  public svgData = SVG_DATA;
  public loan: Observable<ILoanInfo>;
  public isOpen = false;
  public isPreviewing = false;
  public breadcrumb = [];
  public maxAmount: any;
  public opened: boolean;
  public disabledRepay = true;
  public isOpenActualize = false;
  public repayData: any;
  public loanId: number;
  public loanCode: string;
  public loanType: string;
  public typeInstance: string;

  private repaymentDate: any;
  private interest: number;
  private penalty: number;
  private principal: number;
  private formChangeSub: any;
  private isLeaving = false;
  private nextRoute: string;
  private isSubmitting = false;
  private loanState: ILoanInfo;
  private totalEdited = false;
  private dateEdited = false;
  private totalAmount: number;
  private routeSub: Subscription;
  private loanSub: Subscription;


  constructor(private loanStore$: Store<ILoanInfo>,
              private route: ActivatedRoute,
              private router: Router,
              private loanInfoStore$: Store<ILoanInfo>,
              private renderer2: Renderer2,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService,
              private toastrService: ToastrService,
              private actualizeLoanService: ActualizeLoanService,
              private parseDateFormatService: ParseDateFormatService,
              private repaymentService: RepaymentService,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.repaymentDate = moment().format(environment.DATE_FORMAT_MOMENT);
    this.typeInstance = this.commonService.getData();
    this.routeSub = this.route.parent.parent.params
      .subscribe((params: { id, loanType }) => {
        if ( params && params.id ) {
          this.loanId = params.id;
          this.loanType = params.loanType;
        }
      });

    this.loan = this.store$.pipe(select(fromRoot.getLoanInfoState));

    this.loanSub = this.store$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe((loanState: ILoanInfo) => {
        if ( loanState.success && loanState.loaded && loanState['loan'] ) {
          this.loanState = loanState;
          if ( loanState['loaded'] && !loanState['error'] && loanState['success'] ) {
            const loanProfile = loanState['loan'];
            this.loanCode = loanProfile['code'];
            const profileType = loanProfile['profile']['type'] === 'PERSON' ? 'people' : 'companies';
            this.breadcrumb = [
              {
                name: loanProfile['profile']['name'],
                link: `/profiles/${profileType}/${loanProfile['profile']['id']}/info`
              },
              {
                name: 'LOANS',
                link: '/loans'
              },
              {
                name: loanProfile['code'],
                link: ''
              },
              {
                name: 'OPERATIONS',
                link: `/loans/${loanProfile['id']}/operations`
              },
              {
                name: 'REPAYMENT',
                link: ''
              }
            ];
            this.installments = loanProfile['installments'];
            this.installmentsTableComponent.isLoading = false;
          }
        }
      });
  }

  cancel() {
    this.repaymentService.announceRepaymentActiveChange(false);
    this.router.navigate(['loans', this.loanId, 'operations']);
  }

  repayModal(data) {
    this.repayData = data;
    this.opened = true;
  }

  closeModal() {
    this.opened = false;
  }

  repay() {
    this.installmentsTableComponent.isLoading = true;
    if ( this.formComponent.repaymentForm.valid ) {
      this.disableBtn(this.submitButton.nativeElement, true);
      this.repaymentService.repay(this.loanId, {
        ...this.repayData,
        date: this.parseDateFormatService.parseDateValue(this.repayData.date),
        earlyRepaymentFee: this.repayData.earlyRepaymentFee ? this.repayData.earlyRepaymentFee : 0,
        timestamp: moment(this.parseDateFormatService.parseDateValue(this.repayData.date))
          .hour(moment().hour()).minute(moment().minute()).second(moment().second()).format().slice(0, 19)
      })
        .subscribe(res => {
          if ( res.error ) {
            this.disableBtn(this.submitButton.nativeElement, false);
            this.toastrService.clear();
            if ( res.message === `You have to actualize contract (ID = ${this.loanId})` ) {
              this.isOpenActualize = true;
            } else {
              this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
            }
          } else {
            this.isSubmitting = true;
            this.loanStore$.dispatch(new fromStore.LoadLoanInfo({id: this.loanId, loanType: this.loanType}));
            this.toastrService.clear();
            this.translate.get('REPAY_SUCCESS').subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['loans', this.loanId, 'schedule']);
          }
          this.installmentsTableComponent.isLoading = false;
        });
    }
  }

  submitActualizeLoan() {
    this.isOpenActualize = false;
    this.installmentsTableComponent.isLoading = true;
    const actualizeDate = this.parseDateFormatService.parseDateValue(this.repayData.date);
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
        this.loanStore$.dispatch(new fromStore.LoadLoanInfo({id: this.loanId, loanType: this.loanType}));
        this.installmentsTableComponent.isLoading = false;
      }
    });
  }

  disableBtn(btn, bool) {
    this.renderer2.setProperty(btn, 'disabled', bool);
  }

  previewSchedule(data) {
    this.disabledRepay = true;
    this.installmentsTableComponent.isLoading = true;
    this.isPreviewing = true;
    if ( this.formComponent.repaymentForm.valid ) {
      this.disableBtn(this.previewButton.nativeElement, true);
      this.repaymentService.preview(this.loanId, {
        repaymentType: data.repaymentType,
        total: parseFloat(data.total),
        interest: parseFloat(data.interest),
        penalty: parseFloat(data.penalty),
        principal: parseFloat(data.principal),
        earlyRepaymentFee: data.earlyRepaymentFee ? parseFloat(data.earlyRepaymentFee) : 0,
        timestamp: moment(this.parseDateFormatService
          .parseDateValue(data.date)).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19)
      })
        .subscribe(res => {
          if ( res.error ) {
            this.disableBtn(this.previewButton.nativeElement, false);
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
            this.disabledRepay = true;
          } else {
            this.disableBtn(this.previewButton.nativeElement, false);
            this.installments = res;
            this.disabledRepay = false;
          }
          this.installmentsTableComponent.isLoading = false;
        });
    }
  }

  resetPreview() {
    this.installmentsTableComponent.isLoading = true;
    this.isPreviewing = false;
    this.setValue('date', moment().format(environment.DATE_FORMAT_MOMENT));
    this.setValue('repaymentType', 'NORMAL_REPAYMENT');
    this.setValue('paymentMethod', '');
    this.setValue('penalty', 0);
    this.setValue('interest', 0);
    this.setValue('principal', 0);
    this.setValue('total', 0);
    this.setValue('earlyRepaymentFee', 0);
    this.previewSchedule(this.formComponent.repaymentForm.getRawValue());
    const repaymentDate = new Date(moment().format(environment.DATE_FORMAT_MOMENT));
    this.formComponent.checkLastActualizeDateValidity(repaymentDate);
    this.changeDisabilityControl('total', true, false, true);
    ['penalty', 'interest', 'principal'].map(control => this.changeDisabilityControl(control, false, false, true));
    this.installmentsTableComponent.isLoading = false;
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

  ngAfterViewInit() {
    this.formChangeSub = this.formComponent.repaymentForm.valueChanges.pipe(
      debounceTime(3000))
      .subscribe(
        data => {
          if ( this.formComponent.repaymentForm.valid ) {
            if ( data.repaymentType === 'NORMAL_MANUAL_REPAYMENT' ) {
              this.installmentsTableComponent.isLoading = false;
              this.onAutoTypeChange(false);
              const principal = this.formComponent.repaymentForm.controls['principal'].value
                ? this.formComponent.repaymentForm.controls['principal'].value
                : 0;
              const interest = this.formComponent.repaymentForm.controls['interest'].value
                ? this.formComponent.repaymentForm.controls['interest'].value
                : 0;
              const penalty = this.formComponent.repaymentForm.controls['penalty'].value
                ? this.formComponent.repaymentForm.controls['penalty'].value
                : 0;
              const earlyRepaymentFee = this.formComponent.repaymentForm.controls['earlyRepaymentFee'].value
                ? this.formComponent.repaymentForm.controls['earlyRepaymentFee'].value
                : 0;
              if ( principal >= 0 && interest >= 0 && penalty >= 0 && earlyRepaymentFee >= 0 ) {
                this.totalAmount = +interest + +principal + +penalty + +earlyRepaymentFee;
              }
              this.totalAmount = this.totalAmount < 0 ? 0 : round(this.totalAmount, 2);

              if ( this.totalAmount <= 0 ) {
                this.setValue('principal', 0);
                this.setValue('interest', 0);
                this.setValue('penalty', 0);
                this.setValue('earlyRepaymentFee', 0);
              }
              if ( principal <= 0 ) {
                this.setValue('principal', 0);
              }
              if ( interest <= 0 ) {
                this.setValue('interest', 0);
              }
              if ( penalty <= 0 ) {
                this.setValue('penalty', 0);
              }
              if ( earlyRepaymentFee <= 0 ) {
                this.setValue('earlyRepaymentFee', 0);
              }

              this.formComponent.repaymentForm.controls['total'].setValue(this.totalAmount, {emitEvent: false, onlySelf: true});
            } else {
              this.onAutoTypeChange(true);
              const repaymentData = {
                repaymentType: data.repaymentType,
                timestamp: moment(this.parseDateFormatService.parseDateValue(data.date))
                  .hour(moment().hour()).minute(moment().minute()).second(moment().second()).format().slice(0, 19)
              };
              if ( this.totalEdited ) {
                if ( data.total > this.maxAmount ) {
                  data.total = this.maxAmount;
                }
                repaymentData['total'] = data.total;

                this.getSplitedData(repaymentData, () => {
                  this.repaymentDate = data.date;
                  this.previewSchedule(this.formComponent.repaymentForm.getRawValue());
                });
              } else if ( this.repaymentDate !== data.date ) {
                this.getSplitedData(repaymentData, () => {
                  this.repaymentDate = data.date;
                  this.previewSchedule(this.formComponent.repaymentForm.getRawValue());
                });
              } else {
                if ( parseFloat(data.penalty) >= 0 ) {
                  const principal = data.total - this.interest - parseFloat(data.penalty) - data.earlyRepaymentFee;
                  if ( principal < 0 ) {
                    this.setValue('principal', this.principal);
                    this.setValue('penalty', this.penalty);
                  } else {
                    this.setValue('principal', principal.toFixed(2));
                  }
                } else {
                  this.setValue('penalty', this.penalty);
                }
                this.previewSchedule(this.formComponent.repaymentForm.getRawValue());
              }
            }
          }
        });

    const initialCheck = {
      repaymentType: 'NORMAL_REPAYMENT',
      timestamp: moment().format().slice(0, 19)
    };
    this.getSplitedData(initialCheck, () => {
      this.previewSchedule(this.formComponent.repaymentForm.getRawValue());
    });
  }

  setMaxAmount() {
    this.totalEdited = true;
    this.formComponent.repaymentForm.controls['total'].setValue(this.maxAmount);
  }

  getSplitedData(data, cb?: Function) {
    this.repaymentService.getPaymentAmount(this.loanId, data)
      .subscribe(res => {
        if ( res.error ) {
          this.toastrService.clear();
          this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          this.setValue('earlyRepaymentFee', 0);
          this.setValue('penalty', 0);
          this.setValue('interest', 0);
          this.setValue('principal', 0);
          this.setValue('total', 0);
        } else {
          this.interest = res.interest;
          this.penalty = res.penalty;
          this.principal = res.principal;
          this.maxAmount = res.max;
          this.setValue('earlyRepaymentFee', res.earlyRepaymentFee);
          this.setValue('penalty', res.penalty);
          this.setValue('interest', res.interest);
          this.setValue('principal', res.principal);
          this.setValue('total', res.total);
          this.onAutoTypeChange(true);
          if ( data.repaymentType === 'EARLY_TOTAL_REPAYMENT' ) {
            this.formComponent.repaymentForm.controls['total'].disable({emitEvent: false, onlySelf: true});
          }
          if ( this.totalEdited ) {
            this.totalEdited = false;
          }
        }
        if ( cb ) {
          cb();
        }
      });
  }

  markTotalAsEdited() {
    this.totalEdited = true;
  }

  markDateAsEdited() {
    this.dateEdited = true;
  }

  setValue(formControl, value) {
    this.formComponent.repaymentForm.controls[formControl].setValue(value, {
      emitEvent: false
    });
  }

  changeDisabilityControl(controlName: string, enable: boolean, emitEvent: boolean, onlySelf: boolean) {
    if ( enable ) {
      this.formComponent.repaymentForm.controls[controlName].enable({emitEvent: emitEvent, onlySelf: onlySelf});
    } else {
      this.formComponent.repaymentForm.controls[controlName].disable({emitEvent: emitEvent, onlySelf: onlySelf});
    }
  }

  onAutoTypeChange(bool) {
    if ( bool ) {
      this.changeDisabilityControl('total', true, false, true);
      ['penalty', 'interest', 'principal', 'earlyRepaymentFee']
        .map(control => this.changeDisabilityControl(control, false, false, true));
    } else {
      this.changeDisabilityControl('total', false, false, true);
      ['penalty', 'interest', 'principal', 'earlyRepaymentFee']
        .map(control => this.changeDisabilityControl(control, true, false, true));
    }
  }

  onChangeRepaymentType() {
    this.installmentsTableComponent.isLoading = true;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.loanSub.unsubscribe();
    this.formChangeSub.unsubscribe();
    this.repaymentService.announceRepaymentActiveChange(false);
    this.formComponent.repaymentForm.reset();
  }
}
