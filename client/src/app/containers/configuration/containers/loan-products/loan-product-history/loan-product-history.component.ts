import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromStore from '../../../../../core/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { LoanProductHistoryState } from '../../../../../core/store/loan-products/loan-product-history';
import { LoanProductState } from '../../../../../core/store/loan-products/loan-product';
import { Subscription } from 'rxjs';

@Component({
  selector: 'cbs-history-loan-product',
  templateUrl: 'loan-product-history.component.html',
  styleUrls: ['loan-product-history.component.scss']
})
export class LoanProductHistoryComponent implements OnInit, OnDestroy {
  public loanProductHistoryState: any;
  public loanProductState: any;
  public loanProductId: number;
  public loanProduct: any;
  public isLoading = false;
  public breadcrumb = [];
  public historyList: any;
  public loanProductHistory: any;

  private loanProductHistorySub: Subscription;
  private loanProductSub: Subscription;

  constructor(private loanProductStore$: Store<LoanProductState>,
              private loanProductHistoryStore$: Store<LoanProductHistoryState>,
              private store$: Store<fromRoot.State>) {
  }

  ngOnInit() {
    this.historyList = this.store$.pipe(select(fromRoot.getLoanProductHistoryState));
    this.loanProductSub = this.store$.pipe(select(fromRoot.getLoanProductState)).subscribe(
      (loanProductState: LoanProductState) => {
        if (loanProductState.success && loanProductState.loaded && loanProductState.loanProduct) {
          this.loanProductState = loanProductState;
          this.loanProduct = loanProductState.loanProduct;
          this.loanProductId = loanProductState.loanProduct['id'];
          this.getLPHistoryList(this.loanProductId);

          this.breadcrumb = [
            {
              name: 'LOAN PRODUCTS',
              link: '/configuration/loan-products'
            },
            {
              name: `${this.loanProduct.name}`,
              link: `/loan-products/${this.loanProduct.id}/info`
            },
            {
              name: 'HISTORY',
              link: ''
            }
          ];
        }
      });

    this.loanProductStore$.dispatch(new fromStore.SetLoanProductBreadcrumb(this.breadcrumb));

    this.loanProductHistorySub = this.loanProductHistoryStore$.pipe(select(fromRoot.getLoanProductHistoryState))
      .subscribe((loanProductHistoryState: LoanProductHistoryState) => {
        this.loanProductHistoryState = loanProductHistoryState;
        this.loanProductHistory = loanProductHistoryState.loanProductHistory;
      });
  }

  getLPHistoryList(loanProductId) {
    this.loanProductHistoryStore$.dispatch(new fromStore.LoadLoanProductHistory(loanProductId));
  }

  ngOnDestroy() {
    this.loanProductSub.unsubscribe();
    this.loanProductHistorySub.unsubscribe();
  }
}
