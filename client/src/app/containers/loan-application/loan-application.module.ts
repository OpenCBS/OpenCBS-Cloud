import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NglModule } from 'ngx-lightning';
import { TranslateModule } from '@ngx-translate/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CoreModule } from '../../core/core.module';

import { LoanApplicationRoutingModule } from './loan-application-routing.module';
import { LoanApplicationAttachmentsComponent } from './loan-application-attachments/loan-application-attachments.component';
import {
  LoanAppCollateralInfoComponent,
  LoanAppCollateralListComponent,
  LoanAppCreateCollateralComponent,
  LoanAppUpdateCollateralComponent
} from './loan-application-collaterals';
import { CreditCommitteeComponent } from './loan-application-credit-committee/loan-application-credit-committee.component';
import {
  LoanAppCreateGuarantorComponent,
  LoanAppEditGuarantorComponent,
  LoanAppGuarantorInfoComponent,
  LoanAppGuarantorsComponent
} from './loan-application-guarantors';
import { LoanApplicationInfoComponent } from './loan-application-info/loan-application-info.component';
import { LoanApplicationListComponent } from './loan-application-list/loan-application-list.component';
import { LoanAppScheduleComponent } from './loan-application-schedule/loan-application-schedule.component';
import { LoanAppWrapComponent } from './loan-application-wrap/loan-application-wrap.component';
import { LoanAppWrapCreateComponent } from './loan-application-wrap-create/loan-application-wrap-create.component';
import { LoanAppNewComponent } from './loan-app-new/loan-app-new.component';
import { LoanAppWrapEditComponent } from './loan-application-wrap-edit/loan-application-wrap-edit.component';
import { LoanAppPrintOutComponent } from './loan-app-print-out/loan-app-print-out/loan-app-print-out.component';

import {
  CCStatusFormComponent,
  EntryFeesModalComponent,
  GuarantorFormComponent,
  LoanAppCollateralFormComponent,
  LoanAppDisburseButtonComponent,
  LoanAppSubmitButtonComponent,
  LoanDetailsFormComponent,
  LoanDetailsReadOnlyFormComponent
} from './shared/components';

import { LoanAppFormExtraService, LoanAppSideNavService, LoanAppSubmitService } from './shared/services';
// tslint:disable-next-line:max-line-length
import { LoanApplicationCustomFieldEditComponent } from './loan-application-custom-fields/loan-application-custom-field-edit/loan-application-custom-field-edit.component';
import { LoanApplicationCustomFieldInfoComponent } from './loan-application-custom-fields/loan-application-custom-field-info/loan-application-custom-field-info.component';
import { LoanAppMakerCheckerDisburseComponent } from './loan-app-maker-checker-disburse/loan-app-maker-checker-disburse.component';
import { LoanAppMakerCheckerWrapComponent } from './loan-app-maker-checker-wrap/loan-app-maker-checker-wrap.component';
import { LoanApplicationCommentsComponent } from './loan-application-comments/loan-application-comments.component';
import { TableModule } from 'primeng/table';
import { LoanAppPrintOutPreviewComponent } from './loan-app-print-out/loan-app-print-out-preview/loan-app-print-out-preview.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    CoreModule,
    NglModule.forRoot(),
    LoanApplicationRoutingModule,
    TableModule
  ],
  declarations: [
    LoanApplicationAttachmentsComponent,
    LoanAppCollateralListComponent,
    LoanAppCreateCollateralComponent,
    LoanAppCollateralInfoComponent,
    LoanAppUpdateCollateralComponent,
    CreditCommitteeComponent,
    LoanAppCreateGuarantorComponent,
    LoanAppEditGuarantorComponent,
    LoanAppGuarantorsComponent,
    LoanAppGuarantorInfoComponent,
    LoanApplicationInfoComponent,
    LoanApplicationListComponent,
    LoanAppPrintOutComponent,
    LoanAppPrintOutPreviewComponent,
    LoanAppScheduleComponent,
    LoanAppWrapComponent,
    LoanAppWrapCreateComponent,
    GuarantorFormComponent,
    CCStatusFormComponent,
    LoanAppCollateralFormComponent,
    LoanDetailsFormComponent,
    LoanDetailsReadOnlyFormComponent,
    LoanAppDisburseButtonComponent,
    LoanAppSubmitButtonComponent,
    LoanAppNewComponent,
    EntryFeesModalComponent,
    LoanAppWrapEditComponent,
    LoanApplicationCustomFieldEditComponent,
    LoanApplicationCustomFieldInfoComponent,
    LoanAppMakerCheckerWrapComponent,
    LoanAppMakerCheckerDisburseComponent,
    LoanApplicationCommentsComponent
  ],
  exports: [EntryFeesModalComponent],
  providers: [
    LoanAppFormExtraService,
    LoanAppSideNavService,
    LoanAppSubmitService
  ]
})
export class LoanApplicationModule {
}
