import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NglModule } from 'ngx-lightning';

import { CoreModule } from '../../../../core/core.module';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './users-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { DependentOnRolesGuard } from './shared/role-dependent-guard.service';
import { UserSideNavService } from './shared/services/user-side-nav.service';
import { UserWrapComponent } from './user-wrap/user-wrap.component';
import { UserMakerCheckerComponent } from './user-maker-checker/user-maker-checker.component';

@NgModule({
  imports: [
    CommonModule,
    UsersRoutingModule,
    FormsModule,
    TranslateModule,
    NglModule,
    ReactiveFormsModule,
    CoreModule
  ],
  declarations: [
    UserListComponent,
    UserEditComponent,
    UserDetailsComponent,
    UserCreateComponent,
    UserWrapComponent,
    UserMakerCheckerComponent
  ],
  providers: [
    DependentOnRolesGuard,
    UserSideNavService
  ]
})
export class UsersModule {
}
