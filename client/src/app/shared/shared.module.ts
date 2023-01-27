import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NglModule } from 'ngx-lightning';
import { TranslateModule } from '@ngx-translate/core';
import { DataTableModule, SharedModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

import { CbsTreeTableModule } from './modules/cbs-tree-table/treetable.component';
import { FileUploadModule } from './modules/cbs-file-upload/file-upload';
import { CbsCustomFieldBuilderModule } from './modules/cbs-custom-field-builder/cf-builder.module';
import { ChipsModule } from './modules/cbs-chips/chips.module';
import { CbsFormModule } from './modules/cbs-form/cbs-form.module';

import { COMPONENTS } from './COMPONENTS';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule } from '@angular/material-moment-adapter';

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    TranslateModule,
    DataTableModule,
    SharedModule,
    CbsTreeTableModule,
    FileUploadModule,
    CbsCustomFieldBuilderModule,
    ChipsModule,
    CbsFormModule,
    ScheduleModule,
    NglModule,
    TableModule,
    MultiSelectModule,
    MatMomentDateModule,
    MatDatepickerModule
  ],
  exports: [
    ...COMPONENTS,
    CbsTreeTableModule,
    FileUploadModule,
    CbsCustomFieldBuilderModule,
    ChipsModule,
    CbsFormModule,
    DataTableModule,
    ScheduleModule,
    SharedModule,
    MatDatepickerModule
  ],
  declarations: COMPONENTS
})
export class CbsSharedModule {
}
