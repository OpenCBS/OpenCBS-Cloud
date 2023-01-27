import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { TermDepositProductMakerCheckerState } from '../../../../../core/store/term-deposit-products';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../../../core/services';


@Component({
  selector: 'cbs-info-term-deposit-product-maker-checker',
  templateUrl: 'term-deposit-product-maker-checker.component.html',
  styleUrls: ['term-deposit-product-maker-checker.component.scss']
})
export class TermDepositProductMakerCheckerComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public termDepositProduct: any;
  public termDepositProductMakerCheckerState: TermDepositProductMakerCheckerState;
  public termDepositProductId: number;
  public entryFees;
  public currentInstance: string;

  private termDepositProductsSub: Subscription;

  constructor(private termDepositProductMakerCheckerStore$: Store<TermDepositProductMakerCheckerState>,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.currentInstance = this.commonService.getData();
    this.termDepositProductsSub = this.termDepositProductMakerCheckerStore$.pipe(select(fromRoot.getTermDepositProductMakerCheckerState))
      .subscribe((termDepositProductMakerCheckerState: TermDepositProductMakerCheckerState) => {
        // tslint:disable-next-line:max-line-length
        if ( termDepositProductMakerCheckerState.success && termDepositProductMakerCheckerState.loaded && termDepositProductMakerCheckerState.termDepositProduct ) {
          this.termDepositProductMakerCheckerState = termDepositProductMakerCheckerState;
          this.termDepositProduct = termDepositProductMakerCheckerState.termDepositProduct;
          this.breadcrumb = [
            {
              name: 'TERM_DEPOSIT_PRODUCTS',
              link: '/configuration/term-deposit-products'
            },
            {
              name: `${this.termDepositProduct.code}`,
              link: `/configuration/term-deposit-products/ ${this.termDepositProduct.id}`
            },
            {
              name: 'MAKER/CHECKER',
              link: ''
            }
          ];
          this.entryFees = this.termDepositProduct['fees'];
        }
      });

    setTimeout(() => {
      this.termDepositProductMakerCheckerStore$.dispatch(new fromStore.SetTermDepositProductMakerCheckerBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  ngOnDestroy() {
    this.termDepositProductsSub.unsubscribe();
  }

  checkAvailability(type) {
    return this.termDepositProduct['availability'].length ? this.termDepositProduct['availability'].indexOf(type) !== -1 : false;
  }
}
