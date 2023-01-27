import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {select, Store} from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import {
  IBorrowingProductInfo,
  BorrowingProductInfoActions
} from '../../../../../core/store/borrowing-products/borrowing-product-info';
import {
  IUpdateBorrowingProduct,
  BorrowingProductUpdateActions
} from '../../../../../core/store/borrowing-products/borrowing-product-update';
import { environment } from '../../../../../../environments/environment';
import { EditBorrowingProductFormComponent } from '../shared/edit-borrowing-product-form/edit-borrowing-product-form.component';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'standard', class: 'calibration', name: 'calibration'};

@Component({
  selector: 'cbs-borrowing-product',
  templateUrl: 'borrowing-product-update.component.html',
  styleUrls: ['borrowing-product-update.component.scss']
})

export class BorrowingProductUpdateComponent implements OnInit, AfterViewInit {
  @ViewChild(EditBorrowingProductFormComponent, {static: false}) editLoanProductForm: EditBorrowingProductFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public isOpen = false;
  private borrowingProductSub: any;
  private borrowingProductState: any;
  public formChanged = false;
  private borrowingProductUpdateState: any;
  public breadcrumbLinks = [
    {
      name: 'BORROWING_PRODUCTS',
      link: '/configuration/borrowing-products'
    },
    {},
    {
      name: 'EDIT',
      link: ''
    }
  ];
  public borrowingProductId: number;
  public cachedAccountList: any;
  private cachedLoanProduct: any;
  private routeSub: Subscription;
  private loanProductUpdateSub: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private borrowingProductStore$: Store<IBorrowingProductInfo>,
              private borrowingProductActions: BorrowingProductInfoActions,
              private borrowingProductUpdateStore$: Store<IUpdateBorrowingProduct>,
              private borrowingProductUpdateActions: BorrowingProductUpdateActions,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2) {
    this.borrowingProductSub = this.store$.pipe(select(fromRoot.getBorrowingProductInfoState))
      .subscribe((borrowingProductState: IBorrowingProductInfo) => {
        if ( borrowingProductState.success && borrowingProductState.loaded && !borrowingProductState.error ) {
          this.cachedLoanProduct = borrowingProductState.data;
          if ( this.editLoanProductForm && this.editLoanProductForm.form ) {
            this.editLoanProductForm.populateFields(this.cachedLoanProduct);
          }
          this.breadcrumbLinks[1] = {
            name: `${borrowingProductState['data']['name']}`,
            link: `/configuration/borrowing-products/${borrowingProductState.data['id']}`
          };
          setTimeout(() => {
            this.cachedAccountList = this.editLoanProductForm.form.value['accountList'];
          }, 700);
        }

        this.borrowingProductState = borrowingProductState;
      });
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      const id = +params['id'];
      if ( id === +params['id'] ) {
        this.borrowingProductId = +params['id'];
        this.borrowingProductStore$.dispatch(this.borrowingProductActions.fireInitialAction(this.borrowingProductId));
      }
    });
    this.loanProductUpdateSub = this.borrowingProductUpdateStore$.pipe(select(fromRoot.getBorrowingProductUpdateState))
      .subscribe((loanProductUpdateState: IUpdateBorrowingProduct) => {
        this.borrowingProductUpdateState = loanProductUpdateState;
        if ( loanProductUpdateState.loaded && loanProductUpdateState.success && !loanProductUpdateState.error ) {
          this.toastrService.clear();
          this.translate.get('UPDATE_SUCCESS')
            .subscribe((res: string) => {
              this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
            });
          this.resetState();
          this.goToViewLoanProducts();
        } else if ( loanProductUpdateState.loaded && !loanProductUpdateState.success && loanProductUpdateState.error ) {
          this.toastrService.clear();
          this.translate.get('UPDATE_ERROR')
            .subscribe((res: string) => {
              this.toastrService.error(loanProductUpdateState.errorMessage, res, environment.ERROR_TOAST_CONFIG);
            });
          this.resetState();
        }
      });
  }

  goToViewLoanProducts() {
    this.router.navigate(['configuration', 'borrowing-products', this.borrowingProductId]);
  }

  resetState() {
    this.borrowingProductUpdateStore$.dispatch(this.borrowingProductUpdateActions.fireResetAction());
  };

  ngAfterViewInit() {
    if ( this.editLoanProductForm && this.editLoanProductForm.form ) {
      this.editLoanProductForm.form.valueChanges
        .subscribe(data => {
          this.formChanged = (this.checkFormChanges(data, this.cachedLoanProduct));
        });
    }
  }

  submitForm() {
    if ( this.editLoanProductForm.form.valid ) {
      this.editLoanProductForm.form.value.accountList = Object.assign({}, ...this.editLoanProductForm.form.value['accountList']);
      this.borrowingProductUpdateStore$
        .dispatch(this.borrowingProductUpdateActions.fireInitialAction({
          loanProductForm: this.editLoanProductForm.form.value,
          loanProductId: this.borrowingProductId
        }));
    }
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  checkFormChanges(loanProductData, cachedData) {
    let status = false;
    if ( loanProductData ) {
      for (const key in loanProductData) {
        if ( loanProductData.hasOwnProperty(key) ) {
          if ( key === 'currencyId' ) {
            if ( loanProductData[key] !== cachedData['currency']['id'] ) {
              status = true;
            }
          } else {
            for (const k in cachedData) {
              if ( cachedData.hasOwnProperty(k) ) {
                if ( key === k && loanProductData[key] !== cachedData[k] ) {
                  status = true;
                }
              }
            }
          }
        }
      }
      if ( this.cachedAccountList ) {
        for (const key in loanProductData.accountList) {
          if ( loanProductData.accountList[key] !== this.cachedAccountList[key] ) {
            status = true;
          }
        }
      }
    }
    return status;
  }
}
