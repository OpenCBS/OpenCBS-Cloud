import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { ITermDepositProductInfo } from '../../../../../core/store/term-deposit-products';
import { TermDepositProductSideNavService } from '../shared/service/term-deposit-product-side-nav.service';
import { TermDepositProductMakerCheckerService, TermDepositProductMakerCheckerState } from '../../../../../core/store';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'standard', class: 'product-required', name: 'product_required'};

@Component({
  selector: 'cbs-term-deposit-product-wrap',
  templateUrl: 'term-deposit-product-wrap.component.html',
  styleUrls: ['term-deposit-product-wrap.component.scss']
})
export class TermDepositProductWrapComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public breadcrumb = [];
  public termDepositProduct: any;
  public termDepositProductState: ITermDepositProductInfo;
  public termDepositProductId: number;
  public termDepositProductType: string;
  public termDepositProductNavConfig = [];
  public approveRequest = false;
  public deleteRequest = false;
  public readOnly = false;

  private routeSub: Subscription;
  private termDepositProductsSub: Subscription;
  private termDepositProductsMakerCheckerSub: Subscription;
  private paramsSub: Subscription;

  constructor(private termDepositProductStore$: Store<ITermDepositProductInfo>,
              private termDepositProductMakerCheckerStore$: Store<TermDepositProductMakerCheckerState>,
              private termDepositProductSideNavService: TermDepositProductSideNavService,
              private termDepositProductMakerCheckerService: TermDepositProductMakerCheckerService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      const id = params['id'];
      if ( id && id > 0 ) {
        this.termDepositProductId = id;
      }
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.termDepositProductType = query.type;
      this.termDepositProductType === 'live'
        ? this.loadTermDepositProduct(this.termDepositProductId) : this.loadMakerCheckerTermDepositProduct(this.termDepositProductId);
    });

    if ( this.termDepositProductType === 'live' ) {
      this.termDepositProductsSub = this.termDepositProductStore$.pipe(select(fromRoot.getTermDepositProductInfoState))
        .subscribe((termDepositProductState: ITermDepositProductInfo) => {
          this.termDepositProductState = termDepositProductState;
          this.breadcrumb = this.termDepositProductState['breadcrumb'];
          this.termDepositProduct = termDepositProductState.termDepositProduct;
          this.readOnly = this.termDepositProduct.readOnly;
          this.termDepositProductNavConfig = this.termDepositProductSideNavService.getNavList('term-deposit-products', {
            termDepositProductId: this.termDepositProductId,
            editMode: false,
            createMode: false
          });
        });
    }

    if ( this.termDepositProductType === 'maker-checker' ) {
      this.termDepositProductsMakerCheckerSub = this.termDepositProductMakerCheckerStore$
        .pipe(select(fromRoot.getTermDepositProductMakerCheckerState))
        .subscribe((termDepositProductMakerCheckerState: TermDepositProductMakerCheckerState) => {
          this.termDepositProductState = termDepositProductMakerCheckerState;
          this.breadcrumb = this.termDepositProductState['breadcrumb'];
          this.termDepositProduct = termDepositProductMakerCheckerState.termDepositProduct;
          this.termDepositProductNavConfig = this.termDepositProductSideNavService.getNavList('term-deposit-products', {
            termDepositProductId: this.termDepositProductId,
            editMode: true,
            createMode: true
          });
        });
    }
  }

  loadTermDepositProduct(id) {
    this.termDepositProductStore$.dispatch(new fromStore.LoadTermDepositProduct(id));
  }

  loadMakerCheckerTermDepositProduct(id) {
    this.termDepositProductMakerCheckerStore$.dispatch(new fromStore.LoadTermDepositProductMakerChecker(id));
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

  approveTermDepositProductRequest() {
    this.termDepositProductMakerCheckerService.approveMakerChecker(this.termDepositProductId)
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

  deleteTermDepositProductRequest() {
    this.termDepositProductMakerCheckerService.deleteMakerChecker(this.termDepositProductId)
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
    this.routeSub.unsubscribe();
    this.paramsSub.unsubscribe();
    if ( this.termDepositProductType === 'live' ) {
      this.termDepositProductsSub.unsubscribe();
    }
    if ( this.termDepositProductType === 'maker-checker' ) {
      this.termDepositProductsMakerCheckerSub.unsubscribe();
    }
  }
}
