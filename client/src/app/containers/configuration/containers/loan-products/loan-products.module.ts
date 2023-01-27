import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';

import { LoanProductsRoutingModule } from './loan-products-routing.module';
import { LoanProductCreateComponent } from './loan-product-create/loan-product-create.component';
import { LoanProductEditComponent } from './loan-product-edit/loan-product-edit.component';
import { LoanProductInfoComponent } from './loan-product-info/loan-product-info.component';
import { LoanProductListComponent } from './loan-product-list/loan-product-list.component';
import { EntryFeesPicklistComponent } from './shared/entry-fee-picklist/entry-fee-picklist.component';
import { SelectedEntryFeesComponent } from './shared/entry-fees-selected/entry-fees-selected.component';
import { LoanProductFormComponent } from './shared/loan-product-form/loan-product-form.component';
import { NglModule } from 'ngx-lightning';
import { LoanProductExtraService } from './shared/service/loan-product-extra.service';
import { EditLoanProductFormComponent } from './shared/edit-loan-product-form/edit-loan-product-form.component';
import { LoanProductSideNavService } from './shared/service/loan-product-side-nav.service';
import { LoanProductWrapComponent } from './loan-product-wrap/loan-product-wrap.component';
import { LoanProductMakerCheckerComponent } from './loan-product-maker-checker/loan-product-maker-checker.component';
import { LoanProductHistoryComponent } from './loan-product-history/loan-product-history.component';
import { SelectedPenaltiesComponent } from './shared/penalties-selected/penalties-selected.component';
import { PenaltiesPicklistComponent } from './shared/penalty-picklist/penalty-picklist.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    NglModule,
    CoreModule,
    LoanProductsRoutingModule
  ],
  declarations: [
    LoanProductCreateComponent,
    LoanProductEditComponent,
    LoanProductInfoComponent,
    LoanProductHistoryComponent,
    LoanProductListComponent,
    EntryFeesPicklistComponent,
    SelectedEntryFeesComponent,
    LoanProductFormComponent,
    EditLoanProductFormComponent,
    LoanProductWrapComponent,
    LoanProductMakerCheckerComponent,
    SelectedPenaltiesComponent,
    PenaltiesPicklistComponent
  ],
  exports: [
    SelectedPenaltiesComponent,
    PenaltiesPicklistComponent
  ],
  providers: [
    LoanProductExtraService,
    LoanProductSideNavService
  ]
})
export class LoanProductsModule {
}
