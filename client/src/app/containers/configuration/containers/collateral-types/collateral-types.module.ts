import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';

import { CollateralTypesRoutingModule } from './collateral-types-routing.module';
import { CollateralTypeListComponent } from './collateral-type-list/collateral-type-list.component';
import { CollateralTypeDetailsComponent } from './collatereral-type-details/collateral-type-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    TranslateModule,
    CollateralTypesRoutingModule
  ],
  declarations: [
    CollateralTypeListComponent,
    CollateralTypeDetailsComponent
  ]
})
export class CollateralTypesModule {
}
