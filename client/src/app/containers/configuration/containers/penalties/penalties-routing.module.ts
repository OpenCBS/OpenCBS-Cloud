import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PenaltiesComponent } from './penalties-list/penalties.component';

const routes: Routes = [
  {
    path: 'configuration/penalties',
    component: PenaltiesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PenaltiesRoutingModule {
}
