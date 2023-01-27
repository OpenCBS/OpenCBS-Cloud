import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TellerManagementRoutingModule } from './teller-management-routing.module';
import { TillListComponent } from './till-list/till-list.component';
import { NglModule } from 'ngx-lightning';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../core/core.module';
import { TillOperationListComponent } from './till-operation-list/till-operation-list.component';
import { TillOperationInfoComponent } from './till-operation-info/till-operation-info.component';
import { TillOperationEditComponent } from './till-operation-edit/till-operation-edit.component';
import { OperationsNewComponent } from './till-operation-new/till-operation-new.component';
import { TransferComponent } from './transfer/transfer.component';
import { TillTellerGuard } from './shared/till-teller-guard.service';
import { TillOperationLoansComponent } from './till-operation-loans/till-operation-loans.component';
import { TillOperationLoansRepayComponent } from './till-operation-loans-repay/till-operation-loans-repay.component';
import {
  TillOperationLoansRepayForKazmicroComponent
} from './till-operation-loans-repay-for-kazmicro/till-operation-loans-repay-for-kazmicro.component';
import { TillOperationLoanRepayService } from './shared/till-operation-loan-repay.service';
import { TillOperationWrapListComponent } from './till-operation-wrap-list/till-operation-wrap-list.component';
import { TellerSideNavService } from './shared/teller-management-side-nav.service';
import { TellerSpecialOperationComponent } from './till-special-operations/special-operations/special-operations.component';
import { TillOperationListDetailsComponent } from './till-operation-list-details/till-operation-list-details.component';

@NgModule({
  imports: [
    CommonModule,
    NglModule,
    ReactiveFormsModule,
    TranslateModule,
    CoreModule,
    FormsModule,
    TellerManagementRoutingModule
  ],
  declarations: [
    TillListComponent,
    TillOperationListComponent,
    TillOperationInfoComponent,
    TillOperationEditComponent,
    OperationsNewComponent,
    TransferComponent,
    TillOperationLoansComponent,
    TillOperationLoansRepayComponent,
    TillOperationLoansRepayForKazmicroComponent,
    TillOperationWrapListComponent,
    TellerSpecialOperationComponent,
    TillOperationListDetailsComponent
  ],
  providers: [
    TillTellerGuard,
    TillOperationLoanRepayService,
    TellerSideNavService
  ]
})
export class TellerManagementModule {
}
