import { Component, OnDestroy, OnInit } from '@angular/core';
import * as fromRoot from '../../../../../core/core.reducer';
import { select, Store } from '@ngrx/store';
import { ITermDepositProductInfo } from '../../../../../core/store/term-deposit-products/term-deposit-product-info';
import * as fromStore from '../../../../../core/store';
import { Subscription } from 'rxjs';
import { CommonService } from '../../../../../core/services';

@Component({
  selector: 'cbs-term-deposit-product',
  templateUrl: './term-deposit-product-info.component.html',
  styleUrls: ['./term-deposit-product-info.component.scss']
})

export class TermDepositProductInfoComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public termDepositProduct: any;
  public termDepositProductState: ITermDepositProductInfo;
  public termDepositProductId: number;
  public currentInstance: string;

  private termDepositProductsSub: Subscription;

  constructor(private termDepositProductStore$: Store<ITermDepositProductInfo>,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.currentInstance = this.commonService.getData();
    this.termDepositProductsSub = this.termDepositProductStore$.pipe(select(fromRoot.getTermDepositProductInfoState))
      .subscribe((termDepositProductState: ITermDepositProductInfo) => {
        if ( termDepositProductState.success && termDepositProductState.loaded && !termDepositProductState.error ) {
          this.termDepositProductState = termDepositProductState;
          this.termDepositProduct = termDepositProductState.termDepositProduct;
          this.breadcrumb = [
            {
              name: 'CONFIGURATION',
              link: '/configuration'
            },
            {
              name: 'TERM_DEPOSIT_PRODUCTS',
              link: '/configuration/term-deposit-products'
            },
            {
              name: `${this.termDepositProduct.name}`,
              link: `/configuration/term-deposit-products/ ${this.termDepositProduct.id}`
            },
            {
              name: 'INFO',
              link: ''
            }
          ];
        }
      });

    setTimeout(() => {
      this.termDepositProductStore$.dispatch(new fromStore.SetTermDepositProductBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  checkAvailability(type) {
    if ( this.termDepositProduct ) {
      return this.termDepositProduct['availability'].length ? this.termDepositProduct['availability'].indexOf(type) !== -1 : false;
    }
  }

  ngOnDestroy() {
    this.termDepositProductsSub.unsubscribe();
  }
}
