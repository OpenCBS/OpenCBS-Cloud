import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserListComponent } from './users-list/user-list.component';
import { UserEditComponent } from './user-edit/user-edit.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { DependentOnRolesGuard } from './shared/role-dependent-guard.service';
import { OnEditCanDeactivateGuard } from '../../../../core/guards/on-edit-deactivate-guard.service';
import { UserWrapComponent } from './user-wrap/user-wrap.component';
import { AuthGuard } from '../../../../core/guards';
import { UserMakerCheckerComponent } from './user-maker-checker/user-maker-checker.component';

const routes: Routes = [
  {
    path: 'configuration/users',
    component: UserListComponent
  },
  {
    path: 'users/:id',
    component: UserWrapComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: UserDetailsComponent,
      },
      {
        path: 'maker-checker',
        component: UserMakerCheckerComponent,
      },
      // {
      //   path: 'history',
      //   component: UserHistoryComponent
      // }
    ]
  },
  {
    path: 'configuration/users/new',
    component: UserCreateComponent,
    canActivate: [DependentOnRolesGuard]
  },
  {
    path: 'configuration/users/:id/edit',
    component: UserEditComponent,
    canDeactivate: [OnEditCanDeactivateGuard],
    canActivate: [DependentOnRolesGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule {
}
