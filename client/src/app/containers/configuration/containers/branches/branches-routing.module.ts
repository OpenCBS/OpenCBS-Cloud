import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchEditComponent } from './branch-edit/branch-edit.component';
import { BranchInfoComponent } from './branch-info/branch-info.component';
import { OnEditCanDeactivateGuard } from '../../../../core/guards/on-edit-deactivate-guard.service';
import { BranchCreateComponent } from './branch-create/branch-create.component';

const routes: Routes = [
  {
    path: 'configuration/branches',
    component: BranchListComponent
  },
  {
    path: 'configuration/branches/create',
    component: BranchCreateComponent
  },
  {
    path: 'configuration/branches/info/:id',
    component: BranchInfoComponent
  },
  {
    path: 'configuration/branches/:id/edit',
    canDeactivate: [OnEditCanDeactivateGuard],
    component: BranchEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BranchesRoutingModule {
}
