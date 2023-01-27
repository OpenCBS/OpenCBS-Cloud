import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';
import { NglModule } from 'ngx-lightning';

import { SavingProductListComponent } from './saving-product-list/saving-product-list.component';
import { SavingProductCreateComponent } from './saving-product-create/saving-product-create.component';
import { SavingProductInfoComponent } from './saving-product-info/saving-product-info.component';
import { SavingProductEditComponent } from './saving-product-edit/saving-product-edit.component';
import { SavingProductsRoutingModule } from './saving-products-routing.module';
import { SavingProductFormComponent } from './shared/saving-product-form/saving-product-form.component';
import { SavingProductSideNavService } from './shared/service/saving-product-side-nav.service';
import { SavingProductWrapComponent } from './saving-product-wrap/saving-product-wrap.component';
import { SavingProductMakerCheckerComponent } from './saving-product-maker-checker/saving-product-maker-checker.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NglModule,
    CoreModule,
    SavingProductsRoutingModule
  ],
  declarations: [
    SavingProductListComponent,
    SavingProductCreateComponent,
    SavingProductInfoComponent,
    SavingProductEditComponent,
    SavingProductFormComponent,
    SavingProductWrapComponent,
    SavingProductMakerCheckerComponent
  ],
  providers: [
    SavingProductSideNavService
  ]
})
export class SavingProductsModule {
}
