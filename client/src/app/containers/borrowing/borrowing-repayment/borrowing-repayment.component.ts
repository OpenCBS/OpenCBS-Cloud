import { debounceTime } from 'rxjs/operators';
import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { BorrowingRepaymentFormComponent } from '../shared/components/borrowing-repayment-form/borrowing-repayment-form.component';
import { LoanInstallmentsTableComponent } from '../../../shared/components/cbs-loan-installments-table/loan-installments-table.component';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { IBorrowingState } from '../../../core/store/borrowings/borrowing';
import { Store } from '@ngrx/store';
import { BorrowingInstallmentsService } from '../shared/services/borrowing-installments.service';
import * as moment from 'moment';
import { BorrowingRepaymentService } from '../shared/services/borrowing-repayment.service';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import {CCRulesFormComponent} from '../../configuration/containers/credit-committee/shared/credit-committee-form.component';

@Component({
  selector: 'cbs-borrowing-repayment',
  templateUrl: 'borrowing-repayment.component.html',
  styleUrls: ['borrowing-repayment.component.scss']
})

export class BorrowingRepaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(LoanInstallmentsTableComponent, {static: false}) installmentsTableComponent: LoanInstallmentsTableComponent;
  @ViewChild(BorrowingRepaymentFormComponent, {static: false}) formComponent: BorrowingRepaymentFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  @ViewChild('previewButton', {static: false}) previewButton: ElementRef;

  public svgData = {
    collection: 'custom',
    class: 'custom41',
    name: 'custom41'
  };
  public breadcrumb = [];
  public installments = [];
  public loan: any;
  public loanId: number;
  public isSubmitting = false;
  public isPreviewing = false;
  public totalEdited = false;
  public borrowing;
  public maxAmount: any;

  private formChangeSub: any;
  private borrowingSub: any;
  private routeSub: any;

  constructor(private borrowingStore$: Store<IBorrowingState>,
              private renderer2: Renderer2,
              private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              private toastrService: ToastrService,
              private repaymentService: BorrowingRepaymentService,
              private borrowingInstallmentsService: BorrowingInstallmentsService) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.parent.params.subscribe((params: { id }) => {
      if ( params && params.id ) {
        this.loanId = params.id;
      }
    });

    this.loan = this.borrowingStore$.select(fromRoot.getBorrowingState);

    this.borrowingSub = this.borrowingStore$.select(fromRoot.getBorrowingState).subscribe(
      (borrowingState: IBorrowingState) => {
        if ( borrowingState['loaded'] && !borrowingState['error'] && borrowingState['success'] ) {
          this.borrowing = borrowingState['borrowing'];
          const borrowingProfile = borrowingState['borrowing']['profile'];
          const profileType = borrowingProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: borrowingProfile['name'],
              link: `/profiles/${profileType['type']}/${borrowingProfile['id']}/info`
            },
            {
              name: 'BORROWINGS',
              link: `/profiles/${profileType}/${borrowingProfile['id']}/borrowings`
            },
            {
              name: 'REPAYMENT',
              link: ''
            }
          ];
          this.installmentsTableComponent.isLoading = false;
          this.borrowingInstallmentsService.getBorrowingInstallments(borrowingState['borrowing']['id']).subscribe(res => {
            this.installments = res;
          })
        }
      });
  }

  cancel() {
    this.repaymentService.announceRepaymentActiveChange(false);
    this.router.navigate(['borrowings', this.loanId, 'operations']);
  }

  repay(data) {
    if ( this.formComponent.repaymentForm.valid ) {
      this.disableBtn(this.submitButton.nativeElement, true);
      this.repaymentService.repay(this.loanId, {
        ...data,
        timestamp: moment(data.date).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19)
      })
        .subscribe(res => {
          if ( res.error ) {
            this.disableBtn(this.submitButton.nativeElement, false);
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.isSubmitting = true;
            this.borrowingStore$.dispatch(new fromStore.LoadBorrowing(this.loanId));
            this.toastrService.clear();
            this.translate.get('REPAY_SUCCESS').subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['borrowings', this.loanId, 'schedule']);
          }
        });
    }
  }

  disableBtn(btn, bool) {
    this.renderer2.setProperty(btn, 'disabled', bool);
  }

  previewSchedule(data) {
    this.isPreviewing = true;
    if ( this.formComponent.repaymentForm.valid ) {
      this.disableBtn(this.previewButton.nativeElement, true);
      this.repaymentService.preview(this.loanId, {
        repaymentType: data.repaymentType,
        total: data.total,
        interest: data.interest,
        penalty: data.penalty,
        principal: data.principal,
        timestamp: moment(data.date).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19)
      })
        .subscribe(res => {
          if ( res.error ) {
            this.disableBtn(this.previewButton.nativeElement, false);
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.disableBtn(this.previewButton.nativeElement, false);
            this.installments = res;
          }
        });
    }
  }

  resetPreview() {
    this.isPreviewing = false;
    this.setValue('date', moment().format(environment.DATE_FORMAT_MOMENT));
    this.setValue('repaymentType', 'NORMAL_REPAYMENT');
    this.setValue('penalty', 0);
    this.setValue('interest', 0);
    this.setValue('principal', 0);
    this.setValue('total', 0);
    this.previewSchedule(this.formComponent.repaymentForm.getRawValue());
    this.changeDisabilityControl('total', true, false, true);
    ['penalty', 'interest', 'principal'].map(control => this.changeDisabilityControl(control, false, false, true));
  }

  ngAfterViewInit() {
    let repaymentDate = '';
    this.formChangeSub = this.formComponent.repaymentForm.valueChanges.pipe(
      debounceTime(300))
      .subscribe(data => {
        if ( this.formComponent.repaymentForm.valid ) {
          if ( data.repaymentType === 'NORMAL_MANUAL_REPAYMENT' ) {
            this.onAutoTypeChange(false);
            const interest = data.interest ? data.interest : 0;
            const principal = data.principal ? data.principal : 0;
            const penalty = data.penalty ? data.penalty : 0;
            const total = +interest + +principal + +penalty;
            if ( total <= 0 ) {
              this.setValue('penalty', 0);
              this.setValue('interest', 0);
              this.setValue('principal', 0);
            }
            this.formComponent.repaymentForm.controls['total'].setValue(total, {emitEvent: false, onlySelf: true});
          } else {
            const repaymentData = {
              repaymentType: data.repaymentType,
              timestamp: moment(data.date).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19)
            };
            if ( this.totalEdited ) {
              if ( data.total > this.maxAmount ) {
                data.total = this.maxAmount;
              }
              repaymentData['total'] = data.total;
            }
            this.getSplitedData(repaymentData, () => {
              if ( repaymentDate !== data.date ) {
                repaymentDate = data.date;
                this.previewSchedule(this.formComponent.repaymentForm.getRawValue());
              }
            });
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
          this.setValue('penalty', 0);
          this.setValue('interest', 0);
          this.setValue('principal', 0);
          this.setValue('total', 0);
        } else {
          this.maxAmount = res.max;
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

  onAutoTypeChange(bool) {
    if ( bool ) {
      this.totalEdited = true;
      this.changeDisabilityControl('total', true, false, true);
      ['penalty', 'interest', 'principal'].map(control => this.changeDisabilityControl(control, false, false, true));
    } else {
      this.changeDisabilityControl('total', false, false, true);
      ['penalty', 'interest', 'principal'].map(control => this.changeDisabilityControl(control, true, false, true));
    }
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

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.borrowingSub.unsubscribe();
    this.formChangeSub.unsubscribe();
    this.repaymentService.announceRepaymentActiveChange(false);
    this.formComponent.repaymentForm.reset();
  }
}

