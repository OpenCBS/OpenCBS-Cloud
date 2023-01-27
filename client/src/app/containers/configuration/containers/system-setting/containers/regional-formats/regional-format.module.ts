import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NglModule } from 'ngx-lightning';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../../../core/core.module';
import { RegionalFormatRoutingModule } from './regional-format-routing.module';
import { RegionalFormatsDateComponent, SettingDateFormatPipe } from './regional-formats-date/regional-formats-date.component';
import { RegionalFormatsTimeComponent } from './regional-formats-time/regional-formats-time.component';
import { RegionalFormatsNumberComponent, SettingNumberFormatPipe } from './regional-formats-number/regional-formats-number.component';
import { NavElements } from './shared/services/formats.service';
import { RegionalFormatsWrapComponent } from './regional-formats-wrap/regional-formats-wrap.component';
import { ShareService } from './shared/services/share.service';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CoreModule,
    FormsModule,
    NglModule.forRoot(),
    RegionalFormatRoutingModule
  ],
  declarations: [
    RegionalFormatsWrapComponent,
    RegionalFormatsDateComponent,
    RegionalFormatsTimeComponent,
    RegionalFormatsNumberComponent,
    SettingDateFormatPipe,
    SettingNumberFormatPipe
  ],
  providers: [
    NavElements,
    ShareService
  ]
})
export class RegionalFormatModule {
}
