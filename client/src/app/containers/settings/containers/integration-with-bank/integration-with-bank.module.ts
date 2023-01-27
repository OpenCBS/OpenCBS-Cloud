import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';

import { NglModule } from 'ngx-lightning';
import { IntegrationWithBankRoutingModule } from './integration-with-bank-routing.module';
import { IntegrationWithBankComponent } from './integration-with-bank/integration-with-bank.component';
import {
  IntegrationWithBankExportFileComponent
} from './integration-with-bank-export/integration-with-bank-export-file/integration-with-bank-export-file.component';
import {
  IntegrationWithBankExportFileListComponent
} from './integration-with-bank-export/integration-with-bank-export-file-list/integration-with-bank-export-file-list.component';
import {
  IntegrationWithBankImportFileComponent
} from './integration-with-bank-import/integration-with-bank-import-file/integration-with-bank-import-file.component';
import {
  IntegrationWithBankImportFileListComponent
} from './integration-with-bank-import/integration-with-bank-import-file-list/integration-with-bank-import-file-list.component';
import { TableModule } from 'primeng/table';
import { RepaymentImportingLoansService } from './services/repayment-importing-loans.service';

@NgModule({
    imports: [
        CommonModule,
        IntegrationWithBankRoutingModule,
        CoreModule,
        TranslateModule,
        FormsModule,
        ReactiveFormsModule,
        NglModule,
        TableModule,
    ],
  declarations: [
    IntegrationWithBankComponent,
    IntegrationWithBankExportFileComponent,
    IntegrationWithBankExportFileListComponent,
    IntegrationWithBankImportFileComponent,
    IntegrationWithBankImportFileListComponent
  ],
  providers: [
    RepaymentImportingLoansService
  ]
})
export class IntegrationWithBankModule {
}
