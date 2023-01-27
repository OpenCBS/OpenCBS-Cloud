import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../../core/core.module';
import { TranslateModule } from '@ngx-translate/core';

import { ProfessionsRoutingModule } from './professions-routing.module';
import { ProfessionsComponent } from './professions/professions.component';

@NgModule({
  imports: [
    CommonModule,
    ProfessionsRoutingModule,
    CoreModule,
    TranslateModule
  ],
  declarations: [
    ProfessionsComponent
  ]
})
export class ProfessionsModule {
}
