import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfessionsComponent } from './professions/professions.component';

const routes: Routes = [
  {
    path: 'configuration/professions',
    component: ProfessionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionsRoutingModule {
}
