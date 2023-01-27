import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import * as fromRoot from '../../../../../core/core.reducer';
import * as fromStore from '../../../../../core/store';
import {
  ICreateTermDepositProduct, TermDepositProductCreateService
} from '../../../../../core/store/term-deposit-products/term-deposit-product-create';
import { TermDepositProductFormComponent } from '../shared/term-deposit-product-form/term-deposit-product-form.component';
import { environment } from '../../../../../../environments/environment';
import { Subscription } from 'rxjs';

const SVG_DATA = {collection: 'standard', class: 'calibration', name: 'calibration'};

@Component({
  selector: 'cbs-term-deposit-product-create',
  templateUrl: './term-deposit-product-create.component.html'
})

export class TermDepositProductCreateComponent implements OnInit {
  @ViewChild(TermDepositProductFormComponent, {static: false}) termDepositProductForm: TermDepositProductFormComponent;
  @ViewChild('submitButton', {static: false}) submitButton: ElementRef;
  public svgData = SVG_DATA;
  public breadcrumbLinks = [
    {
      name: 'CONFIGURATION',
      link: '/configuration'
    },
    {
      name: 'TERM_DEPOSIT_PRODUCTS',
      link: '/configuration/term-deposit-products'
    },
    {
      name: 'CREATE',
      link: ''
    }
  ];

  private createTermDepositProductSub: Subscription;

  constructor(private createTermDepositProductStore$: Store<ICreateTermDepositProduct>,
              private termDepositProductCreateService: TermDepositProductCreateService,
              private router: Router,
              private store$: Store<fromRoot.State>,
              private toastrService: ToastrService,
              private translate: TranslateService,
              private renderer2: Renderer2) {
  }

  ngOnInit() {
    this.createTermDepositProductSub = this.store$.pipe(select(fromRoot.getTermDepositProductCreateState))
      .subscribe((state: ICreateTermDepositProduct) => {
        if ( state.loaded && state.success && !state.error ) {
          this.resetState();
          this.goToViewTermDepositProducts();
        } else if ( state.loaded && !state.success && state.error ) {
          this.disableSubmitBtn(false);
          this.resetState();
        }
      });
  }

  submitForm() {
    if ( this.termDepositProductForm.form.valid ) {
      const termDepositProduct = {...this.termDepositProductForm.form.value};
      if ( termDepositProduct.availability.length ) {
        const availability = [];
        if ( termDepositProduct.availability[0] && termDepositProduct.availability[0]['person_profile'] ) {
          availability.push('PERSON');
        }

        if ( termDepositProduct.availability[1] && termDepositProduct.availability[1]['company_profile'] ) {
          availability.push('COMPANY');
        }

        termDepositProduct.availability = availability;
      }

      termDepositProduct.accountList = Object.assign({}, ...termDepositProduct['accountList']);
      this.termDepositProductCreateService.createTermDepositProduct(termDepositProduct)
        .subscribe((res: any) => {
          if ( res.error ) {
            this.toastrService.clear();
            this.toastrService.error(res.message ? res.message : 'ERROR', '', environment.ERROR_TOAST_CONFIG);
          } else {
            this.toastrService.clear();
            this.translate.get('CREATE_SUCCESS').subscribe((message: string) => {
              this.toastrService.success(message, '', environment.SUCCESS_TOAST_CONFIG);
            });
            this.router.navigate(['/configuration', 'term-deposit-products']);
          }
        });
      this.createTermDepositProductStore$.dispatch(new fromStore.LoadTermDepositProductList());
    }
  }

  disableSubmitBtn(bool) {
    this.renderer2.setProperty(this.submitButton.nativeElement, 'disabled', bool);
  }

  resetState() {
    this.createTermDepositProductStore$.dispatch(new fromStore.CreateTermDepositProductReset());
  }

  goToViewTermDepositProducts() {
    this.router.navigate(['configuration', 'term-deposit-products']);
  }
}
