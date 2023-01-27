import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import {
  ILoanAppFormState
} from '../../../core/store/loan-application';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { Router } from '@angular/router';
import { ILoanAppState } from '../../../core/store/loan-application/loan-application/loan-application.reducer';

@Component({
  selector: 'cbs-loan-app-maker-checker-disburse',
  templateUrl: 'loan-app-maker-checker-disburse.component.html',
  styleUrls: ['loan-app-maker-checker-disburse.component.scss']
})

export class LoanAppMakerCheckerDisburseComponent implements OnInit, OnDestroy {
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

  private loanAppFormSub: any;
  private loanApplicationSub: any;

  constructor(private loanAppFormStore$: Store<ILoanAppFormState>,
              private store$: Store<fromRoot.State>,
              private loanApplicationStore$: Store<ILoanAppState>,
              private router: Router) {
  }

  ngOnInit() {
    this.loanAppFormStore$.dispatch(new fromStore.SetState('info'));

    this.loanAppFormSub = this.store$.pipe(select(fromRoot.getLoanAppFormState))
      .subscribe(
        (state: ILoanAppFormState) => {
          if ( state.loaded ) {
            this.loanApp = state;
            this.netAmount = this.loanApp.data.amounts.reduce(function (prev, cur) {
              return prev + cur['amount'];
            }, 0);

            this.total = this.loanApp.total.reduce(function (prev, cur) {
              return prev + cur['amount'];
            }, 0);
            this.totalEntryFees = this.getTotal(state.entryFees);
          }
        });

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe(
        (loanAppState: ILoanAppState) => {
          if ( loanAppState.loaded && loanAppState.success ) {
            this.loanAppState = loanAppState;
            this.loan = this.loanAppState['loanApplication']['loan'];
            this.profile = this.loanAppState['loanApplication']['profile'];
            this.profileType = this.profile['type'] === 'PERSON' ? 'people' : this.profile['type'] === 'COMPANY' ? 'companies' : 'groups';
            this.breadcrumb = [
              {
                name: this.profile['name'],
                link: `/profiles/${this.profileType}/${this.profile['id']}/info`
              },
              {
                name: 'LOAN APPLICATIONS',
                link: '/loan-applications'
              },
              {
                name: this.loanAppState['loanApplication']['code'],
                link: ''
              },
              {
                name: 'MAKER/CHECKER',
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

  goToLoan() {
    this.router.navigate(['/loans', this.loan['id'], 'info']);
  }

  openEntryFees() {
    this.isOpen = true;
  }

  getTotal(data = []) {
    let total = 0;
    if ( data && data.length ) {
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
