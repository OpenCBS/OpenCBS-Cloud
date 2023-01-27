import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../core/core.module';
import { TranslateModule } from '@ngx-translate/core';
import { NglModule } from 'ngx-lightning';

import { AccountingRoutingModule } from './accounting-routing.module';
import { AccountingEntriesComponent } from './accounting-entries/accounting-entries.component';
import { ChartOfAccountsComponent } from './chart-of-accounts/chart-of-accounts.component';
import { ChildrenAccountsService } from './chart-of-accounts/shared/services/children-accounts.service';
import { AccountsTreeTableComponent } from './chart-of-accounts/shared/components/accounts-tree-table.component';
import { LoadingService } from './chart-of-accounts/shared/services/loading-service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AccountingEntriesTransactionService
} from './accounting-entries/accounting-entries-transaction-service/accounting-entries-transaction.service';
import { MakerCheckerAccountsComponent } from './maker-checker-accounts/maker-checker-accounts.component';

@NgModule({
  imports: [
    CommonModule,
    AccountingRoutingModule,
    CoreModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    NglModule,
  ],
  declarations: [
    AccountingEntriesComponent,
    ChartOfAccountsComponent,
    AccountsTreeTableComponent,
    MakerCheckerAccountsComponent
  ],
  providers: [
    ChildrenAccountsService,
    LoadingService,
    AccountingEntriesTransactionService]
})
export class AccountingModule {
}
