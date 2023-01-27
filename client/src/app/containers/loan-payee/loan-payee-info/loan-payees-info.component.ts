import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ILoanPayee } from '../../../core/store/loan-payees';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';
import { ActivatedRoute } from '@angular/router';
import { ILoanAppState } from '../../../core/store';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cbs-loan-payees-info',
  templateUrl: 'loan-payees-info.component.html'
})

export class LoanPayeesInfoComponent implements OnInit, OnDestroy {
  public breadcrumb: any;
  public payee: any;
  public isLoading = false;

  private payeeName: any;
  private payeeId: number;
  private loanId: number;
  private profileType: string;
  private paramsSub: Subscription;
  private loanApplicationSub: Subscription;
  private loanPayeeSub: Subscription;

  constructor(private store$: Store<fromRoot.State>,
              private route: ActivatedRoute,
              private loanApplicationStore$: Store<ILoanAppState>,
              private loanPayeeStore$: Store<ILoanPayee>) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.paramsSub = this.route.queryParams.subscribe(query => {
      if (query && query.loanAppId) {
        this.loanApplicationStore$.dispatch(new fromStore.LoadLoanApplication(query.loanAppId));
      }
    });

    this.loanPayeeSub = this.store$.pipe(select(fromRoot.getLoanPayeeState))
      .subscribe((loanPayeeState: ILoanPayee) => {
        if (loanPayeeState.loaded && loanPayeeState.success && loanPayeeState.payee) {
          this.payee = loanPayeeState;
          this.payeeId = this.payee['payee']['id'];
          this.payeeName = this.payee['payee']['payeeName'];
        }
    });

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
        if ( loanAppState.success && loanAppState.loaded && loanAppState.loanApplication ) {
          this.loanId = loanAppState.loanApplication['loan'].id;
          this.profileType = loanAppState.loanApplication['profile'].profileType;
          this.breadcrumb = [
            {
              name: 'PAYEES',
              link: `/loans/${this.loanId}/${this.profileType}/payees`
            },
            {
              name: this.payeeName,
              link: `/payees/${this.payeeId}/info`
            },
            {
              name: 'INFORMATION',
              link: ''
            }
          ];
          this.loanPayeeStore$.dispatch(new fromStore.SetLoanPayeeBreadcrumb(this.breadcrumb));
          this.isLoading = false;
        }
      });
  }

  ngOnDestroy() {
    this.loanApplicationSub.unsubscribe();
    this.loanPayeeSub.unsubscribe();
  }
}
