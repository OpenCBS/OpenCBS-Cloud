import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ActivatedRoute, Router } from '@angular/router';
import { RepaymentService } from '../../loan/shared/services/repayment.service';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TillOperationLoanRepayService } from '../shared/till-operation-loan-repay.service';
import { TranslateService } from '@ngx-translate/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ILoanInfo } from '../../../core/store/loans/loan';
import * as FileSaver from 'file-saver';
import { CommonService } from '../../../core/services';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs/Rx';
import { round } from 'lodash'

const SVG_DATA = {collection: 'custom', class: 'custom41', name: 'custom41'};

@Component({
  selector: 'cbs-till-operation-loans-repay-for-kazmicro',
  templateUrl: 'till-operation-loans-repay-for-kazmicro.component.html',
  styleUrls: ['till-operation-loans-repay-for-kazmicro.component.scss'],
  providers: [CommonService]
})

export class TillOperationLoansRepayForKazmicroComponent implements OnInit, AfterViewInit, OnDestroy {
  public svgData = SVG_DATA;
  public repayForm: FormGroup;
  public loanId: number;
  public tillId: number;
  public loanEntityInfo: any;
  public loan: any;
  public loanCode: any;
  public selectLabel = 'SELECT';
  public typeInstance: string;
  public profile: any;
  public formConfig = {
    profileLookupUrl: {url: `${environment.API_ENDPOINT}profiles`},
    paymentMethod: {url: `${environment.API_ENDPOINT}payment-methods/lookup`}
  };
  public repaymentTypeList = [
    {
      value: 'NORMAL_REPAYMENT',
      name: 'Normal Repayment'
    }
  ];
  public breadcrumbLinks = [];
  public isLoading = false;
  public enteredAmount: number;

  private amountToPay: number;
  private timeStamp: any;
  private routeTillSub: Subscription;
  private routeLoanSub: Subscription;
  private loanInfoSub: Subscription;

  constructor(private fb: FormBuilder,
              private repaymentService: RepaymentService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private store$: Store<fromRoot.State>,
              private loanInfoStore$: Store<ILoanInfo>,
              private router: Router,
              private tillOperationLoanRepayService: TillOperationLoanRepayService,
              private route: ActivatedRoute,
              private httpClient: HttpClient,
              private commonService: CommonService,
              private cdr: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.typeInstance = this.commonService.getData();
    this.routeLoanSub = this.route.params
      .subscribe(
        (params: { id, loanType }) => {
          this.loanId = params.id;
          this.loanInfoStore$.dispatch(new fromStore.LoadLoanInfo({id: params.id, loanType: params.loanType}));
        });

    this.loanInfoSub = this.store$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loan => {
        if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
          this.loan = loan.loan;
          this.profile = this.loan.profile;
          this.loanEntityInfo = this.loan.loanAdditionalInfoEntity;
          this.loanCode = this.loan.code;
          this.selectLabel = this.profile.name;
          this.createForm();
          this.routeTillSub = this.route.parent.params
            .subscribe(
              till => {
                this.tillId = till.id;
                this.breadcrumbLinks = [
                  {
                    name: 'TELLER_MANAGEMENT',
                    link: '/till'
                  },
                  {
                    name: 'OPERATIONS',
                    link: `/till/${this.tillId}/operations`
                  },
                  {
                    name: 'LOANS',
                    link: `/till/${this.tillId}/loans`
                  },
                  {
                    name: 'REPAYMENT',
                    link: ''
                  },
                  {
                    name: this.loanCode,
                    link: ''
                  }
                ];
              });
        }
      });

    setTimeout(() => {
      this.isLoading = false;
    }, 1000);
  }

  createForm() {
    const timestamp = moment().format(environment.DATE_FORMAT_MOMENT + environment.TIME_FORMAT)
    this.repayForm = this.fb.group({
      repaymentType: new FormControl(this.repaymentTypeList[0]['value'], Validators.required),
      paidBy: new FormControl(this.profile.id, Validators.required),
      paymentMethod: new FormControl('', Validators.required),
      total: new FormControl({value: '', disabled: true}, Validators.required),
      enteredAmount: new FormControl('', Validators.required),
      amountToPay: new FormControl({value: '', disabled: true}, Validators.required),
      principal: new FormControl({value: '', disabled: true}, Validators.required),
      interest: new FormControl({value: '', disabled: true}, Validators.required),
      penalty: new FormControl({value: '', disabled: true}, Validators.required),
      description: new FormControl('', Validators.required),
      autoPrint: new FormControl(''),
      timestamp: new FormControl(timestamp, Validators.required)
    });
  }

  setLookupValue(paidBy) {
    if ( paidBy && paidBy.id ) {
      this.repayForm.controls['paidBy'].setValue(+paidBy.id);
    } else {
      this.repayForm.controls['paidBy'].setValue('');
    }
  }

  ngAfterViewInit() {
    this.timeStamp =
      moment(this.repayForm.controls['timestamp'].value).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19);
    const repaymentData = {
      repaymentType: this.repayForm.controls['repaymentType'].value,
      timestamp: this.timeStamp
    };
    this.getSplitData(repaymentData)
  }

  getSplitData(data) {
    this.repaymentService.getPaymentAmount(this.loanId, data)
      .subscribe(
        res => {
          if ( res.error ) {
            this.toastrService.clear();
            this.toastrService.error(res.message, '', environment.ERROR_TOAST_CONFIG);
            this.setValue('penalty', 0);
            this.setValue('interest', 0);
            this.setValue('principal', 0);
            this.setValue('amountToPay', 0);
            this.setValue('enteredAmount', 0);
            this.setValue('total', 0);
          } else {
            if ( !this.enteredAmount ) {
              this.enteredAmount = res.total;
            }
            if ( res.total > parseFloat(String(this.enteredAmount)) ) {
              this.amountToPay = parseFloat(String(this.enteredAmount));
            } else if ( res.total < parseFloat(String(this.enteredAmount)) || res.total === parseFloat(String(this.enteredAmount)) ) {
              this.amountToPay = res.total;
            } else if ( res.total === 0 ) {
              this.amountToPay = 0
            }
            this.setValue('penalty', res.penalty);
            this.setValue('interest', res.interest);
            this.setValue('principal', res.principal);
            this.setValue('amountToPay', round(this.amountToPay, 2));
            this.setValue('enteredAmount', this.enteredAmount);
            this.setValue('total', res.total);
          }
        });
    this.cdr.detectChanges();
  }

  setValue(formControl, value) {
    this.repayForm.controls[formControl].setValue(value, {
      emitEvent: true
    });
  }

  getSplitDataWithTotal(event?) {
    if ( event ) {
      this.enteredAmount = event;
      this.timeStamp =
        moment(this.repayForm.controls['timestamp'].value).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19);
      const repaymentData = {
        repaymentType: this.repayForm.controls['repaymentType'].value,
        timestamp: this.timeStamp,
        total: this.repayForm.controls['total'].value
      };
      if ( repaymentData.total === '' ) {
        const repaymentNewData = {
          ...repaymentData,
          total: 0
        };
        this.getSplitData(repaymentNewData)
      } else {
        this.getSplitData(repaymentData)
      }
    } else {
      this.timeStamp =
        moment(this.repayForm.controls['timestamp'].value).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19);
      const repaymentData = {
        repaymentType: this.repayForm.controls['repaymentType'].value,
        timestamp: this.timeStamp,
      };
      this.getSplitData(repaymentData);
    }
  }

  repay() {
    this.isLoading = true;
    this.setValue('timestamp', this.timeStamp);
    const kazmicroRepaymentTellerData = {
      operationDto: {
        id: this.profile.currentAccounts[0].id,
        amount: this.enteredAmount,
        description: this.repayForm.value.description,
        profileId: this.profile.id,
        initiatorId: this.profile.id,
        date: this.timeStamp,
        initiator: null,
        isProfileExist: true,
        autoPrint: ''
      },
      repaymentSplit: {
        autoPrint: this.repayForm.value.autoPrint,
        description: this.repayForm.value.description,
        total: round(this.amountToPay, 2),
        paidBy: this.repayForm.value.paidBy,
        paymentMethod: this.repayForm.value.paymentMethod,
        repaymentType: this.repayForm.value.repaymentType,
        timestamp: this.timeStamp
      }
    }


    this.tillOperationLoanRepayService.repayLoanFromTillKazmicro(this.loanId, kazmicroRepaymentTellerData, this.tillId)
      .subscribe(
        res => {
          if ( res.message ) {
            this.toastrService.clear();
            this.translate.get('CREATE_ERROR')
              .subscribe(
                (response: string) => {
                  this.toastrService.error(res.message, response, environment.ERROR_TOAST_CONFIG);
                });
          } else {
            if ( this.repayForm.controls['autoPrint'].value ) {
              FileSaver.saveAs(res, `cash-receipt.docx`);
            }
            this.toastrService.clear();
            this.router.navigate(['/till', this.tillId, 'operations']);
            this.translate.get('REPAY_SUCCESS')
              .subscribe(
                (message: string) => {
                  this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
                });
          }
          this.isLoading = false;
        });
  }

  ngOnDestroy() {
    this.routeLoanSub.unsubscribe();
    this.loanInfoSub.unsubscribe();
    if ( this.routeTillSub ) {
      this.routeTillSub.unsubscribe()
    }
  }
}
