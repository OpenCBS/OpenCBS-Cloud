import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportListComponent } from './report-list-component/report-list.component';
import { ReportComponent } from './report-component/report.component';
import { RouteGuard } from '../../core/guards/route-guard.service';

const routes: Routes = [
  {
    path: 'report-list',
    component: ReportListComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'REPORTS'}
  },
  {
    path: 'report',
    component: ReportComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'REPORTS'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
}
