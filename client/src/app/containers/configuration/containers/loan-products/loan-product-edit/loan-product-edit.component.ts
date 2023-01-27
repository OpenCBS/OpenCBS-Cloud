import { Component, OnInit, ViewChild, OnDestroy, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { LoanProductListState, LoanProductUpdateService } from '../../../../../core/store';
import { LoanProductState, UpdateLoanProductState, } from '../../../../../core/store/loan-products';
import { LoadLoanProduct } from '../../../../../core/store/loan-products/loan-product';
import { EditLoanProductFormComponent } from '../shared/edit-loan-product-form/edit-loan-product-form.component';
import { environment } from '../../../../../../environments/environment';
import { Subscription } from 'rxjs';
import { ParseDateFormatService } from '../../../../../core/services';

const SVG_DATA = {
  collection: 'standard',
  class: 'product-required',
  name: 'product_required'
};

@Component({
  selector: 'cbs-edit-loan-product',
  templateUrl: 'loan-product-edit.component.html',
  styleUrls: ['loan-product-edit.component.scss']
})
export class LoanProductEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(EditLoanProductFormComponent, {static: false}) editLoanProductForm: EditLoanProductFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public loanProductId: number;
  public loanProductState: LoanProductState;
  public formChanged = false;
  public cachedEntryFees = [];
  public cachedPenalties = [];
  public isOpen = false;
  public accounts: any;
  public cachedAccountList: any;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'LOAN_PRODUCTS',
      link: '/configuration/loan-products'
    },
    {},
    {
      name: 'EDIT',
      link: ''
    }
  ];

  private isLeaving = false;
  private isSubmitting = false;
  private nextRoute: string;
  private cachedLoanProduct: any;
  private loanProductUpdateState: any;
  private loanProductSub: Subscription;
  private routeSub: Subscription;
  private loanProductUpdateSub: Subscription;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private loanProductStore$: Store<LoanProductState>,
              private loanProductListStateStore: Store<LoanProductListState>,
              private loanProductUpdateStore$: Store<UpdateLoanProductState>,
              private store$: Store<fromRoot.State>,
              private loanProductUpdateService: LoanProductUpdateService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private parseDateFormatService: ParseDateFormatService,
              private renderer2: Renderer2) {
    this.loanProductSub = this.store$.pipe(select(fromRoot.getLoanProductState)).subscribe(
      (loanProductState: LoanProductState) => {
        if ( loanProductState.success && loanProductState.loaded && loanProductState.loanProduct ) {
          this.breadcrumbLinks[1] = {
            name: `${loanProductState.loanProduct['name']}`,
            link: `/configuration/loan-products/${loanProductState.loanProduct['id']}`
          };

          if ( loanProductState.loanProduct['availability'] ) {
            const availability = [{
              person_profile: false
            }, {
              company_profile: false
            }, {
              group_profile: false
            }];
            loanProductState.loanProduct['availability'].map(type => {
              if ( type === 'PERSON' ) {
                availability[0]['person_profile'] = true;
              }
              if ( type === 'COMPANY' ) {
                availability[1]['company_profile'] = true;
              }
              if ( type === 'GROUP' ) {
                availability[2]['group_profile'] = true;
              }
            });
            loanProductState = Object.assign({}, loanProductState, {
              loanProduct: loanProductState.loanProduct
            });
            loanProductState.loanProduct = Object.assign({}, loanProductState.loanProduct, {
              availability: availability
            });
          }
          this.cachedLoanProduct = loanProductState.loanProduct;
          if ( this.editLoanProductForm && this.editLoanProductForm.form ) {
            this.editLoanProductForm.populateFields(loanProductState.loanProduct);
            this.editLoanProductForm.selectedFees = loanProductState.loanProduct['fees'];
            this.editLoanProductForm.selectedPenalties = loanProductState.loanProduct['penalties'];
          }
          loanProductState.loanProduct['fees'].map(entryFee => {
            this.cachedEntryFees.push(entryFee);
          });
          loanProductState.loanProduct['penalties'].map(penalty => {
            this.cachedPenalties.push(penalty);
          });
          setTimeout(() => {
            this.cachedAccountList = this.editLoanProductForm.form.value['accountList'];
          }, 700);
        }
        this.loanProductState = loanProductState;
      });
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      const id = +params['id'];
      if ( id === +params['id'] ) {
        this.loanProductId = +params['id'];
        this.loanProductStore$.dispatch(new LoadLoanProduct(this.loanProductId));
      }
    });

    this.loanProductUpdateSub = this.store$.select(fromRoot.getLoanProductUpdateState).subscribe(
      (loanProductUpdateState: UpdateLoanProductState) => {
        this.loanProductUpdateState = loanProductUpdateState;
        if ( loanProductUpdateState.loaded && loanProductUpdateState.success && !loanProductUpdateState.error ) {
          this.resetState();
        } else if ( loanProductUpdateState.loaded && !loanProductUpdateState.success && loanProductUpdateState.error ) {
          this.resetState();
        }
      });
  }

  canDeactivate(url?) {
    this.nextRoute = url;
    if ( this.formChanged && !this.isSubmitting ) {
      this.isOpen = true;
      return this.isLeaving;
    } else {
      return true;
    }
  }

  goToNextRoute() {
    this.isLeaving = true;
    this.router.navigateByUrl(this.nextRoute);
  }

  closeConfirmPopup() {
    this.isOpen = false;
  }

  ngAfterViewInit() {
    if ( this.editLoanProductForm && this.editLoanProductForm.form ) {
      this.editLoanProductForm.form.valueChanges.subscribe(data => {
        this.formChanged = (this.checkFormChanges(data, this.cachedLoanProduct));
      });
    }
  }

  goToViewLoanProducts() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'live'
      }
    };
    this.router.navigate(['/loan-products', this.loanProductId, 'info'], navigationExtras);
  }

  resetState() {
    this.loanProductUpdateStore$.dispatch(new fromStore.UpdateLoanProductReset());
  };

  submitForm() {
    if ( this.editLoanProductForm.form.controls['maturityDateMax'].value ) {
      const maturityDateMax = this.parseDateFormatService.parseDateValue(this.editLoanProductForm.form.controls['maturityDateMax'].value);
      this.editLoanProductForm.form.controls['maturityDateMax'].setValue(maturityDateMax);
    }

    const loanProduct = this.editLoanProductForm.form.value;
    if ( this.editLoanProductForm.form.valid ) {
      this.isSubmitting = true;
      if ( loanProduct.availability.length ) {
        const availability = [];
        if ( loanProduct.availability[0]
          && loanProduct.availability[0]['person_profile'] ) {
          availability.push('PERSON');
        }

        if ( loanProduct.availability[1]
          && loanProduct.availability[1]['company_profile'] ) {
          availability.push('COMPANY');
        }

        if ( loanProduct.availability[2]
          && loanProduct.availability[2]['group_profile'] ) {
          availability.push('GROUP');
        }

        loanProduct.availability = availability;
      }
      const feesIdToSend = [];
      const penaltiesIdToSend = [];
      this.editLoanProductForm.selectedFees.map(fee => {
        feesIdToSend.push(fee.id);
      });
      this.editLoanProductForm.selectedPenalties.map(penalty => {
        penaltiesIdToSend.push(penalty.id);
      });
      loanProduct.fees = feesIdToSend;
      loanProduct.penalties = penaltiesIdToSend;
      const provisioning = [];
      this.editLoanProductForm.provisioning.map(provision => {
        provisioning.push(provision)
      });
      loanProduct.provisioning = provisioning;
      loanProduct.accountList = Object.assign({}, ...loanProduct['accountList']);
      this.loanProductUpdateService.updateLoanProduct(loanProduct, this.loanProductId)
        .subscribe((res: any) => {
          if ( res.error ) {
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.toastrService.clear();
            this.translate.get('UPDATE_SUCCESS').subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['/configuration', 'loan-products']);
          }
        });
      setTimeout(() => {
        this.loanProductListStateStore.dispatch(new fromStore.LoadLoanProductList());
      }, 300);
    }
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  ngOnDestroy() {
    this.resetState();
    this.routeSub.unsubscribe();
    this.loanProductSub.unsubscribe();
    this.loanProductUpdateSub.unsubscribe();
  }

  checkFormChanges(loanProductData, cachedData) {
    let status = false;
    if ( loanProductData ) {
      for (const key in loanProductData) {
        if ( loanProductData.hasOwnProperty(key) ) {
          if ( key === 'currencyId' ) {
            if ( loanProductData[key] && !cachedData['currency'] ) {
              status = true;
            }
            if ( cachedData['currency'] && loanProductData[key] !== cachedData['currency']['id'] ) {
              status = true;
            }
          } else if ( key === 'availability' ) {
            const personType = loanProductData[key][0]['person_profile'],
              cachedPerson = cachedData[key][0]['person_profile'],
              companyType = loanProductData[key][1]['company_profile'],
              cachedCompany = cachedData[key][1]['company_profile'],
              groupType = loanProductData[key][2]['group_profile'],
              cachedGroup = cachedData[key][2]['group_profile'];
            if ( personType !== cachedPerson || companyType !== cachedCompany || groupType !== cachedGroup ) {
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

  changeEntryFeesValue() {
    if ( this.editLoanProductForm.selectedFees.length === this.cachedEntryFees.length ) {
      const cachedIds = this.getIds(this.cachedEntryFees).sort();
      const selectedIds = this.getIds(this.editLoanProductForm.selectedFees).sort();
      if ( cachedIds.length === selectedIds.length && cachedIds.every((v, i) => v === selectedIds[i]) ) {
        this.formChanged = false;
      }
    } else {
      this.formChanged = true;
    }
  }

  changePenaltiesValue() {
    if ( this.editLoanProductForm.selectedPenalties.length === this.cachedPenalties.length ) {
      const cachedIds = this.getIds(this.cachedPenalties).sort();
      const selectedIds = this.getIds(this.editLoanProductForm.selectedPenalties).sort();
      if ( cachedIds.length === selectedIds.length && cachedIds.every((v, i) => v === selectedIds[i]) ) {
        this.formChanged = false;
      }
    } else {
      this.formChanged = true;
    }
  }

  getIds(array) {
    return array.map((x) => {
      return x['id'];
    });
  }
}
