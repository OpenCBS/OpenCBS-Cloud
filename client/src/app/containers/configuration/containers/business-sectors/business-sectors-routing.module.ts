import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusinessSectorsListComponent } from './business-sectors/business-sectors.component';

const routes: Routes = [
  {
    path: 'configuration/business-sectors',
    component: BusinessSectorsListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessSectorsRoutingModule {
}
