import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoanPurposesRoutingModule } from './loan-purposes-routing.module';
import { LoanPurposesListComponent } from './loan-purposes/loan-purposes.component';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    LoanPurposesRoutingModule
  ],
  declarations: [
    LoanPurposesListComponent
  ]
})
export class LoanPurposesModule {
}
