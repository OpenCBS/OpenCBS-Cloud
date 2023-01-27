import { Component, OnInit, OnDestroy, ViewChild, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { SavingProductFormComponent } from '../shared/saving-product-form/saving-product-form.component';
import { UpdateSavingProductState } from '../../../../../core/store/saving-products';
import { SavingProductState } from '../../../../../core/store/saving-products/saving-product/saving-product.reducer';
import { SavingProductListState, SavingProductUpdateService } from '../../../../../core/store';
import { environment } from '../../../../../../environments/environment';

const SVG_DATA = {
  collection: 'standard',
  class: 'case',
  name: 'case'
};

@Component({
  selector: 'cbs-saving-product-edit',
  templateUrl: './saving-product-edit.component.html',
  styleUrls: ['./saving-product-edit.component.scss']
})
export class SavingProductEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(SavingProductFormComponent, {static: false}) savingProductForm: SavingProductFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public savingProductState: any;
  public savingProductId: number;
  public cachedSavingProduct: any;
  public formChanged = false;
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
      name: 'EDIT',
      link: ''
    }
  ];

  private updateSavingProductSub: any;
  private savingProductInfoSub: any;
  private routeSub: any;


  constructor(private updateSavingProductStore$: Store<UpdateSavingProductState>,
              private savingProductStore$: Store<SavingProductListState>,
              private savingProductInfoStore: Store<SavingProductState>,
              private router: Router,
              private route: ActivatedRoute,
              private savingProductUpdateService: SavingProductUpdateService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2) {
  }


  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.savingProductId = params.id;
      this.savingProductInfoStore.dispatch(new fromStore.LoadSavingProduct(this.savingProductId));
    });

    this.savingProductInfoSub = this.savingProductInfoStore.select(fromRoot.getSavingProductState).subscribe(
      (state: SavingProductState) => {
        this.savingProductState = state;
        if (state.loaded && state.success && !state.error) {

          if (state.savingProduct['availability']) {
            const availability = [{
              person_profile: false
            }, {
              company_profile: false
            }];
            state.savingProduct['availability'].map(type => {
              if (type === 'PERSON') {
                availability[0]['person_profile'] = true;
              }
              if (type === 'COMPANY') {
                availability[1]['company_profile'] = true;
              }
            });
            state = Object.assign({}, state, {
              savingProduct: state.savingProduct
            });
            state.savingProduct = Object.assign({}, state.savingProduct, {
              availability: availability
            });
          }
          this.savingProductForm.populate(state.savingProduct);
          this.savingProductForm.configsForAccounts(state.savingProduct);
        }
      });

    this.updateSavingProductSub = this.updateSavingProductStore$.select(fromRoot.getSavingProductUpdateState).subscribe(
      (state: UpdateSavingProductState) => {
        if (state.loaded && state.success && !state.error) {
          this.router.navigate(['/configuration', 'saving-products', state['data']['id']]);
        } else if (state.loaded && !state.success && state.error) {
          this.disableSubmitBtn(false);
          this.resetState();
        }
      });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cachedSavingProduct = this.savingProductForm.form.value;
    }, 800);
    this.savingProductForm.form.valueChanges.subscribe(data => {
      if (this.cachedSavingProduct) {
        this.formChanged = this.checkFormChanges(data, this.cachedSavingProduct);
      }
    })
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

    this.savingProductUpdateService.updateSavingProduct(savingProduct, this.savingProductId).subscribe((res: any) => {
      if (res.error) {
        this.toastrService.clear();
        this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
      } else {
        this.toastrService.clear();
        this.translate.get('UPDATE_SUCCESS').subscribe((message: string) => {
          this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
        });
        this.router.navigate(['/configuration', 'saving-products']);
      }
    });
    setTimeout(() => {
      this.savingProductStore$.dispatch(new fromStore.LoadSavingProductList());
    }, 300);
  }

  checkFormChanges(savingProductData, cachedData) {
    let status = false;
    if (savingProductData) {
      for (const key in savingProductData) {
        if (savingProductData.hasOwnProperty(key)) {
          if (key === 'currencyId') {
            if (savingProductData[key] !== cachedData['currencyId']) {
              status = true;
            }
          } else if (key === 'availability') {
            const personType = savingProductData[key][0]['person_profile'],
              cachedPerson = cachedData[key][0]['person_profile'],
              companyType = savingProductData[key][1]['company_profile'],
              cachedCompany = cachedData[key][1]['company_profile'];
            if (personType !== cachedPerson || companyType !== cachedCompany) {
              status = true;
            }
          } else {
            for (const k in cachedData) {
              if (cachedData.hasOwnProperty(k)) {
                if (key === k && savingProductData[key] !== cachedData[k]) {
                  status = true;
                }
              }
            }
          }
        }
      }
    }
    return status;
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.updateSavingProductStore$.dispatch(new fromStore.UpdateSavingProductReset());
  }

  goToViewSavingProducts() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'live'
      }
    };
    this.router.navigate(['/saving-products', this.savingProductId, 'info'], navigationExtras);
  }

  ngOnDestroy() {
    this.updateSavingProductSub.unsubscribe();
    this.savingProductInfoSub.unsubscribe();
    this.routeSub.unsubscribe();
    this.resetState();
  }
}
