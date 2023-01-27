import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';
import { NglModule } from 'ngx-lightning';
import { TermDepositProductRoutingModule } from './term-deposit-product-routing.module';
import { TermDepositProductInfoComponent } from './term-deposit-product-info/term-deposit-product-info.component';
import { TermDepositProductListComponent } from './term-deposit-product-list/term-deposit-product-list.component';
import { TermDepositProductCreateComponent } from './term-deposit-product-create/term-deposit-product-create.component';
import { TermDepositProductFormComponent } from './shared/term-deposit-product-form/term-deposit-product-form.component';
import { TermDepositProductExtraService } from './shared/service/term-deposit-product-extra.service';
import { TermDepositProductSideNavService } from './shared/service/term-deposit-product-side-nav.service';
import { TermDepositProductMakerCheckerComponent } from './term-deposit-product-maker-checker/term-deposit-product-maker-checker.component';
import { TermDepositProductWrapComponent } from './term-deposit-product-wrap/term-deposit-product-wrap.component';
import { TermDepositProductEditComponent } from './term-deposit-product-edit/term-deposit-product-edit.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NglModule,
    CoreModule,
    TermDepositProductRoutingModule
  ],
  declarations: [
    TermDepositProductInfoComponent,
    TermDepositProductListComponent,
    TermDepositProductCreateComponent,
    TermDepositProductFormComponent,
    TermDepositProductEditComponent,
    TermDepositProductWrapComponent,
    TermDepositProductMakerCheckerComponent],
  providers: [
    TermDepositProductExtraService,
    TermDepositProductSideNavService
  ]
})
export class TermDepositProductModule {
}
