import { Component, OnInit, OnDestroy } from '@angular/core';
import { SavingProductState } from '../../../../../core/store/saving-products/saving-product/saving-product.reducer';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { ActivatedRoute, Router } from '@angular/router';
import { SavingProductSideNavService } from '../shared/service/saving-product-side-nav.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { SavingProductMakerCheckerService, SavingProductMakerCheckerState } from '../../../../../core/store';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { throwError } from 'rxjs/internal/observable/throwError';

const SVG_DATA = {
  collection: 'standard',
  class: 'case',
  name: 'case'
};

@Component({
  selector: 'cbs-saving-product-wrap',
  templateUrl: './saving-product-wrap.component.html',
  styleUrls: ['./saving-product-wrap.component.scss']
})
export class SavingProductWrapComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public breadcrumb = [];
  public savingProductState: any;
  public savingProduct: any;
  public savingProductId: number;
  public savingProductType: string;
  public savingProductNavConfig = [];
  public approveRequest = false;
  public deleteRequest = false;
  public readOnly = false;

  private savingProductInfoSub: any;
  private savingProductMakerCheckerSub: any;
  private routeSub: any;
  private paramsSub: any;

  constructor(private savingProductInfoStore: Store<SavingProductState>,
              private savingProductMakerCheckerStore: Store<SavingProductMakerCheckerState>,
              public savingProductSideNavService: SavingProductSideNavService,
              public savingProductMakerCheckerService: SavingProductMakerCheckerService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.savingProductId = params.id;
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.savingProductType = query.type;
      this.savingProductType === 'live'
        ? this.loadSavingProduct(this.savingProductId)
        : this.loadMakerCheckerSavingProduct(this.savingProductId);
    });

    if ( this.savingProductType === 'live' ) {
      this.savingProductInfoSub = this.savingProductInfoStore.pipe(select(fromRoot.getSavingProductState))
        .subscribe((state: SavingProductState) => {
          this.savingProductState = state;
          if ( state.loaded && state.success && !state.error ) {
            this.savingProduct = state;
            this.readOnly = this.savingProduct.savingProduct.readOnly;
            this.breadcrumb = this.savingProduct['breadcrumb'];
            this.savingProductNavConfig = this.savingProductSideNavService.getNavList('saving-products', {
              savingProductId: this.savingProductId,
              editMode: false,
              createMode: false
            });
          }
        });
    }

    if ( this.savingProductType === 'maker-checker' ) {
      this.savingProductMakerCheckerSub = this.savingProductMakerCheckerStore.pipe(select(fromRoot.getSavingProductMakerCheckerState))
        .subscribe((state: SavingProductMakerCheckerState) => {
          this.savingProductState = state;
          if ( state.loaded && state.success && !state.error ) {
            this.savingProduct = state;
            this.breadcrumb = this.savingProduct['breadcrumb'];
            this.savingProductNavConfig = this.savingProductSideNavService.getNavList('saving-products', {
              savingProductId: this.savingProductId,
              editMode: true,
              createMode: true
            });
          }
        });
    }
  }

  loadSavingProduct(id) {
    this.savingProductInfoStore.dispatch(new fromStore.LoadSavingProduct(id));
  }

  loadMakerCheckerSavingProduct(id) {
    this.savingProductMakerCheckerStore.dispatch(new fromStore.LoadSavingProductMakerChecker(id));
  }

  openApproveModal() {
    this.approveRequest = true;
  }

  openDeleteModal() {
    this.deleteRequest = true;
  }

  closeModal() {
    this.approveRequest = false;
    this.deleteRequest = false;
  }

  approveSavingProductRequest() {
    this.savingProductMakerCheckerService.approveMakerChecker(this.savingProductId)
      .pipe(catchError((res: any) => {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        return throwError(res);
      }))
      .subscribe(() => {
        this.toastrService.clear();
        this.toastrService.success('Successfully approved', '', environment.SUCCESS_TOAST_CONFIG);
        this.router.navigate(['/requests'])
      });
  }

  deleteSavingProductRequest() {
    this.savingProductMakerCheckerService.deleteMakerChecker(this.savingProductId)
      .pipe(catchError((res: any) => {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        return throwError(res);
      }))
      .subscribe(() => {
        this.toastrService.clear();
        this.toastrService.success('Successfully deleted', '', environment.SUCCESS_TOAST_CONFIG);
        this.router.navigate(['/requests'])
      });
  }

  ngOnDestroy() {
    if ( this.savingProductType === 'live' ) {
      this.savingProductInfoSub.unsubscribe();
    }
    if ( this.savingProductType === 'maker-checker' ) {
      this.savingProductMakerCheckerSub.unsubscribe();
    }
    this.routeSub.unsubscribe();
    this.paramsSub.unsubscribe();
  }
}
