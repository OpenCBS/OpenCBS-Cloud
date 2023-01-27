import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NglModule } from 'ngx-lightning';
import { CoreModule } from '../../../../core/core.module';

import { OtherFeesListRoutingModule } from './other-fees-list-routing.module';
import { OtherFeesListComponent } from './other-fees-list/other-fees-list.component';
import { OtherFeesListFormModalComponent } from './shared/other-fees-list-form-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    TranslateModule,
    NglModule,
    OtherFeesListRoutingModule
  ],
  declarations: [
    OtherFeesListComponent,
    OtherFeesListFormModalComponent
  ]
})
export class OtherFeesListModule {
}
