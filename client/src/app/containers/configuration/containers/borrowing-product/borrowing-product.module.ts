import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';
import { NglModule } from 'ngx-lightning';
import { BorrowingProductRoutingModule } from './borrowing-product-routing.module';
import { BorrowingProductInfoComponent } from './borrowing-product-info/borrowing-product-info.component';
import { BorrowingProductListComponent } from './borrowing-product-list/borrowing-product-list.component';
import { BorrowingProductCreateComponent } from './borrowing-product-create/borrowing-product-create.component';
import { BorrowingProductFormComponent } from './shared/borrowing-product-form/borrowing-product-form.component';
import { BorrowingProductUpdateComponent } from './borrowing-product-update/borrowing-product-update.component';
import { BorrowingProductExtraService } from './shared/service/borrowing-product-extra.service';
import { EditBorrowingProductFormComponent } from './shared/edit-borrowing-product-form/edit-borrowing-product-form.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    NglModule,
    CoreModule,
    BorrowingProductRoutingModule
  ],
  declarations: [
    BorrowingProductInfoComponent,
    BorrowingProductListComponent,
    BorrowingProductCreateComponent,
    BorrowingProductUpdateComponent,
    BorrowingProductFormComponent,
    EditBorrowingProductFormComponent
  ],
  providers: [
    BorrowingProductExtraService
  ]
})
export class BorrowingProductModule {
}
