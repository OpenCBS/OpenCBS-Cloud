import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { LoanProductListState } from '../../../../../core/store/loan-products';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

const SVG_DATA = {
  collection: 'standard',
  class: 'product-required',
  name: 'product_required'
};


@Component({
  selector: 'cbs-loan-products',
  templateUrl: 'loan-product-list.component.html',
  styleUrls: ['loan-product-list.component.scss']
})
export class LoanProductListComponent implements OnInit, OnDestroy {
  public loanProducts: Observable<LoanProductListState>;
  public showAll = false;
  public svgData = SVG_DATA;
  public queryObjectShowAll = {
    show_all: false
  };
  public queryObject = {
    page: 1,
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'LOAN_PRODUCTS',
      link: '/configuration/loan-products'
    }
  ];

  private currentPageSub: Subscription;
  private paramsSub: Subscription;

  constructor(private loanProductStore$: Store<LoanProductListState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute) {
    this.loanProducts = this.store$.pipe(select(fromRoot.getLoanProductsState));
  }

  ngOnInit() {
    this.currentPageSub = this.loanProducts.pipe(this.getLoansCurrentPage())
      .subscribe((page: number) => {
        this.queryObject = Object.assign({}, this.queryObject, {page: page + 1});
      });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? +query['page'] : 1;
      if ( this.queryObject.page !== 1 ) {
        this.loanProductStore$.dispatch(new fromStore.LoadLoanProductList(this.queryObject));
      } else if ( this.queryObjectShowAll.show_all ) {
        this.loanProductStore$.dispatch(new fromStore.LoadLoanProductList(this.queryObjectShowAll));
      } else {
        this.loanProductStore$.dispatch(new fromStore.LoadLoanProductList());
      }
    });
  }

  rowStyleClass(row) {
    return row.statusType !== 'ACTIVE' ? 'is-deleted' : '';
  }

  showAllProducts() {
    this.showAll = !this.showAll;
    this.queryObjectShowAll = {
      show_all: this.showAll
    };
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObjectShowAll
    };
    this.router.navigate(['/configuration/loan-products'], navigationExtras);
  }

  getLoansCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/configuration/loan-products'], navigationExtras);
  }

  goToLoanProduct(product) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'live'
      }
    };
    this.router.navigate(['/loan-products', product.id, 'info'], navigationExtras)
  }

  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}
