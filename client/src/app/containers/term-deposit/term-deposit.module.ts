import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TermDepositRoutingModule } from './term-deposit-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../core/core.module';
import { NglModule } from 'ngx-lightning';
import { TermDepositWrapCreateComponent } from './term-deposit-wrap-create/term-deposit-wrap-create.component';
import { TermDepositWrapEditComponent } from './term-deposit-wrap-edit/term-deposit-wrap-edit.component';
import { TermDepositInfoComponent } from './term-deposit-info/term-deposit-info.component';
import { TermDepositListComponent } from './term-deposit-list/term-deposit-list.component';
import { TermDepositNewComponent } from './term-deposit-new/term-deposit-new.component';
import { TermDepositWrapComponent } from './term-deposit-wrap/term-deposit-wrap.component';
import { TermDepositSideNavService } from './shared/services/term-deposit-side-nav.service';
import { TermDepositSpecialOperationsWrapComponent } from './term-deposit-special-operations/special-operations-wrap.component';
import { TermDepositSpecialOperationComponent } from './term-deposit-special-operations/special-operations/special-operations.component';
import { TermDepositEntriesComponent } from './term-deposit-entries/term-deposit-entries.component';
import { TermDepositAccountTransactionsComponent } from './term-deposit-account-transactions/term-deposit-account-transactions.component';
import { ActualizeTermDepositService } from './shared/services/actualize-term-deposit.service';
import { TermDepositPrintOutComponent } from './term-deposit-print-out/term-deposit-print-out.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    CoreModule,
    NglModule,
    TermDepositRoutingModule
  ],
  declarations: [
    TermDepositInfoComponent,
    TermDepositWrapCreateComponent,
    TermDepositWrapEditComponent,
    TermDepositListComponent,
    TermDepositNewComponent,
    TermDepositWrapComponent,
    TermDepositSpecialOperationsWrapComponent,
    TermDepositSpecialOperationComponent,
    TermDepositEntriesComponent,
    TermDepositAccountTransactionsComponent,
    TermDepositPrintOutComponent
  ],
  providers: [
    TermDepositSideNavService,
    ActualizeTermDepositService]
})
export class TermDepositModule {
}
