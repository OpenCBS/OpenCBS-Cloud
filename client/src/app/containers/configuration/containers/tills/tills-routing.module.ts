import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TillsComponent } from './till-list/tills.component';
import { TillCreateComponent } from './till-create/till-create.component';
import { TillInfoComponent } from './till-info/till-info.component';
import { TillEditComponent } from './till-edit/till-edit.component';

const routes: Routes = [
  {
    path: 'configuration/tills',
    component: TillsComponent
  },
  {
    path: 'configuration/tills/create',
    component: TillCreateComponent
  },
  {
    path: 'configuration/tills/:id',
    component: TillInfoComponent
  },
  {
    path: 'configuration/tills/:id/edit',
    component: TillEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TillsRoutingModule {
}
