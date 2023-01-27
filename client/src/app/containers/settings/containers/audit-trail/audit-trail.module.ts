import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';

import { NglModule } from 'ngx-lightning';
import { AuditTrailRoutingModule } from './audit-trail-routing.module';
import { AuditTrailBusinessObjectsComponent } from './audit-trail-business-objects/audit-trail-business-objects.component';
import { AuditTrailEventsComponent } from './audit-trail-events/audit-trail-events.component';
import { AuditTrailTransactionsComponent } from './audit-trail-transactions/audit-trail-transactions.component';
import { AuditTrailUserSessionsComponent } from './audit-trail-user-sessions/audit-trail-user-sessions.component';
import { HistoryLogService } from './shared/services/history-log.service';
import { AuditTrailsComponent } from './audit-trails/audit-trails.component';

@NgModule({
  imports: [
    CommonModule,
    AuditTrailRoutingModule,
    CoreModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NglModule,
  ],
  declarations: [
    AuditTrailsComponent,
    AuditTrailBusinessObjectsComponent,
    AuditTrailEventsComponent,
    AuditTrailTransactionsComponent,
    AuditTrailUserSessionsComponent
  ],
  providers: [
    HistoryLogService
  ]
})
export class AuditTrailModule {
}
