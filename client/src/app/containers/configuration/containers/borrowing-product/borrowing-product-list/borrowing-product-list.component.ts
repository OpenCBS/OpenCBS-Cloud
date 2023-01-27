import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import { BorrowingProductListActions, IBorrowingProductList } from '../../../../../core/store/borrowing-products/borrowing-product-list';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

const SVG_CONFIG = {  collection: 'standard',  class: 'calibration',  name: 'calibration'};

@Component({
  selector: 'cbs-borrowing-products',
  templateUrl: './borrowing-product-list.component.html',
  styleUrls: ['borrowing-product-list.component.scss']
})

export class BorrowingProductListComponent implements OnInit, OnDestroy {
  public borrowingProducts: Observable<IBorrowingProductList>;
  public svgData = SVG_CONFIG;
  public queryObject = {
    page: 1
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'BORROWING_PRODUCTS',
      link: '/configuration/borrowing-products'
    }
  ];

  private currentPageSub: Subscription;
  private paramsSub: Subscription;

  constructor(private borrowingProductStore$: Store<IBorrowingProductList>,
              private borrowingProductActions: BorrowingProductListActions,
              private router: Router,
              private route: ActivatedRoute) {
    this.borrowingProducts = this.borrowingProductStore$.pipe(select(fromRoot.getBorrowingProductListState));
  }

  ngOnInit() {
    this.currentPageSub = this.borrowingProducts.pipe(this.geBorrowingsCurrentPage()).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {page: page + 1});
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? +query['page'] : 1;
      if ( this.queryObject.page !== 1 ) {
        this.borrowingProductStore$.dispatch(this.borrowingProductActions.fireInitialAction(this.queryObject));
      } else {
        this.borrowingProductStore$.dispatch(this.borrowingProductActions.fireInitialAction());
      }
    });
  }

  goToBorrowingProduct(product) {
    this.router.navigate(['/configuration', 'borrowing-products', product.id])
  }

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/configuration/borrowing-products'], navigationExtras);
  }

  geBorrowingsCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  ngOnDestroy(): void {
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}
