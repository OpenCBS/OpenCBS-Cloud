import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CCRulesComponent } from './credit-committee-list/credit-committee-list.component';
import { CCNewRulesComponent } from './credit-committee-create/credit-committee-create.component';
import { CCRulesEditComponent } from './credit-committee-edit/credit-committee-edit.component';
import { CCRulesInfoComponent } from './credit-committee-info/credit-committee-info.component';
import { OnEditCanDeactivateGuard } from '../../../../core/guards/on-edit-deactivate-guard.service';

const routes: Routes = [
  {
    path: 'configuration/credit-committee-rules',
    component: CCRulesComponent,
  },
  {
    path: 'configuration/credit-committee-new-rules',
    component: CCNewRulesComponent,
  },
  {
    path: 'configuration/credit-committee-rules/:id/edit',
    canDeactivate: [OnEditCanDeactivateGuard],
    component: CCRulesEditComponent
  },
  {
    path: 'configuration/credit-committee-rules-info/:id',
    component: CCRulesInfoComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreditCommitteeRoutingModule {
}
