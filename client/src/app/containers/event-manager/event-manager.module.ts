import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NglModule } from 'ngx-lightning';
import { CoreModule } from '../../core/core.module';

import { EventManagerComponent } from './components/event-manager/event-manager.component';
import { ManageEventModalComponent } from './components/manage-event-popup/manage-event-modal.component';
import { EventService } from './event.service';
import { RouteGuard } from '../../core/guards/route-guard.service';

const eventManagerRouting: ModuleWithProviders = RouterModule.forChild([{
  path: 'event-manager',
  component: EventManagerComponent,
  canActivate: [RouteGuard],
  data: {groupName: 'TASKS_MANAGEMENT'}
}]);

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    CoreModule,
    NglModule,
    eventManagerRouting,
  ],
  declarations: [
    EventManagerComponent,
    ManageEventModalComponent
  ],
  exports: [ManageEventModalComponent],
  providers: [
    EventService
  ]
})
export class EventManagerModule {
}
