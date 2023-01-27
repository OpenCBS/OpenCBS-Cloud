import { Component, OnDestroy, OnInit } from '@angular/core';
import { SavingProductState } from '../../../../../core/store/saving-products/saving-product/saving-product.reducer';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { CommonService } from '../../../../../core/services';

@Component({
  selector: 'cbs-saving-product-info',
  templateUrl: './saving-product-info.component.html',
  styleUrls: ['./saving-product-info.component.scss']
})
export class SavingProductInfoComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public savingProductState: any;
  public savingProduct: any;
  public savingProductId: number;
  public currentInstance: string;

  private savingProductInfoSub: any;

  constructor(private savingProductInfoStore: Store<SavingProductState>,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.currentInstance = this.commonService.getData();
    this.savingProductInfoSub = this.savingProductInfoStore.pipe(select(fromRoot.getSavingProductState))
      .subscribe(
        (state: SavingProductState) => {
          this.savingProductState = state;
          if ( state.loaded && state.success && !state.error ) {
            this.savingProduct = state.savingProduct;
            this.breadcrumb = [
              {
                name: 'CONFIGURATION',
                link: '/configuration'
              },
              {
                name: 'SAVING PRODUCTS',
                link: '/configuration/saving-products'
              },
              {
                name: `${this.savingProduct.name}`,
                link: `/configuration/saving-products/ ${this.savingProduct.id}`
              },
              {
                name: 'INFO',
                link: ''
              }
            ];
          }
        });

    setTimeout(() => {
      this.savingProductInfoStore.dispatch(new fromStore.SetSavingProductBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  checkAvailability(type) {
    if ( this.savingProduct ) {
      return this.savingProduct['availability'].length ? this.savingProduct['availability'].indexOf(type) !== -1 : false;
    }
  }

  ngOnDestroy() {
    this.savingProductInfoSub.unsubscribe();
  }
}
