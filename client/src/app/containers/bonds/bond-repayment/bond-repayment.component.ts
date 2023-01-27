import {debounceTime} from 'rxjs/operators';
import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import {BondRepaymentFormComponent} from '../shared/components/bond-repayment-form/bond-repayment-form.component';
import {LoanInstallmentsTableComponent} from '../../../shared/components/cbs-loan-installments-table/loan-installments-table.component';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import {BondState} from '../../../core/store/bond/bond';
import {Store} from '@ngrx/store';
import {BondInstallmentsService} from '../shared/services/bond-installments.service';
import * as moment from 'moment';
import {BondRepaymentService} from '../shared/services/bond-repayment.service';
import {environment} from '../../../../environments/environment';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'cbs-bond-repayment',
  templateUrl: 'bond-repayment.component.html',
  styleUrls: ['bond-repayment.component.scss']
})

export class BondRepaymentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(LoanInstallmentsTableComponent, {static: false}) installmentsTableComponent: LoanInstallmentsTableComponent;
  @ViewChild(BondRepaymentFormComponent, {static: false}) formComponent: BondRepaymentFormComponent;
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
  public bond;

  private formChangeSub: any;
  private bondSub: any;
  private routeSub: any;

  constructor(private bondStore$: Store<BondState>,
              private renderer2: Renderer2,
              private route: ActivatedRoute,
              private router: Router,
              private translate: TranslateService,
              private toastrService: ToastrService,
              private repaymentService: BondRepaymentService,
              private bondInstallmentsService: BondInstallmentsService) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.parent.params.subscribe((params: { id }) => {
      if (params && params.id) {
        this.loanId = params.id;
      }
    });

    this.loan = this.bondStore$.select(fromRoot.getBondState);

    this.bondSub = this.bondStore$.select(fromRoot.getBondState).subscribe(
      (bondState: BondState) => {
        if (bondState['loaded'] && !bondState['error'] && bondState['success']) {
          this.bond = bondState['bond'];
          const bondProfile = bondState['bond']['profile'];
          const profileType = bondProfile['type'] === 'PERSON' ? 'people' : 'companies';
          this.breadcrumb = [
            {
              name: bondProfile['name'],
              link: `/profiles/${profileType['type']}/${bondProfile['id']}/info`
            },
            {
              name: 'BONDS',
              link: `/profiles/${profileType}/${bondProfile['id']}/bonds`
            },
            {
              name: 'REPAYMENT',
              link: ''
            }
          ];
          this.installmentsTableComponent.isLoading = false;
          this.bondInstallmentsService.getBondInstallments(bondState['bond']['id']).subscribe(res => {
            this.installments = res;
          })
        }
      });
  }

  cancel() {
    this.repaymentService.announceRepaymentActiveChange(false);
    this.router.navigate(['bonds', this.loanId, 'operations']);
  }

  repay(data) {
    if (this.formComponent.repaymentForm.valid) {
      this.disableBtn(this.submitButton.nativeElement, true);
      this.repaymentService.repay(this.loanId, {
        ...data
      })
        .subscribe((res: any) => {
          if (res) {
            this.disableBtn(this.submitButton.nativeElement, false);
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.isSubmitting = true;
            this.bondStore$.dispatch(new fromStore.LoadBond(this.loanId));
            this.toastrService.clear();
            this.translate.get('REPAY_SUCCESS').subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['bonds', this.loanId, 'schedule']);
          }
        });
    }
  }

  disableBtn(btn, bool) {
    this.renderer2.setProperty(btn, 'disabled', bool);
  }

  previewSchedule(data) {
    if (this.formComponent.repaymentForm.valid) {
      this.disableBtn(this.previewButton.nativeElement, true);
      this.repaymentService.preview(this.loanId, {
        repaymentType: data.repaymentType,
        total: data.total,
        interest: data.interest,
        penalty: data.penalty,
        principal: data.principal
      })
        .subscribe(res => {
          if (res) {
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

  ngAfterViewInit() {
    let repaymentDate = '';
    this.formChangeSub = this.formComponent.repaymentForm.valueChanges.pipe(
      debounceTime(300))
      .subscribe(data => {
        if (this.formComponent.repaymentForm.valid) {
          const repaymentData = {
            repaymentType: data.repaymentType,
            timestamp: moment(data.date).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19)
          };
          this.getSplitedData(repaymentData, () => {
            if (repaymentDate !== data.date) {
              repaymentDate = data.date;
              this.previewSchedule(this.formComponent.repaymentForm.getRawValue());
            }
          });
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

  getSplitedData(data, cb?: Function) {
    this.repaymentService.getPaymentAmount(this.loanId, data)
      .subscribe((res: any) => {
        if (res) {
          this.toastrService.clear();
          this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          this.setValue('timestamp', '');
          this.setValue('penalty', 0);
          this.setValue('interest', 0);
          this.setValue('principal', 0);
          this.setValue('total', 0);
        } else {
          this.setValue('timestamp', res.timestamp);
          this.setValue('penalty', res.penalty);
          this.setValue('interest', res.interest);
          this.setValue('principal', res.principal);
          this.setValue('total', res.total);
          this.onAutoTypeChange(true);
        }
        if (cb) {
          cb();
        }
      });
  }

  onAutoTypeChange(bool) {
    if (bool) {
      ['penalty', 'interest', 'principal', 'total'].map(control => this.changeDisabilityControl(control, false, false, true));
    } else {
      ['penalty', 'interest', 'principal', 'total'].map(control => this.changeDisabilityControl(control, true, false, true));
    }
  }

  setValue(formControl, value) {
    this.formComponent.repaymentForm.controls[formControl].setValue(value, {
      emitEvent: false
    });
  }

  changeDisabilityControl(controlName: string, enable: boolean, emitEvent: boolean, onlySelf: boolean) {
    if (enable) {
      this.formComponent.repaymentForm.controls[controlName].enable({
        emitEvent: emitEvent,
        onlySelf: onlySelf
      });
    } else {
      this.formComponent.repaymentForm.controls[controlName].disable({
        emitEvent: emitEvent,
        onlySelf: onlySelf
      });
    }
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.bondSub.unsubscribe();
    this.formChangeSub.unsubscribe();
    this.repaymentService.announceRepaymentActiveChange(false);
    this.formComponent.repaymentForm.reset();
  }
}

