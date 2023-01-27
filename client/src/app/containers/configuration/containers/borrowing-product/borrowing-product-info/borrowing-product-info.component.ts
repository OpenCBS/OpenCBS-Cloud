import { Component, OnInit } from '@angular/core';
import * as fromRoot from '../../../../../core/core.reducer';
import { select, Store } from '@ngrx/store';
import { ActivatedRoute } from '@angular/router';
import {
  IBorrowingProductInfo,
  BorrowingProductInfoActions
} from '../../../../../core/store/borrowing-products/borrowing-product-info';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'standard', class: 'calibration', name: 'calibration'};

@Component({
  selector: 'cbs-borrowing-product',
  templateUrl: './borrowing-product-info.component.html',
  styleUrls: ['./borrowing-product-info.component.scss']
})

export class BorrowingProductInfoComponent implements OnInit {
  public svgData = SVG_DATA;
  private borrowingProductsSub: any;
  public borrowingProduct: any;
  public borrowingProductState;
  public borrowingProductId: number;
  public breadcrumbLinks = [
    {
      name: 'BORROWING_PRODUCTS',
      link: '/configuration/borrowing-products'
    }
  ];

  private routeSub: Subscription;

  constructor(private borrowingProductStore$: Store<IBorrowingProductInfo>,
              private borrowingProductInfoActions: BorrowingProductInfoActions,
              private route: ActivatedRoute,
              private store$: Store<fromRoot.State>) {
    this.borrowingProductsSub = this.store$.pipe(select(fromRoot.getBorrowingProductInfoState))
      .subscribe((borrowingProductState: IBorrowingProductInfo) => {
        this.borrowingProductState = borrowingProductState;
        this.borrowingProduct = borrowingProductState['data'];
        if ( borrowingProductState.success && borrowingProductState.loaded && !borrowingProductState.error ) {
          this.breadcrumbLinks[1] = {
            name: `${borrowingProductState['data']['name']}`,
            link: ''
          };
        }
      });
  }

  ngOnInit() {
    this.routeSub = this.route.params
      .subscribe(params => {
        const id = params['id'];
        if ( id && id > 0 ) {
          this.borrowingProductId = id;
          this.borrowingProductStore$.dispatch(this.borrowingProductInfoActions.fireInitialAction(id));
        }
      });
  }
}
