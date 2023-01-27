import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NglModule } from 'ngx-lightning';
import { CoreModule } from '../../../../core/core.module';

import { PenaltiesRoutingModule } from './penalties-routing.module';
import { PenaltiesComponent } from './penalties-list/penalties.component';
import { PenaltiesFormModalComponent } from './shared/penalties-form-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    TranslateModule,
    NglModule,
    PenaltiesRoutingModule
  ],
  declarations: [
    PenaltiesComponent,
    PenaltiesFormModalComponent
  ]
})
export class PenaltiesModule {
}
