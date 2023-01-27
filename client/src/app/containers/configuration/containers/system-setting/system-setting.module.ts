import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NglModule } from 'ngx-lightning';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';
import { SystemSettingRoutingModule } from './system-setting-routing.module';
import { SystemSettingsComponent } from './system-settings/system-settings.component';
import { PasswordSettingModule } from './containers/password-setting/password-setting.module';
import { RegionalFormatModule } from './containers/regional-formats/regional-format.module';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CoreModule,
    FormsModule,
    NglModule,
    SystemSettingRoutingModule,
    PasswordSettingModule,
    RegionalFormatModule
  ],
  declarations: [
    SystemSettingsComponent
  ]
})
export class SystemSettingModule {
}
