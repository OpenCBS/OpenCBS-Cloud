import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BondsRoutingModule } from './bonds-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../core/core.module';
import { NglModule } from 'ngx-lightning';
import { BondWrapCreateComponent } from './bond-wrap-create/bond-wrap-create.component';
import { BondWrapEditComponent } from './bond-wrap-edit/bond-wrap-edit.component';
import { BondInfoComponent } from './bond-info/bond-info.component';
import { BondListComponent } from './bond-list/bond-list.component';
import { BondNewComponent } from './bond-new/bond-new.component';
import { BondWrapComponent } from './bond-wrap/bond-wrap.component';
import { BondSideNavService } from './shared/services/bond-side-nav.service';
import { ActualizeBondService } from './shared/services/actualize-bond.service';
import { BondScheduleComponent } from './bond-schedule/bond-schedule.component';
import { BondDetailsFormComponent } from './shared/components/bond-details-form/bond-details-form.component';
import { BondFormExtraService } from './shared/services/bond-extra.service';
import { BondOperationsComponent } from './bond-operations/operations/operations.component';
import { BondOperationsWrapComponent } from './bond-operations/bond-operations-wrap.component';
import { BondRepaymentComponent } from './bond-repayment/bond-repayment.component';
import { BondRepaymentFormComponent } from './shared/components/bond-repayment-form/bond-repayment-form.component';
import { BondRepaymentService } from './shared/services/bond-repayment.service';
import { BondInstallmentsService } from './shared/services/bond-installments.service';
import { BondEventsComponent } from './bond-events/bond-events.component';
import { BondRollbackService } from './shared/services/bond-rollback.service';
import { ValueDateBondService } from './shared/services/value-date-bond.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    CoreModule,
    NglModule,
    BondsRoutingModule
  ],
  declarations: [
    BondInfoComponent,
    BondWrapCreateComponent,
    BondWrapEditComponent,
    BondListComponent,
    BondNewComponent,
    BondWrapComponent,
    BondScheduleComponent,
    BondDetailsFormComponent,
    BondEventsComponent,
    BondDetailsFormComponent,
    BondOperationsComponent,
    BondOperationsWrapComponent,
    BondRepaymentComponent,
    BondRepaymentFormComponent
  ],
  providers: [
    BondSideNavService,
    ActualizeBondService,
    BondFormExtraService,
    BondRepaymentService,
    BondInstallmentsService,
    BondRollbackService,
    ValueDateBondService
  ]
})
export class BondsModule {
}
