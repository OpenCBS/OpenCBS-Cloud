import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';

import { HolidaysRoutingModule } from './holidays-routing.module';
import { HolidaysListComponent } from './holidays/holidays.component';
import { NglModule } from 'ngx-lightning';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    NglModule,
    HolidaysRoutingModule
  ],
  declarations: [
    HolidaysListComponent
  ]
})
export class HolidaysModule {
}
