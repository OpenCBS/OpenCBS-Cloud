import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { ILoanInfo, ILoanMakerCheckerRepayment } from '../../../core/store';
import {
  LoanInstallmentsTableComponent
} from '../../../shared/components/cbs-loan-installments-table/loan-installments-table.component';
import { RepaymentService } from '../shared/services/repayment.service';
import { environment } from '../../../../environments/environment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import {CCRulesFormComponent} from '../../configuration/containers/credit-committee/shared/credit-committee-form.component';
import { Subscription } from 'rxjs';

const SVG_DATA = {
  collection: 'custom',
  class: 'custom41',
  name: 'custom41'
};

@Component({
  selector: 'cbs-loan-repayment-maker-checker',
  templateUrl: './loan-repayment-maker-checker.component.html',
  styleUrls: ['./loan-repayment-maker-checker.component.scss']
})

export class LoanRepaymentMakerCheckerComponent implements OnInit, OnDestroy {
  @ViewChild(LoanInstallmentsTableComponent, {static: false}) installmentsTableComponent: LoanInstallmentsTableComponent;
  public installments: any;
  public svgData = SVG_DATA;
  public breadcrumb = [];
  public maxAmount: any;
  public isLoading: boolean;
  public opened: boolean;

  private loanState: ILoanInfo;
  private loanRepayData: any;
  private loanSub: Subscription;
  private loanRepayMakerCheckerSub: Subscription;


  constructor(private router: Router,
              private loanInfoStore$: Store<ILoanInfo>,
              private store$: Store<fromRoot.State>,
              private translate: TranslateService,
              private toastrService: ToastrService,
              private loanMakerCheckerRepaymentStore$: Store<ILoanMakerCheckerRepayment>,
              private repaymentService: RepaymentService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.loanSub = this.loanInfoStore$.pipe(select(fromRoot.getLoanInfoState)).subscribe(
      (loanState: ILoanInfo) => {
        if (loanState.success && loanState.loaded && loanState['loan']) {
          this.loanState = loanState;
          if (loanState['loaded'] && !loanState['error'] && loanState['success']) {
            const loanProfile = loanState['loan']['profile'];
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
                name: loanState['loan']['code'],
                link: `/loans/${loanState['loan']['id']}/${profileType}/info`
              },
              {
                name: 'MAKER/CHECKER REPAYMENT',
                link: ''
              }
            ];
            this.isLoading = false;
          }
        }
      });

    setTimeout(() => {
      this.loanInfoStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
    }, 1500);

    this.loanRepayMakerCheckerSub = this.store$.pipe(select(fromRoot.getLoanMakerCheckerRepaymentState))
      .subscribe(
        (loanMakerCheckerRepaymentState: ILoanMakerCheckerRepayment) => {
          if ( loanMakerCheckerRepaymentState.loaded && loanMakerCheckerRepaymentState.success ) {
            this.loanRepayData = loanMakerCheckerRepaymentState.loanMakerCheckerRepayment;
            this.repaymentService.preview(this.loanRepayData.id, {
              repaymentType: this.loanRepayData.repaymentType,
              total: this.loanRepayData.total,
              interest: this.loanRepayData.interest,
              penalty: this.loanRepayData.penalty,
              principal: this.loanRepayData.principal,
              timestamp: moment(this.loanRepayData.date).hour(moment().hour()).minute(moment().minute()).format().slice(0, 19)
            })
              .subscribe(res => {
                if (res.error) {
                  this.toastrService.clear();
                  this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
                } else {
                  this.installments = res;
                }
                this.installmentsTableComponent.isLoading = false;
              });
          }
        });
  }

  ngOnDestroy() {
    this.loanSub.unsubscribe();
  }
}
