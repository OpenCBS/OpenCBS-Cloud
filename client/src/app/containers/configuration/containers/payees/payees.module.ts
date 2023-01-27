import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PayeesRoutingModule } from './payees-routing.module';
import { PayeeListComponent } from './payees/payees.component';
import { CoreModule } from '../../../../core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import { NglModule } from 'ngx-lightning';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    TranslateModule,
    PayeesRoutingModule,
    ReactiveFormsModule,
    NglModule
  ],
  declarations: [PayeeListComponent]
})
export class PayeesModule {
}
