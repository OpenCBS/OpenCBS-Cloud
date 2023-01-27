import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NglModule } from 'ngx-lightning';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../core/core.module';
import { BorrowingRoutingModule } from './borrowing-routing.module';
import { BorrowingDetailsFormComponent } from './shared/components/borrowing-details-form/borrowing-details-form.component';
import { BorrowingNewComponent } from './borrowing-new/borrowing-new.component';
import { BorrowingWrapCreateComponent } from './borrowing-wrap-create/borrowing-wrap-create.component';
import { BorrowingFormExtraService } from './shared/services/borrowing-extra.service';
import { BorrowingScheduleComponent } from './borrowing-schedule/borrowing-schedule.component';
import { BorrowingWrapComponent } from './borrowing-wrap/borrowing-wrap.component';
import { BorrowingInfoComponent } from './borrowing-info/borrowing-info.component';
import { BorrowingWrapEditComponent } from './borrowing-wrap-edit/borrowing-wrap-edit.component';
import { BorrowingSideNavService } from './shared/services/borrowing-side-nav.service';
import { BorrowingEventsComponent } from './borrowing-events/borrowing-events.component';
import { BorrowingOperationsWrapComponent } from './borrowing-operations/borrowing-operations-wrap.component';
import { BorrowingOperationsComponent } from './borrowing-operations/operations/operations.component';
import { BorrowingRepaymentComponent } from './borrowing-repayment/borrowing-repayment.component';
import { BorrowingRepaymentFormComponent } from './shared/components/borrowing-repayment-form/borrowing-repayment-form.component';
import { BorrowingInstallmentsService } from './shared/services/borrowing-installments.service';
import { BorrowingRepaymentService } from './shared/services/borrowing-repayment.service';
import { BorrowingListComponent } from './borrowing-list/borrowing-list.component';
import { BorrowingRollbackService } from './shared/services/borrowing-rollback.service';
import { ActualizeBorrowingService } from './shared/services/actualize-borrowing.service';


@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    NglModule,
    BorrowingRoutingModule
  ],
  declarations: [
    BorrowingNewComponent,
    BorrowingDetailsFormComponent,
    BorrowingWrapCreateComponent,
    BorrowingScheduleComponent,
    BorrowingWrapComponent,
    BorrowingInfoComponent,
    BorrowingWrapEditComponent,
    BorrowingEventsComponent,
    BorrowingOperationsWrapComponent,
    BorrowingOperationsComponent,
    BorrowingRepaymentComponent,
    BorrowingRepaymentFormComponent,
    BorrowingListComponent
  ],
  providers: [
    BorrowingFormExtraService,
    BorrowingSideNavService,
    BorrowingInstallmentsService,
    BorrowingRepaymentService,
    BorrowingRollbackService,
    ActualizeBorrowingService
  ]
})
export class BorrowingModule {
}
