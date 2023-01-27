import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OtherFeesListComponent } from './other-fees-list/other-fees-list.component';

const routes: Routes = [
  {
    path: 'configuration/other-fees-list',
    component: OtherFeesListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OtherFeesListRoutingModule {
}
