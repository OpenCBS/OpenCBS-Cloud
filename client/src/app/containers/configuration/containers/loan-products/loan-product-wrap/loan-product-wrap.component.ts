import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { LoanProductMakerCheckerService, LoanProductMakerCheckerState } from '../../../../../core/store';
import { LoanProductState } from '../../../../../core/store/loan-products';
import { LoanProductSideNavService } from '../shared/service/loan-product-side-nav.service';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../../../../environments/environment';
import { throwError } from 'rxjs/internal/observable/throwError';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

const SVG_DATA = {
  collection: 'standard',
  class: 'product-required',
  name: 'product_required'
};

@Component({
  selector: 'cbs-info-loan-product-wrap',
  templateUrl: 'loan-product-wrap.component.html',
  styleUrls: ['loan-product-wrap.component.scss']
})
export class LoanProductWrapComponent implements OnInit, OnDestroy {
  public svgData = SVG_DATA;
  public breadcrumb = [];
  public loanProduct: any;
  public loanProductState: LoanProductState;
  public loanProductId: number;
  public loanProductType: string;
  public loanProductNavConfig = [];
  public approveRequest = false;
  public deleteRequest = false;
  public readOnly = false;

  private routeSub: Subscription;
  private loanProductsSub: Subscription;
  private loanProductsMakerCheckerSub: Subscription;
  private paramsSub: Subscription;

  constructor(private loanProductStore$: Store<LoanProductState>,
              private loanProductMakerCheckerStore$: Store<LoanProductMakerCheckerState>,
              public loanProductSideNavService: LoanProductSideNavService,
              public loanProductMakerCheckerService: LoanProductMakerCheckerService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private router: Router,
              private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      const id = params['id'];
      if ( id && id > 0 ) {
        this.loanProductId = id;
      }
    });

    this.paramsSub = this.route.queryParams.subscribe(query => {
      this.loanProductType = query.type;
      this.loanProductType === 'live' ? this.loadLoanProduct(this.loanProductId) : this.loadMakerCheckerLoanProduct(this.loanProductId);
    });

    if ( this.loanProductType === 'live' ) {
      this.loanProductsSub = this.loanProductStore$.pipe(select(fromRoot.getLoanProductState))
        .subscribe((loanProductState: LoanProductState) => {
          this.loanProductState = loanProductState;
          this.breadcrumb = this.loanProductState['breadcrumb'];
          this.loanProduct = loanProductState.loanProduct;
          this.readOnly = this.loanProduct.readOnly;
          this.loanProductNavConfig = this.loanProductSideNavService.getNavList('loan-products', {
            loanProductId: this.loanProductId,
            editMode: false,
            createMode: false
          });
        });
    }

    if ( this.loanProductType === 'maker-checker' ) {
      this.loanProductsMakerCheckerSub = this.loanProductMakerCheckerStore$.pipe(select(fromRoot.getLoanProductMakerCheckerState))
        .subscribe((loanProductMakerCheckerState: LoanProductMakerCheckerState) => {
          this.loanProductState = loanProductMakerCheckerState;
          this.breadcrumb = this.loanProductState['breadcrumb'];
          this.loanProduct = loanProductMakerCheckerState.loanProduct;
          this.loanProductNavConfig = this.loanProductSideNavService.getNavList('loan-products', {
            loanProductId: this.loanProductId,
            editMode: true,
            createMode: true
          });
        });
    }
  }

  loadLoanProduct(id) {
    this.loanProductStore$.dispatch(new fromStore.LoadLoanProduct(id));
  }

  loadMakerCheckerLoanProduct(id) {
    this.loanProductMakerCheckerStore$.dispatch(new fromStore.LoadLoanProductMakerChecker(id));
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

  approveLoanProductRequest() {
    this.loanProductMakerCheckerService.approveMakerChecker(this.loanProductId)
      .pipe(catchError((res: any) => {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        return throwError(res);
      }))
      .subscribe(() => {
        this.toastrService.clear();
        this.toastrService.success('Successfully approved', '', environment.SUCCESS_TOAST_CONFIG);
        this.router.navigate(['/requests']);
      });
  }

  deleteLoanProductRequest() {
    this.loanProductMakerCheckerService.deleteMakerChecker(this.loanProductId)
      .pipe(catchError((res: any) => {
        this.toastrService.clear();
        this.toastrService.error(res.error.message, 'ERROR', environment.ERROR_TOAST_CONFIG);
        return throwError(res);
      }))
      .subscribe(() => {
        this.toastrService.clear();
        this.toastrService.success('Successfully deleted', '', environment.SUCCESS_TOAST_CONFIG);
        this.router.navigate(['/requests']);
      });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.paramsSub.unsubscribe();
    if ( this.loanProductType === 'live' ) {
      this.loanProductsSub.unsubscribe();
    }
    if ( this.loanProductType === 'maker-checker' ) {
      this.loanProductsMakerCheckerSub.unsubscribe();
    }
  }
}
