import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { SavingProductMakerCheckerState } from '../../../../../core/store';
import { CommonService } from '../../../../../core/services';

@Component({
  selector: 'cbs-saving-product-maker-checker',
  templateUrl: './saving-product-maker-checker.component.html',
  styleUrls: ['./saving-product-maker-checker.component.scss']
})
export class SavingProductMakerCheckerComponent implements OnInit, OnDestroy {
  public breadcrumb = [];
  public savingProductMakerCheckerState: any;
  public savingProduct: any;
  public savingProductId: number;
  public currentInstance: string;

  private savingProductMakerCheckerSub: any;

  constructor(private savingProductMakerCheckerStore: Store<SavingProductMakerCheckerState>,
              private commonService: CommonService) {
  }

  ngOnInit() {
    this.currentInstance = this.commonService.getData();
    this.savingProductMakerCheckerSub = this.savingProductMakerCheckerStore.pipe(select(fromRoot.getSavingProductMakerCheckerState))
      .subscribe(
        (state: SavingProductMakerCheckerState) => {
          this.savingProductMakerCheckerState = state;
          if ( state.loaded && state.success && !state.error ) {
            this.savingProduct = state.savingProduct;
            this.breadcrumb = [
              {
                name: 'SAVING PRODUCTS',
                link: '/configuration/saving-products'
              },
              {
                name: `${this.savingProduct.name}`,
                link: `/configuration/saving-products/ ${this.savingProduct.id}`
              },
              {
                name: 'MAKER/CHECKER',
                link: ''
              }
            ];
          }
        });

    setTimeout(() => {
      this.savingProductMakerCheckerStore.dispatch(new fromStore.SetSavingProductMakerCheckerBreadcrumb(this.breadcrumb));
    }, 1000);
  }

  checkAvailability(type) {
    if ( this.savingProduct ) {
      return this.savingProduct['availability'].length ? this.savingProduct['availability'].indexOf(type) !== -1 : false;
    }
  }

  ngOnDestroy() {
    this.savingProductMakerCheckerSub.unsubscribe();
  }
}
