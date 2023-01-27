import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoanPayeesWrapComponent } from './loan-payee-wrap/loan-payees-wrap.component';
import { LoanPayeesInfoComponent } from './loan-payee-info/loan-payees-info.component';
import { LoanPayeesEventsComponent } from './loan-payee-events/loan-payees-events.component';


const routes: Routes = [
  {
    path: 'payees/:id',
    component: LoanPayeesWrapComponent,
    data: {groupName: 'PAYEES'},
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: LoanPayeesInfoComponent,
      },
      {
        path: 'events',
        component: LoanPayeesEventsComponent,
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoanPayeeRoutingModule {
}
