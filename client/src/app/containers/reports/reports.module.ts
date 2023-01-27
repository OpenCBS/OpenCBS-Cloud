import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NglModule} from 'ngx-lightning';
import { CoreModule } from '../../core/core.module';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportListComponent } from './report-list-component/report-list.component';
import { ReportService } from './shared/reports.service';
import { ReportComponent } from './report-component/report.component';
import { DropdownModule } from 'primeng/primeng';
import { ShareService } from './shared/share.service';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    CoreModule,
    NglModule.forRoot(),
    DropdownModule,
    ReportsRoutingModule
  ],
  declarations: [
    ReportListComponent,
    ReportComponent
  ],
  providers: [
    ReportService,
    ShareService
  ]
})
export class ReportsModule {
}
