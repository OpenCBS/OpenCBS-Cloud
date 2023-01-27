import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../core/core.module';
import { NglModule } from 'ngx-lightning';

import { MakerCheckerRoutingModule } from './maker-checker-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { MakerCheckerListComponent } from './maker-checker-list/maker-checker-list.component';


@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    MakerCheckerRoutingModule,
    TranslateModule,
    CoreModule,
    TableModule,
    NglModule
  ],
  declarations: [
    MakerCheckerListComponent
  ],
  providers: []
})
export class MakerCheckerModule {
}
