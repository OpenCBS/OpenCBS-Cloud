import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../../core/core.module';
import { TranslateModule } from '@ngx-translate/core';

import { ProfileFieldsRoutingModule } from './custom-fields-routing.module';
import { CustomFieldsComponent } from './custom-fields/custom-fields.component';
import { ProfileFieldsComponent } from './profile-fields/profile-fields.component';
import { LoanApplicationFieldsComponent } from './loan-application-fields/loan-application-fields.component';
import { BranchFieldsComponent } from './branch-fields/branch-fields.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    TranslateModule,
    ProfileFieldsRoutingModule
  ],
  declarations: [
    CustomFieldsComponent,
    ProfileFieldsComponent,
    LoanApplicationFieldsComponent,
    BranchFieldsComponent
  ]
})
export class ProfileFieldsModule {
}
