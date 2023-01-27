import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EntryFeesComponent } from './entry-fees-list/entry-fees.component';

const routes: Routes = [
  {
    path: 'configuration/entry-fees',
    component: EntryFeesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EntryFeesRoutingModule {
}
