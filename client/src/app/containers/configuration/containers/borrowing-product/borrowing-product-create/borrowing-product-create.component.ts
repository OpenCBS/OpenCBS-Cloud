import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import {
  ICreateBorrowingProduct,
  BorrowingProductCreateActions
} from '../../../../../core/store/borrowing-products/borrowing-product-create';
import { environment } from '../../../../../../environments/environment.prod';
import { BorrowingProductFormComponent } from '../shared/borrowing-product-form/borrowing-product-form.component';

@Component({
  selector: 'cbs-borrowing-product-create',
  templateUrl: './borrowing-product-create.component.html'
})

export class BorrowingProductCreateComponent implements OnInit {
  @ViewChild(BorrowingProductFormComponent, {static: false}) loanProductForm: BorrowingProductFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public breadcrumbLinks = [
    {
      name: 'BORROWING_PRODUCTS',
      link: '/configuration/borrowing-products'
    },
    {
      name: 'CREATE',
      link: ''
    }
  ];
  public svgData = {
    collection: 'standard',
    class: 'calibration',
    name: 'calibration'
  };
  private createBorrowingProductSub: any;


  constructor(private createLoanProductStore$: Store<ICreateBorrowingProduct>,
              private borrowingProductCreateActions: BorrowingProductCreateActions,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.createBorrowingProductSub = this.store$.select(fromRoot.getBorrowingProductCreateState).subscribe(
      (state: ICreateBorrowingProduct) => {
        if (state.loaded && state.success && !state.error) {
          this.toastrService.clear();
          this.translate.get('CREATE_SUCCESS').subscribe((res: string) => {
            this.toastrService.success(res, '', environment.SUCCESS_TOAST_CONFIG);
          });
          this.resetState();
          this.goToViewBorrowingProducts();
        } else if (state.loaded && !state.success && state.error) {
          this.toastrService.clear();
          this.disableSubmitBtn(false);
          this.translate.get('CREATE_ERROR').subscribe((res: string) => {
            this.toastrService.error(state.errorMessage, res, environment.ERROR_TOAST_CONFIG);
          });
          this.resetState();
        }
      });
  }

  submitForm() {
    if (this.loanProductForm.form.valid) {
      const loanProduct = Object.assign({}, this.loanProductForm.form.value);
      this.disableSubmitBtn(true);
      loanProduct.accountList = Object.assign({}, ...loanProduct['accountList']);
      this.createLoanProductStore$.dispatch(this.borrowingProductCreateActions.fireInitialAction(loanProduct));
    }
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.createLoanProductStore$.dispatch(this.borrowingProductCreateActions.fireResetAction());
  }

  goToViewBorrowingProducts() {
    this.router.navigate(['configuration', 'borrowing-products']);
  }
}
