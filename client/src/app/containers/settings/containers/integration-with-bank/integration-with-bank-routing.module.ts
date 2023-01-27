import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuard } from '../../../../core/guards/route-guard.service';
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


const routes: Routes = [
  {
    path: 'settings/integration-with-bank',
    component: IntegrationWithBankComponent
  },
  {
    path: 'integration-with-bank/integration-with-bank-export-file',
    component: IntegrationWithBankExportFileComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'SEPA'}
  },
  {
    path: 'integration-with-bank/integration-with-bank-export-file-list',
    component: IntegrationWithBankExportFileListComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'SEPA'}
  },
  {
    path: 'integration-with-bank/integration-with-bank-import-file',
    component: IntegrationWithBankImportFileComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'SEPA'}
  },
  {
    path: 'integration-with-bank/integration-with-bank-import-file-list',
    component: IntegrationWithBankImportFileListComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'SEPA'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IntegrationWithBankRoutingModule {
}
