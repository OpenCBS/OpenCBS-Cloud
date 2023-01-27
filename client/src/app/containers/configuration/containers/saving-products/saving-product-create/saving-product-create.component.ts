import { Component, OnInit, OnDestroy, ViewChild, Renderer2, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { CreateSavingProductState } from '../../../../../core/store/saving-products';
import { SavingProductFormComponent } from '../shared/saving-product-form/saving-product-form.component';
import { SavingProductCreateService, SavingProductListState } from '../../../../../core/store';
import { environment } from '../../../../../../environments/environment';

const SVG_DATA = {
  collection: 'standard',
  class: 'case',
  name: 'case'
};

@Component({
  selector: 'cbs-saving-product-create',
  templateUrl: './saving-product-create.component.html',
  styleUrls: ['./saving-product-create.component.scss']
})
export class SavingProductCreateComponent implements OnInit, OnDestroy {
  @ViewChild(SavingProductFormComponent, {static: true}) savingProductForm: SavingProductFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'SAVING_PRODUCTS',
      link: '/configuration/saving-products'
    },
    {
      name: 'CREATE',
      link: ''
    }
  ];

  private createSavingProductSub: any;

  constructor(private createSavingProductStore$: Store<CreateSavingProductState>,
              private savingProductStore$: Store<SavingProductListState>,
              private router: Router,
              private savingProductCreateService: SavingProductCreateService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2) {
  }


  ngOnInit() {
    this.createSavingProductSub = this.createSavingProductStore$.select(fromRoot.getSavingProductCreateState).subscribe(
      (state: CreateSavingProductState) => {
        if (state.loaded && state.success && !state.error) {
          this.router.navigate(['/configuration', 'saving-products', state['data']['id']]);
        } else if (state.loaded && !state.success && state.error) {
          this.disableSubmitBtn(false);
          this.resetState();
        }
      });
  }

  submitForm() {
    const savingProduct = Object.assign({}, this.savingProductForm.form.value, {
      accounts: {
        SAVING: this.savingProductForm.form.controls['savingAccount'].value,
        INTEREST: this.savingProductForm.form.controls['interestAccount'].value,
        INTEREST_EXPENSE: this.savingProductForm.form.controls['interestExpenseAccount'].value,
        DEPOSIT_FEE: this.savingProductForm.form.controls['depositFeeAccount'].value,
        DEPOSIT_FEE_INCOME: this.savingProductForm.form.controls['depositFeeIncomeAccount'].value,
        WITHDRAWAL_FEE: this.savingProductForm.form.controls['withdrawalFeeAccount'].value,
        WITHDRAWAL_FEE_INCOME: this.savingProductForm.form.controls['withdrawalFeeIncomeAccount'].value,
        MANAGEMENT_FEE: this.savingProductForm.form.controls['managementFeeAccount'].value,
        MANAGEMENT_FEE_INCOME: this.savingProductForm.form.controls['managementFeeIncomeAccount'].value,
        ENTRY_FEE: this.savingProductForm.form.controls['entryFeeAccount'].value,
        ENTRY_FEE_INCOME: this.savingProductForm.form.controls['entryFeeIncomeAccount'].value,
        CLOSE_FEE: this.savingProductForm.form.controls['closeFeeAccount'].value,
        CLOSE_FEE_INCOME: this.savingProductForm.form.controls['closeFeeIncomeAccount'].value
      }
    });

    if (savingProduct.availability.length) {
      const availability = [];
      if (savingProduct.availability[0] && savingProduct.availability[0]['person_profile']) {
        availability.push('PERSON');
      }

      if (savingProduct.availability[1] && savingProduct.availability[1]['company_profile']) {
        availability.push('COMPANY');
      }
      savingProduct.availability = availability;
    }

    if (this.savingProductForm.form.valid) {
      this.savingProductCreateService.createSavingProduct(savingProduct)
        .subscribe((res: any) => {
          if (res.error) {
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.toastrService.clear();
            this.translate.get('CREATE_SUCCESS').subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['/configuration', 'saving-products']);
          }
        });
      this.savingProductStore$.dispatch(new fromStore.LoadSavingProductList());
    }
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.createSavingProductStore$.dispatch(new fromStore.CreateSavingProductReset());
  }

  goToViewSavingProducts() {
    this.router.navigate(['configuration', 'saving-products']);
  }

  ngOnDestroy() {
    this.createSavingProductSub.unsubscribe();
    this.resetState();
  }
}
