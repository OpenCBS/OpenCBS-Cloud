import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';

import { CreditCommitteeRoutingModule } from './credit-committee-routing.module';
import { CCNewRulesComponent } from './credit-committee-create/credit-committee-create.component';
import { CCRulesEditComponent } from './credit-committee-edit/credit-committee-edit.component';
import { CCRulesInfoComponent } from './credit-committee-info/credit-committee-info.component';
import { CCRulesComponent } from './credit-committee-list/credit-committee-list.component';
import { CCRulesFormComponent } from './shared/credit-committee-form.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    TranslateModule,
    CoreModule,
    CreditCommitteeRoutingModule
  ],
  declarations: [
    CCNewRulesComponent,
    CCRulesEditComponent,
    CCRulesInfoComponent,
    CCRulesComponent,
    CCRulesFormComponent
  ]
})
export class CreditCommitteeModule {
}
