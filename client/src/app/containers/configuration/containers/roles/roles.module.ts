import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { DependentOnRolesGuard } from './shared/role-dependent-guard.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';
import { RoleWrapComponent } from './role-wrap/role-wrap.component';
import { RoleSideNavService } from './shared/services/role-side-nav.service';
import { RoleHistoryComponent } from './role-history/role-history.component';
import { RoleMakerCheckerComponent } from './role-maker-checker/role-maker-checker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CoreModule,
    RolesRoutingModule
  ],
  declarations: [
    RoleListComponent,
    RoleCreateComponent,
    RoleDetailsComponent,
    RoleEditComponent,
    RoleWrapComponent,
    RoleHistoryComponent,
    RoleMakerCheckerComponent
  ],
  providers: [
    DependentOnRolesGuard,
    RoleSideNavService
  ]
})
export class RolesModule {
}
