import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  ILoanAppFormState
} from '../../../core/store/loan-application';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { LoanAppFormExtraService } from '../shared/services/loan-app-extra.service';
import { Router } from '@angular/router';
import { ILoanAppState } from '../../../core/store/loan-application/loan-application/loan-application.reducer';
import { Subscription } from 'rxjs';
import { IProfile } from '../../../core/store';

@Component({
  selector: 'cbs-loan-application-info',
  templateUrl: 'loan-application-info.component.html',
  styleUrls: ['loan-application-info.component.scss']
})
export class LoanApplicationInfoComponent implements OnInit, OnDestroy {
  public loanApp: ILoanAppFormState;
  public isOpen = false;
  public totalEntryFees = 0;
  public profile: any;
  public netAmount: number;
  public total: number;
  public profileType: any;
  public loanAppState: any;
  public loan: any;
  public breadcrumb = [];

  private loanAppFormSub: Subscription;
  private loanApplicationSub: Subscription;

  constructor(private loanAppFormStore$: Store<ILoanAppFormState>,
              private store$: Store<fromRoot.State>,
              private profileStore$: Store<IProfile>,
              private loanAppExtraService: LoanAppFormExtraService,
              private loanApplicationStore$: Store<ILoanAppState>,
              private router: Router) {
  }

  ngOnInit() {
    this.loanAppFormStore$.dispatch(new fromStore.SetState('info'));

    this.loanAppFormSub = this.store$.pipe(select(fromRoot.getLoanAppFormState)).subscribe(
      (state: ILoanAppFormState) => {
        if (state.loaded) {
          this.loanApp = state;
          this.netAmount = this.loanApp.data.amounts.reduce(function(prev, cur) {
            return prev + cur['amount'];
          }, 0);

          this.total = this.loanApp.total.reduce(function(prev, cur) {
            return prev + cur['amount'];
          }, 0);
          this.totalEntryFees = this.getTotal(state.entryFees);
        }
      });

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState)).subscribe(
      (loanAppState: ILoanAppState) => {
        if (loanAppState.loaded && loanAppState.success) {
          this.loanAppState = loanAppState;
          this.loan = this.loanAppState['loanApplication']['loan'];
          this.profile = this.loanAppState['loanApplication']['profile'];
          this.profileType = this.profile['type'] === 'PERSON' ? 'people' : this.profile['type'] === 'COMPANY' ? 'companies' : 'groups';
          this.profileStore$.dispatch(new fromStore.LoadProfileInfo({id:  this.profile.id, type:  this.profileType}));
          this.breadcrumb = [
            {
              name: this.profile['name'],
              link: `/profiles/${this.profileType}/${this.profile['id']}/info`
            },
            {
              name: 'LOAN_APPLICATIONS',
              link: '/loan-applications'
            },
            {
              name: this.loanAppState['loanApplication']['code'],
              link: ''
            },
            {
              name: 'INFO',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.loanAppFormStore$.dispatch(new fromStore.SetBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  goToProfile() {
    this.router.navigate(['/profiles', this.profileType, this.profile['id'], 'info']);
  }

  goToLoan(loan) {
    let loanType = '';
    if ( loan.profile.type === 'GROUP' ) {
      loanType = 'GROUP';
    } else {
      loanType = loan.profile.type;
    }
    this.router.navigate(['/loans', loan.id, `${loanType}`.toLowerCase(), 'info']);
  }

  openEntryFees() {
    this.isOpen = true;
  }

  getTotal(data = []) {
    let total = 0;
    if (data && data.length) {
      data.map((item) => {
        total += item.amount;
      });
    }
    return total;
  }

  ngOnDestroy() {
    this.loanAppFormSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
  }
}
