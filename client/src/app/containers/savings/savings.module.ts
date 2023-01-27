import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SavingsRoutingModule } from './savings-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../core/core.module';
import { NglModule } from 'ngx-lightning';
import { SavingWrapCreateComponent } from './saving-wrap-create/saving-wrap-create.component';
import { SavingWrapEditComponent } from './saving-wrap-edit/saving-wrap-edit.component';
import { SavingInfoComponent } from './saving-info/saving-info.component';
import { SavingListComponent } from './saving-list/saving-list.component';
import { SavingNewComponent } from './saving-new/saving-new.component';
import { SavingWrapComponent } from './saving-wrap/saving-wrap.component';
import { SavingSideNavService } from './shared/services/saving-side-nav.service';
import { SavingSpecialOperationsWrapComponent } from './saving-special-operations/special-operations-wrap.component';
import { SavingSpecialOperationComponent } from './saving-special-operations/special-operations/special-operations.component';
import { ActualizeSavingService } from './shared/services/actualize-saving.service';
import { SavingPrintOutComponent } from './saving-print-out/saving-print-out.component';
import { SavingEntriesComponent } from './saving-entries/saving-entries.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    CoreModule,
    NglModule,
    SavingsRoutingModule
  ],
  declarations: [
    SavingInfoComponent,
    SavingWrapCreateComponent,
    SavingWrapEditComponent,
    SavingListComponent,
    SavingNewComponent,
    SavingWrapComponent,
    SavingSpecialOperationsWrapComponent,
    SavingEntriesComponent,
    SavingSpecialOperationComponent,
    SavingPrintOutComponent
  ],
  providers: [
    SavingSideNavService,
    ActualizeSavingService
  ]
})

export class SavingsModule {
}
