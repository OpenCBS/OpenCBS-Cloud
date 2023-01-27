import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { LoanProductMakerCheckerState } from '../../../../../core/store/loan-products';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../../../core/services';


@Component({
  selector: 'cbs-info-loan-product-maker-checker',
  templateUrl: 'loan-product-maker-checker.component.html',
  styleUrls: ['loan-product-maker-checker.component.scss']
})
export class LoanProductMakerCheckerComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public loanProduct: any;
  public loanProductMakerCheckerState: LoanProductMakerCheckerState;
  public loanProductId: number;
  public entryFees;
  public penalties;
  public provisioning;
  public currentInstance: string;

  private loanProductsSub: Subscription;

  constructor(private loanProductMakerCheckerStore$: Store<LoanProductMakerCheckerState>,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.currentInstance = this.commonService.getData();
    this.loanProductsSub = this.loanProductMakerCheckerStore$.pipe(select(fromRoot.getLoanProductMakerCheckerState))
      .subscribe((loanProductMakerCheckerState: LoanProductMakerCheckerState) => {
        this.loanProductMakerCheckerState = loanProductMakerCheckerState;
        this.loanProduct = loanProductMakerCheckerState.loanProduct;
        if ( loanProductMakerCheckerState.success && loanProductMakerCheckerState.loaded && loanProductMakerCheckerState.loanProduct ) {
          this.breadcrumb = [
            {
              name: 'CONFIGURATION',
              link: '/configuration'
            },
            {
              name: 'LOAN PRODUCT',
              link: '/configuration/loan-products'
            },
            {
              name: `${this.loanProduct.code}`,
              link: `/configuration/loan-products/ ${this.loanProduct.id}`
            },
            {
              name: 'MAKER/CHECKER',
              link: ''
            }
          ];
          this.entryFees = this.loanProduct['fees'];
          this.penalties = this.loanProduct['penalties'];
          this.provisioning = this.loanProduct['provisioning'];
        }
      });

    setTimeout(() => {
      this.loanProductMakerCheckerStore$.dispatch(new fromStore.SetLoanProductMakerCheckerBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  ngOnDestroy() {
    this.loanProductsSub.unsubscribe();
  }

  checkAvailability(type) {
    return this.loanProduct['availability'].length ? this.loanProduct['availability'].indexOf(type) !== -1 : false;
  }
}
