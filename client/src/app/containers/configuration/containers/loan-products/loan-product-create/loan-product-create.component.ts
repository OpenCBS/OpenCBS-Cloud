import { Component, OnInit, OnDestroy, ViewChild, Renderer2, ElementRef, ChangeDetectorRef} from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import { LoanProductCreateService, LoanProductListState } from '../../../../../core/store';
import { CreateLoanProductState } from '../../../../../core/store/loan-products';
import { LoanProductFormComponent } from '../shared/loan-product-form/loan-product-form.component';
import { environment } from '../../../../../../environments/environment';
import { Subscription } from 'rxjs';
import {ParseDateFormatService} from '../../../../../core/services';

const SVG_DATA = {
  collection: 'standard',
  class: 'product-required',
  name: 'product_required'
};

@Component({
  selector: 'cbs-create-loan-product',
  templateUrl: 'loan-product-create.component.html',
  styleUrls: ['loan-product-create.component.scss']
})
export class LoanProductCreateComponent implements OnInit, OnDestroy {
  @ViewChild(LoanProductFormComponent, {static: false}) loanProductForm: LoanProductFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public loanProduct: any;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'LOAN_PRODUCTS',
      link: '/configuration/loan-products'
    },
    {
      name: 'CREATE',
      link: ''
    }
  ];

  private createLoanProductSub: Subscription;

  constructor(private createLoanProductStore$: Store<CreateLoanProductState>,
              private loanProductListStateStore: Store<LoanProductListState>,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private loanProductCreateService: LoanProductCreateService,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private cdr: ChangeDetectorRef,
              private parseDateFormatService: ParseDateFormatService,
              private renderer2: Renderer2) {

  }

  ngOnInit() {
    this.createLoanProductSub = this.store$.pipe(select(fromRoot.getLoanProductCreateState))
      .subscribe((state: CreateLoanProductState) => {
        if ( state.loaded && state.success && !state.error ) {
          this.resetState();
          this.goToViewLoanProducts();
        } else if ( state.loaded && !state.success && state.error ) {
          this.disableSubmitBtn(false);
          this.resetState();
        }
      });

    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.createLoanProductSub.unsubscribe();
    this.resetState();
  }

  submitForm() {
    if ( this.loanProductForm.form.valid ) {
      if ( this.loanProductForm.form.controls['maturityDateMax'].value ) {
        const maturityDateMax = this.parseDateFormatService.parseDateValue(this.loanProductForm.form.controls['maturityDateMax'].value);
        this.loanProductForm.form.controls['maturityDateMax'].setValue(maturityDateMax);
      }
      this.loanProduct = Object.assign({}, this.loanProductForm.form.value);
      if ( this.loanProduct.availability.length ) {
        const availability = [];
        if ( this.loanProduct.availability[0] && this.loanProduct.availability[0]['person_profile'] ) {
          availability.push('PERSON');
        }

        if ( this.loanProduct.availability[1] && this.loanProduct.availability[1]['company_profile'] ) {
          availability.push('COMPANY');
        }

        if ( this.loanProduct.availability[2] && this.loanProduct.availability[2]['group_profile'] ) {
          availability.push('GROUP');
        }

        this.loanProduct.availability = availability;
      }

      const feesIdToSend = [];
      const penaltiesIdToSend = [];
      this.loanProductForm.selectedFees.map(fee => {
        feesIdToSend.push(fee.id);
      });
      this.loanProductForm.selectedPenalties.map(penalty => {
        penaltiesIdToSend.push(penalty.id);
      });

      this.loanProduct.fees = feesIdToSend;
      this.loanProduct.penalties = penaltiesIdToSend;
      const provisioning = [];
      this.loanProductForm.provisioning.map(provision => {
        provisioning.push(provision)
      });

      this.loanProduct.provisioning = provisioning;
      this.loanProduct.accountList = Object.assign({}, ...this.loanProduct['accountList']);

      this.loanProductCreateService.createLoanProduct(this.loanProduct)
        .subscribe((res: any) => {
          if ( res.error ) {
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.toastrService.clear();
            this.translate.get('CREATE_SUCCESS').subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['/configuration', 'loan-products']);
          }
        });
      this.loanProductListStateStore.dispatch(new fromStore.LoadLoanProductList());
    }
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.createLoanProductStore$.dispatch(new fromStore.CreateLoanProductReset());
  }

  goToViewLoanProducts() {
    this.router.navigate(['configuration', 'loan-products']);
  }
}
