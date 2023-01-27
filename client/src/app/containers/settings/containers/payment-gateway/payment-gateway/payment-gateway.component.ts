import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store/index';
import {
  IPaymentGateway,
  IPaymentGatewayState,
  PaymentGatewayService
} from '../../../../../core/store/index';
import { isEmpty } from 'lodash'
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Subscription } from 'rxjs/Rx';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import * as FileSaver from 'file-saver';

const SVG_DATA = {collection: 'standard', class: 'service-report', name: 'service_report'};

const BREADCRUMB = [{
  name: 'SETTINGS',
  link: '/settings'
},
  {
    name: 'PAYMENT_GATEWAY',
    link: '/payment-gateway'
  }];

@Component({
  selector: 'cbs-integration-oxus',
  templateUrl: 'payment-gateway.component.html',
  styleUrls: ['payment-gateway.component.scss']
})

export class PaymentGatewayComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public form: FormGroup;
  public startDate: any;
  public paymentGatewayData: IPaymentGatewayState;
  public isLoading = false;
  public selectedLoanList = [];
  public breadcrumb = BREADCRUMB;
  private MONTH_AGO = moment().startOf('month').format('YYYY-MM-DD');
  public queryObject = {
    fromDate: this.MONTH_AGO,
    toDate: moment().format('YYYY-MM-DD'),
  };

  private paramsSub: Subscription;
  private loanRepaySub: Subscription;

  constructor(private route: ActivatedRoute,
              private fb: FormBuilder,
              private store$: Store<fromRoot.State>,
              private integrationWithOxusService: PaymentGatewayService,
              private router: Router,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private paymentGatewayStateStore$: Store<IPaymentGatewayState>) {
  }

  ngOnInit() {
    this.loadTransaction();
    this.loanRepaySub = this.paymentGatewayStateStore$.select(fromRoot.getPaymentGatewayState)
      .subscribe(
        (state: IPaymentGatewayState) => {
          if ( state.loaded && state.success && !state.error ) {
            this.paymentGatewayData = state;
            if ( this.paymentGatewayData.loans.length ) {
              this.paymentGatewayData.loans.map(
                (loan: IPaymentGateway) => {
                  if ( loan.isUploaded === false ) {
                    this.selectedLoanList.push(loan);
                  }
                });
            }
          }
        })

    this.paramsSub = this.route.queryParams
      .subscribe(query => {
        this.queryObject = {
          fromDate: !isEmpty(query) ? query['fromDate'] : this.MONTH_AGO,
          toDate: !isEmpty(query) ? query['toDate'] : moment().format('YYYY-MM-DD')
        };
        this.paymentGatewayStateStore$.dispatch(new fromStore.LoadPaymentGateway(this.queryObject));
      });

    this.form = this.fb.group({
      start: new FormControl(this.MONTH_AGO, Validators.required),
      end: new FormControl(moment().format('YYYY-MM-DD'), Validators.required),
    });
  }

  loadTransaction() {
    this.startDate = this.MONTH_AGO;
    this.paymentGatewayStateStore$.dispatch(new fromStore.LoadPaymentGateway(this.queryObject));
  }

  filter() {
    this.startDate = this.form.controls['start'].value;
    this.paymentGatewayStateStore$.dispatch(new fromStore.ResetPaymentGateway());
    this.queryObject = {
      fromDate: this.form.value.start,
      toDate: this.form.value.end
    };
    this.paymentGatewayStateStore$.dispatch(new fromStore.LoadPaymentGateway(this.queryObject));
  }

  export() {
    this.isLoading = true;
    const sendExportData = [];
    this.selectedLoanList.map(
      (loan: IPaymentGateway) => {
        sendExportData.push(loan.id);
      });
    this.integrationWithOxusService.updateLoanList(sendExportData)
      .subscribe(res => {
        if ( res.error ) {
          this.toastrService.clear();
          this.toastrService.error(`ERROR: ${res.error.message}`, '', environment.ERROR_TOAST_CONFIG);
          this.isLoading = false;
        } else {
          FileSaver.saveAs(res, `${this.form.value.start} - ${this.form.value.end}.xlsx`)
          this.translate.get('SUCCESS').subscribe((translation: string) => {
            this.toastrService.success(translation, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.isLoading = false;
          this.filter();
        }
      });
  }

  rowStyleClass(row) {
    if ( row.isUploaded === true ) {
      return 'paid';
    } else {
      return ''
    }
  }

  ngOnDestroy() {
    this.paramsSub.unsubscribe();
    this.paymentGatewayStateStore$.dispatch(new fromStore.ResetPaymentGateway());
  }
}
