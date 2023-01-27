import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuard } from '../../../../core/guards/route-guard.service';
import { AuditTrailBusinessObjectsComponent } from './audit-trail-business-objects/audit-trail-business-objects.component';
import { AuditTrailEventsComponent} from './audit-trail-events/audit-trail-events.component';
import { AuditTrailTransactionsComponent } from './audit-trail-transactions/audit-trail-transactions.component';
import { AuditTrailUserSessionsComponent } from './audit-trail-user-sessions/audit-trail-user-sessions.component';
import { AuditTrailsComponent } from './audit-trails/audit-trails.component';


const routes: Routes = [
  {
    path: 'settings/audit-trails',
    component: AuditTrailsComponent
  },
  {
    path: 'audit-trail/business-objects',
    component: AuditTrailBusinessObjectsComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'AUDIT_TRAIL'}
  },
  {
    path: 'audit-trail/events',
    component: AuditTrailEventsComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'AUDIT_TRAIL'}
  },
  {
    path: 'audit-trail/transactions',
    component: AuditTrailTransactionsComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'AUDIT_TRAIL'}
  },
  {
    path: 'audit-trail/user-sessions',
    component: AuditTrailUserSessionsComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'AUDIT_TRAIL'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuditTrailRoutingModule {
}
