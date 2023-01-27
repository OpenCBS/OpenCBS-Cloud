import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RoleListComponent } from './role-list/role-list.component';
import { RoleCreateComponent } from './role-create/role-create.component';
import { RoleDetailsComponent } from './role-details/role-details.component';
import { RoleEditComponent } from './role-edit/role-edit.component';
import { OnEditCanDeactivateGuard } from '../../../../core/guards/on-edit-deactivate-guard.service';
import { AuthGuard } from '../../../../core/guards';
import { RoleWrapComponent } from './role-wrap/role-wrap.component';
import { RoleHistoryComponent } from './role-history/role-history.component';
import { RoleMakerCheckerComponent } from './role-maker-checker/role-maker-checker.component';

const routes: Routes = [
  {
    path: 'configuration/roles',
    component: RoleListComponent
  },
  {
    path: 'roles/:id',
    component: RoleWrapComponent,
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: RoleDetailsComponent,
      },
      {
        path: 'maker-checker',
        component: RoleMakerCheckerComponent,
      },
      {
        path: 'history',
        component: RoleHistoryComponent
      }
    ]
  },
  {
    path: 'configuration/roles/new',
    component: RoleCreateComponent,
  },
  {
    path: 'configuration/roles/:id/edit',
    component: RoleEditComponent,
    canDeactivate: [OnEditCanDeactivateGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RolesRoutingModule {
}
