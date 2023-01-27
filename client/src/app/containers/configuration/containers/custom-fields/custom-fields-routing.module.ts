import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomFieldsComponent } from './custom-fields/custom-fields.component';
import { ProfileFieldsComponent } from './profile-fields/profile-fields.component';
import { LoanApplicationFieldsComponent } from './loan-application-fields/loan-application-fields.component';
import { BranchFieldsComponent } from './branch-fields/branch-fields.component';

const routes: Routes = [
  {
    path: 'configuration/custom-field',
    component: CustomFieldsComponent
  },
  {
    path: 'configuration/profile-custom-field/:type',
    component: ProfileFieldsComponent
  },
  {
    path: 'configuration/loan-application-custom-field',
    component: LoanApplicationFieldsComponent
  },
  {
    path: 'configuration/branch-custom-field',
    component: BranchFieldsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileFieldsRoutingModule {
}
