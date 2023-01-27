import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../core/core.module';
import { NglModule } from 'ngx-lightning';

import { LoanRoutingModule } from './loan-routing.module';
import { LoanAttachmentsComponent } from './loan-attachments/loan-attachments.component';
import {
  LoanCollateralInfoComponent,
  LoanCollateralListComponent,
  LoanUpdateCollateralComponent,
  LoanCollateralFormComponent,
  LoanCreateCollateralComponent
} from './loan-collaterals';
import {
  LoanGuarantorsComponent,
  LoanCreateGuarantorComponent,
  LoanEditGuarantorComponent,
  LoanGuarantorInfoComponent,
  GuarantorFormComponent
} from './loan-guarantors';
import { LoanEntryFeesComponent } from './loan-entry-fees/loan-entry-fees.component';
import { LoanInfoComponent } from './loan-info/loan-info.component';
import { LoansComponent } from './loan-list/loans.component';
import { LoanPayeesComponent } from './loan-payees/loan-payees.component';
import { LoanScheduleComponent } from './loan-schedule/loan-schedule.component';
import { LoanWrapComponent } from './loan-wrap/loan-wrap.component';
import { LoanEventsComponent } from './loan-events/loan-events.component';
import { RepaymentFormComponent } from './shared/components/repayment-form/repayment-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RepaymentService } from './shared/services/repayment.service';
import { LoanRepaymentComponent } from './loan-repayment/loan-repayment.component';
import { RollbackService } from './shared/services/rollback.service';
import { LoanRescheduleComponent } from './loan-reschedule/loan-reschedule.component';
import { RescheduleFormComponent } from './shared/components/reschedule-form/reschedule-form.component';
import { RescheduleService } from './shared/services/reschedule.service';
import { LoanPrintOutComponent } from './loan-print-out/loan-print-out/loan-print-out.component';
import { SpecialOperationsComponent } from './loan-special-operations/special-operations/special-operations.component';
import { OtherFeesComponent } from './loan-special-operations/other-fees/other-fees.component';
import { SpecialOperationsWrapComponent } from './loan-special-operations/special-operations-wrap.component';
import { LoanCustomFieldsComponent } from './loan-custom-fields/loan-custom-fileds-info/loan-custom-fields.component';
import { LoanCustomFieldsEditComponent } from './loan-custom-fields/loan-custom-fields-edit/loan-custom-fields-edit.component';
import { WriteOffService } from './shared/services/write-off.service';
import { LoanAttachmentsExtraService } from './shared/services/loan-attachments-extra.service';
import { LoanPayeeService } from './loan-info/service/loan-payees.service';
import { TopUpComponent } from './loan-special-operations/top-up/top-up.component';
import { LoanApplicationModule } from '../loan-application/loan-application.module';
import { TopUpService } from './shared/services/top-up.service';
import { ActualizeLoanService } from './shared/services/actualize-loan.service';
import { GroupRepaymentService } from './shared/services/group-repayment.service';
import { TableModule } from 'primeng/table';
import { LoanGroupRepaymentComponent } from './loan-group-repayment/loan-group-repayment.component';
import { LoanWrapMakerCheckerComponent } from './loan-wrap-maker-checker/loan-wrap-maker-checker.component';
import { LoanEventsMakerCheckerComponent } from './loan-events-maker-checker/loan-events-maker-checker.component';
import { LoanRepaymentMakerCheckerComponent } from './loan-repayment-maker-checker/loan-repayment-maker-checker.component';
import { LoanCommentsComponent } from './loan-comments/loan-comments.component';
import { ProvisioningComponent } from './loan-special-operations/provisioning/provisioning.component';
import { ProvisioningService } from './shared/services/provisioning.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TooltipModule} from 'primeng/primeng';
import { LoanInfoEntityComponent } from './shared/components/loan-info-entity/loan-info-entity.component';
import { LoanDashboardComponent } from './loan-dashboard/loan-dashboard.component';
import { LoanDashboardService } from './loan-dashboard/service/loan-dashboard.service';
import { ReassignLoanService } from './shared/services/reassign-loan.service';
import { LoanPrintOutPreviewComponent } from './loan-print-out/loan-print-out-preview/loan-print-out-preview.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoanRoutingModule,
    TranslateModule,
    CoreModule,
    LoanApplicationModule,
    TableModule,
    NglModule.forRoot(),
    MatTooltipModule,
    TooltipModule
  ],
  declarations: [
    LoanAttachmentsComponent,
    LoanCreateCollateralComponent,
    LoanCollateralInfoComponent,
    LoanUpdateCollateralComponent,
    LoanCollateralFormComponent,
    LoanPrintOutComponent,
    LoanPrintOutPreviewComponent,
    LoanCollateralListComponent,
    LoanEntryFeesComponent,
    LoanGuarantorsComponent,
    LoanCreateGuarantorComponent,
    LoanEditGuarantorComponent,
    LoanGuarantorInfoComponent,
    GuarantorFormComponent,
    LoanInfoComponent,
    LoansComponent,
    LoanPayeesComponent,
    LoanScheduleComponent,
    LoanWrapComponent,
    LoanEventsComponent,
    RepaymentFormComponent,
    LoanRepaymentComponent,
    LoanGroupRepaymentComponent,
    LoanRescheduleComponent,
    RescheduleFormComponent,
    SpecialOperationsWrapComponent,
    SpecialOperationsComponent,
    OtherFeesComponent,
    LoanCustomFieldsComponent,
    LoanCustomFieldsEditComponent,
    TopUpComponent,
    LoanWrapMakerCheckerComponent,
    LoanEventsMakerCheckerComponent,
    LoanRepaymentMakerCheckerComponent,
    LoanCommentsComponent,
    ProvisioningComponent,
    LoanInfoEntityComponent,
    LoanDashboardComponent
  ],
  providers: [
    RepaymentService,
    RollbackService,
    RescheduleService,
    WriteOffService,
    LoanAttachmentsExtraService,
    LoanPayeeService,
    LoanDashboardService,
    TopUpService,
    ActualizeLoanService,
    GroupRepaymentService,
    ProvisioningService,
    ReassignLoanService
  ]
})
export class LoanModule {
}
