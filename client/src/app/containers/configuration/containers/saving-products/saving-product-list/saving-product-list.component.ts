import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { SavingProductListState } from '../../../../../core/store/saving-products';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

const SVG_DATA = {
  collection: 'standard',
  class: 'case',
  name: 'case'
};

@Component({
  selector: 'cbs-saving-product-list',
  templateUrl: './saving-product-list.component.html',
  styleUrls: ['./saving-product-list.component.scss']
})
export class SavingProductListComponent implements OnInit, OnDestroy {
  public saving_products: Observable<SavingProductListState>;
  public showAll = false;
  public svgData = SVG_DATA;
  public queryObjectShowAll = {
    show_all: false
  };
  public queryObject = {
    page: 1
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'SAVING_PRODUCTS',
      link: '/configuration/saving-products'
    }
  ];

  private currentPageSub: Subscription;
  private paramsSub: Subscription;

  constructor(private savingProductStore$: Store<SavingProductListState>,
              private router: Router,
              private route: ActivatedRoute) {
    this.saving_products = this.savingProductStore$.pipe(select(fromRoot.getSavingProductsState));
  }

  ngOnInit() {
    this.currentPageSub = this.saving_products.pipe(this.getSavingsCurrentPage()).subscribe((page: number) => {
      this.queryObject = Object.assign({}, this.queryObject, {page: page + 1});
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? +query['page'] : 1;
      if ( this.queryObject.page !== 1 ) {
        this.savingProductStore$.dispatch(new fromStore.LoadSavingProductList(this.queryObject));
      } else if ( this.queryObjectShowAll.show_all ) {
        this.savingProductStore$.dispatch(new fromStore.LoadSavingProductList(this.queryObjectShowAll));
      } else {
        this.savingProductStore$.dispatch(new fromStore.LoadSavingProductList());
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
    this.router.navigate(['/configuration/saving-products'], navigationExtras);
  }

  getSavingsCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras: NavigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/configuration/saving-products'], navigationExtras);
  }

  goToSavingProduct(product) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'live'
      }
    };
    this.router.navigate(['/saving-products', product.id, 'info'], navigationExtras)
  }

  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}
