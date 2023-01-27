import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { ITermDepositProductList } from '../../../../../core/store/term-deposit-products/term-deposit-product-list';
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

const SVG_DATA = {collection: 'custom', class: 'custom17', name: 'custom17'};

@Component({
  selector: 'cbs-term-deposit-products',
  templateUrl: './term-deposit-product-list.component.html',
  styleUrls: ['term-deposit-product-list.component.scss']
})

export class TermDepositProductListComponent implements OnInit, OnDestroy {
  public termDepositProducts: Observable<ITermDepositProductList>;
  public svgData = SVG_DATA;
  public queryObject = {
    page: 1
  };
  public showAll = false;
  public queryObjectShowAll = {
    show_all: false
  };
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'TERM_DEPOSIT_PRODUCTS',
      link: '/configuration/term-deposit-products'
    }
  ];

  private currentPageSub: Subscription;
  private paramsSub: Subscription;

  constructor(private termDepositProductStore$: Store<ITermDepositProductList>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private route: ActivatedRoute) {
    this.termDepositProducts = this.store$.pipe(select(fromRoot.getTermDepositProductListState));
  }

  ngOnInit() {
    this.currentPageSub = this.termDepositProducts.pipe(this.getTermDepositsCurrentPage())
      .subscribe((page: number) => {
        this.queryObject = Object.assign({}, this.queryObject, {page: page + 1});
      });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.queryObject.page = query['page'] ? +query['page'] : 1;
      if ( this.queryObject.page !== 1 ) {
        this.termDepositProductStore$.dispatch(new fromStore.LoadTermDepositProductList(this.queryObject));
      } else if ( this.queryObjectShowAll.show_all ) {
        this.termDepositProductStore$.dispatch(new fromStore.LoadTermDepositProductList(this.queryObjectShowAll));
      } else {
        this.termDepositProductStore$.dispatch(new fromStore.LoadTermDepositProductList());
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
    this.router.navigate(['/configuration/term-deposit-products'], navigationExtras);
  }

  goToTermDepositProduct(product) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'live'
      }
    };
    this.router.navigate(['term-deposit-products', product.id, 'info'], navigationExtras)
  }

  goToPage(page: number) {
    this.queryObject.page = page;
    const navigationExtras = {
      queryParams: this.queryObject
    };
    this.router.navigate(['/configuration/term-deposit-products'], navigationExtras);
  }

  getTermDepositsCurrentPage = () => {
    return state => state
      .pipe(map(s => s['currentPage']));
  };

  ngOnDestroy() {
    this.currentPageSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}
