import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import { ILoanInfo, ILoanAppState } from '../../../core/store';
import * as fromRoot from '../../../core/core.reducer';
import * as fromStore from '../../../core/store';

@Component({
  selector: 'cbs-loan-entry-fees',
  templateUrl: 'loan-entry-fees.component.html',
  styleUrls: ['loan-entry-fees.component.scss']
})

export class LoanEntryFeesComponent implements OnInit, OnDestroy {
  public breadcrumb: any;
  public entryFees = [];

  private routeSub: any;
  private loanApplicationSub: any;

  constructor(private loanStore$: Store<ILoanInfo>,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.routeSub = this.route.parent.params.subscribe((params: { id }) => {
      if (params && params.id) {
        const loanId = params.id;
        const breadcrumb = [
          {
            name: 'LOANS',
            link: '/loans'
          },
          {
            name: `${loanId}`,
            link: ''
          },
          {
            name: 'ENTRY_FEES',
            link: ''
          }
        ];
        this.loanStore$.dispatch(new fromStore.SetLoanBreadcrumb(breadcrumb));
      }
    });

    this.loanApplicationSub = this.store$.pipe(select(fromRoot.getLoanApplicationState))
      .subscribe((loanAppState: ILoanAppState) => {
        if (loanAppState.success && loanAppState.loaded && loanAppState.loanApplication) {
          this.entryFees = loanAppState.loanApplication['entryFees'];
        }
      });
  }

  getTotal() {
    let total = 0;
    this.entryFees.map(fee => {
      total += fee.amount ? fee.amount : 0;
    });

    return total;
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.loanApplicationSub.unsubscribe();
  }
}
