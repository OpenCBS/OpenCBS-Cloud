import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import {
  ITermDepositProductInfo, LoadTermDepositProduct
} from '../../../../../core/store/term-deposit-products/term-deposit-product-info';
import {
  IUpdateTermDepositProduct
} from '../../../../../core/store/term-deposit-products/term-deposit-product-update';
import { environment } from '../../../../../../environments/environment';
import { TermDepositProductFormComponent } from '../shared/term-deposit-product-form/term-deposit-product-form.component';
import { ITermDepositProductList, TermDepositProductUpdateService } from '../../../../../core/store';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'standard', class: 'calibration', name: 'calibration'};

@Component({
  selector: 'cbs-term-deposit-product-edit',
  templateUrl: 'term-deposit-product-edit.component.html',
  styleUrls: ['term-deposit-product-edit.component.scss']
})
export class TermDepositProductEditComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(TermDepositProductFormComponent, {static: false}) termDepositProductForm: TermDepositProductFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public isOpen = false;
  public formChanged = false;
  public termDepositProductId: number;
  public cachedAccountList: any;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'TERM_DEPOSIT_PRODUCTS',
      link: '/configuration/term-deposit-products'
    },
    {},
    {
      name: 'EDIT',
      link: ''
    }
  ];

  private termDepositProductState: any;
  private cachedTermDepositProduct: any;
  private routeSub: Subscription;
  private termDepositProductSub: Subscription;
  private termDepositProductUpdateSub: Subscription;

  constructor(private termDepositProductUpdateStore$: Store<IUpdateTermDepositProduct>,
              private termDepositProductListStateStore: Store<ITermDepositProductList>,
              private termDepositProductStore$: Store<ITermDepositProductInfo>,
              private router: Router,
              private route: ActivatedRoute,
              private termDepositProductUpdateService: TermDepositProductUpdateService,
              private toasterService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      const id = +params['id'];
      if ( id === +params['id'] ) {
        this.termDepositProductId = +params['id'];
        this.termDepositProductStore$.dispatch(new LoadTermDepositProduct(this.termDepositProductId));
      }
    });

    this.termDepositProductSub = this.termDepositProductStore$.pipe(select(fromRoot.getTermDepositProductInfoState))
      .subscribe((termDepositProductState: ITermDepositProductInfo) => {
        if ( termDepositProductState.success && termDepositProductState.loaded && !termDepositProductState.error ) {
          this.cachedTermDepositProduct = termDepositProductState.termDepositProduct;

          if ( this.cachedTermDepositProduct['availability'] ) {
            const availability = [{
              person_profile: false
            }, {
              company_profile: false
            }];
            this.cachedTermDepositProduct['availability'].map(type => {
              if ( type === 'PERSON' ) {
                availability[0]['person_profile'] = true;
              }
              if ( type === 'COMPANY' ) {
                availability[1]['company_profile'] = true;
              }
            });
            termDepositProductState = Object.assign({}, termDepositProductState, {
              termDepositProduct: this.cachedTermDepositProduct
            });
            this.cachedTermDepositProduct = Object.assign({}, this.cachedTermDepositProduct, {
              availability: availability
            });
          }

          if ( this.termDepositProductForm && this.termDepositProductForm.form ) {
            this.termDepositProductForm.populateFields(this.cachedTermDepositProduct);
          }
          this.breadcrumbLinks[2] = {
            name: `${termDepositProductState.termDepositProduct['name']}`,
            link: `/configuration/term-deposit-products/${this.cachedTermDepositProduct['id']}`
          };
          setTimeout(() => {
            this.cachedAccountList = this.termDepositProductForm.form.value['accountList'];
          }, 700);
        }

        this.termDepositProductState = termDepositProductState;
      });

    this.termDepositProductUpdateSub = this.termDepositProductUpdateStore$.pipe(select(fromRoot.getTermDepositProductUpdateState))
      .subscribe((termDepositProductUpdateState: IUpdateTermDepositProduct) => {
        if ( termDepositProductUpdateState.loaded && termDepositProductUpdateState.success && !termDepositProductUpdateState.error ) {
          this.router.navigate(['/configuration', 'term-deposit-products', this.termDepositProductId]);
        } else if ( termDepositProductUpdateState.loaded && !termDepositProductUpdateState.success && termDepositProductUpdateState.error ) {
          this.disableSubmitBtn(false);
          this.resetState();
        }
      });
  }

  goToViewTermDepositProducts() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        type: 'live'
      }
    };
    this.router.navigate(['term-deposit-products', this.termDepositProductId], navigationExtras);
  }

  resetState() {
    this.termDepositProductUpdateStore$.dispatch(new fromStore.UpdateTermDepositProductReset());
  };

  ngAfterViewInit() {
    if ( this.termDepositProductForm && this.termDepositProductForm.form ) {
      this.termDepositProductForm.form.valueChanges.subscribe(data => {
        this.formChanged = (this.checkFormChanges(data, this.cachedTermDepositProduct));
      });
    }
  }

  submitForm() {
    const termDepositProduct = this.termDepositProductForm.form.value;
    if ( this.termDepositProductForm.form.valid ) {
      if ( termDepositProduct.availability.length ) {
        const availability = [];
        if ( termDepositProduct.availability[0]
          && termDepositProduct.availability[0]['person_profile'] ) {
          availability.push('PERSON');
        }

        if ( termDepositProduct.availability[1]
          && termDepositProduct.availability[1]['company_profile'] ) {
          availability.push('COMPANY');
        }

        termDepositProduct.availability = availability;
      }
      termDepositProduct.accountList = Object.assign({}, ...termDepositProduct['accountList']);
      this.termDepositProductUpdateService.updateTermDepositProduct(termDepositProduct, this.termDepositProductId)
        .subscribe((res: any) => {
          if ( res.error ) {
            this.toasterService.clear();
            this.toasterService.error(res.message, '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.toasterService.clear();
            this.translate.get('UPDATE_SUCCESS').subscribe((message: string) => {
              this.toasterService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['/configuration', 'term-deposit-products']);
          }
        });
      setTimeout(() => {
        this.termDepositProductListStateStore.dispatch(new fromStore.LoadTermDepositProductList());
      }, 300);
    }
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  ngOnDestroy() {
    this.resetState();
    this.routeSub.unsubscribe();
    this.termDepositProductSub.unsubscribe();
    this.termDepositProductUpdateSub.unsubscribe();
  }

  checkFormChanges(termDepositProductData, cachedData) {
    let status = false;
    if ( termDepositProductData ) {
      for (const key in termDepositProductData) {
        if ( termDepositProductData.hasOwnProperty(key) ) {
          if ( key === 'currencyId' ) {
            if ( termDepositProductData[key] !== cachedData['currency']['id'] ) {
              status = true;
            }
          } else if ( key === 'availability' ) {
            const personType = termDepositProductData[key][0]['person_profile'],
              cachedPerson = cachedData[key][0]['person_profile'],
              companyType = termDepositProductData[key][1]['company_profile'],
              cachedCompany = cachedData[key][1]['company_profile'];
            if ( personType !== cachedPerson || companyType !== cachedCompany ) {
              status = true;
            }
          } else {
            for (const k in cachedData) {
              if ( cachedData.hasOwnProperty(k) ) {
                if ( key === k && termDepositProductData[key] !== cachedData[k] ) {
                  status = true;
                }
              }
            }
          }
        }
      }
      if ( this.cachedAccountList ) {
        for (const key in termDepositProductData.accountList) {
          if ( termDepositProductData.accountList[key] !== this.cachedAccountList[key] ) {
            status = true;
          }
        }
      }
    }
    return status;
  }
}
