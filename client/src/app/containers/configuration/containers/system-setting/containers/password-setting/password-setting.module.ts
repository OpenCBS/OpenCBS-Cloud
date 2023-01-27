import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NglModule } from 'ngx-lightning';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../../../core/core.module';
import { PasswordSettingRoutingModule } from './password-setting-routing.module';
import { PasswordSettingsComponent } from './password-settings/password-settings.component';
import { PasswordSettingsEditComponent } from './password-settings-edit/password-settings-edit.component';


@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CoreModule,
    FormsModule,
    NglModule.forRoot(),
    PasswordSettingRoutingModule
  ],
  declarations: [
    PasswordSettingsComponent,
    PasswordSettingsEditComponent
  ]
})
export class PasswordSettingModule {
}
