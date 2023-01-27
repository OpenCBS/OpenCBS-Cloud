import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../core/core.module';
import { NglModule } from 'ngx-lightning';

import { LoanPayeeRoutingModule } from './loan-payee-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { LoanPayeesSideNavService } from './shared/services';
import { LoanPayeesWrapComponent } from './loan-payee-wrap/loan-payees-wrap.component';
import { LoanPayeesInfoComponent } from './loan-payee-info/loan-payees-info.component';
import { LoanPayeeService } from '../loan/loan-info/service/loan-payees.service';
import { LoanPayeesEventsComponent } from './loan-payee-events/loan-payees-events.component';
import { LoanAttachmentsExtraService } from './shared/services/loan-attachments-extra.service';
import {LoanPayeesListComponent} from './loan-payee-list/loan-payees-list.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    LoanPayeeRoutingModule,
    TranslateModule,
    CoreModule,
    TableModule,
    NglModule
  ],
  declarations: [
    LoanPayeesWrapComponent,
    LoanPayeesInfoComponent,
    LoanPayeesEventsComponent,
    LoanPayeesListComponent
  ],
  providers: [
    LoanPayeeService,
    LoanPayeesSideNavService,
    LoanAttachmentsExtraService,
  ]
})
export class LoanPayeeModule {
}
