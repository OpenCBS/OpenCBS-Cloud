import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { LoanProductState } from '../../../../../core/store/loan-products';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../../../core/services';


@Component({
  selector: 'cbs-info-loan-product',
  templateUrl: 'loan-product-info.component.html',
  styleUrls: ['loan-product-info.component.scss']
})
export class LoanProductInfoComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public loanProduct: any;
  public loanProductState: LoanProductState;
  public entryFees;
  public penalties;
  public provisioning;
  public currentInstance: string;

  private loanProductsSub: Subscription;

  constructor(private loanProductStore$: Store<LoanProductState>,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.currentInstance = this.commonService.getData();
    this.loanProductsSub = this.loanProductStore$.pipe(select(fromRoot.getLoanProductState))
      .subscribe((loanProductState: LoanProductState) => {
        if ( loanProductState.success && loanProductState.loaded && loanProductState.loanProduct ) {
          this.loanProductState = loanProductState;
          this.loanProduct = loanProductState.loanProduct;
          this.breadcrumb = [
            {
              name: 'CONFIGURATION',
              link: '/configuration'
            },
            {
              name: 'LOAN PRODUCTS',
              link: '/configuration/loan-products'
            },
            {
              name: `${this.loanProduct.name}`,
              link: `/configuration/loan-products/ ${this.loanProduct.id}`
            },
            {
              name: 'INFO',
              link: ''
            }
          ];
          this.entryFees = this.loanProduct['fees'];
          this.penalties = this.loanProduct['penalties'];
          this.provisioning = this.loanProduct['provisioning'];
        }
      });

    setTimeout(() => {
      this.loanProductStore$.dispatch(new fromStore.SetLoanProductBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  ngOnDestroy() {
    this.loanProductsSub.unsubscribe();
  }

  checkAvailability(type) {
    return this.loanProduct['availability'].length ? this.loanProduct['availability'].indexOf(type) !== -1 : false;
  }
}
