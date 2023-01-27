import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoanPurposesListComponent } from './loan-purposes/loan-purposes.component';

const routes: Routes = [
  {
    path: 'configuration/loan-purposes',
    component: LoanPurposesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanPurposesRoutingModule {
}
