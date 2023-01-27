import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ILoanInfo } from '../../../core/store';
import { ActivatedRoute } from '@angular/router';
import { LoanDashboardService } from './service/loan-dashboard.service';
import { Subscription } from 'rxjs/Rx';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'cbs-loan-info',
  templateUrl: 'loan-dashboard.component.html',
  styleUrls: ['loan-dashboard.component.scss']
})

export class LoanDashboardComponent implements OnInit, OnDestroy {
  public breadcrumbPart: string;
  public breadcrumb = [];
  public isLoading = false;
  public loanProfile: any;
  public profileType: any;

  public routeSub: Subscription;
  private loanInfoSub: Subscription;

  constructor(private loanStore$: Store<ILoanInfo>,
              private store$: Store<fromRoot.State>,
              private loanDashboardService: LoanDashboardService,
              public toastrService: ToastrService,
              public translate: TranslateService,
              public route: ActivatedRoute) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.routeSub = this.route.parent.params.subscribe((params: { id: number, loanType }) => {
      if ( params && params.id ) {
        this.loanStore$.dispatch(new fromStore.LoadLoanInfo({id: params.id, loanType: params.loanType}));
        this.getReportData({
          reportName: 'loan_dashboard',
          fieldsValues: {loanId: params.id, format: 'HTML'}
          })
      }
    });

    this.loanInfoSub = this.store$.pipe(select(fromRoot.getLoanInfoState))
      .subscribe(loan => {
        if ( loan['loaded'] && !loan['error'] && loan['success'] ) {
          const loanId = loan['loan']['loanApplicationId'];
          this.loanProfile = loan['loan']['profile'];
          this.profileType = this.loanProfile['type'] === 'PERSON' ? 'people'
            : this.loanProfile['type'] === 'COMPANY' ? 'companies'
              : 'groups';
          this.breadcrumbPart = this.profileType === 'groups' ? 'LOAN APPLICATION ' + loanId : loan['loan']['code'];

          this.breadcrumb = [
            {
              name: this.loanProfile['name'],
              link: `/profiles/${this.profileType}/${this.loanProfile['id']}/info`
            },
            {
              name: 'LOANS',
              link: '/loans'
            },
            {
              name: this.breadcrumbPart,
              link: ''
            },
            {
              name: 'LOAN_DASHBOARD',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(this.breadcrumb));
    }, 3000);
  }

  getReportData(objToSend) {
    this.isLoading = true;
    this.loanDashboardService.getHtmlFile(objToSend).subscribe(a => {
      if ( a['err'] ) {
        this.isLoading = false;
        this.translate.get('CREATE_ERROR').subscribe((res: string) => {
          this.toastrService.error(a['err'], res, environment.ERROR_TOAST_CONFIG);
        });
      } else {
        document.getElementById('content').innerHTML = `<object type="type/html" data="${a}" ></object>`
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.loanInfoSub.unsubscribe();
    this.routeSub.unsubscribe();
  }
}
