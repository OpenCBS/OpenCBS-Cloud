import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PasswordSettingsComponent } from './password-settings/password-settings.component';
import { PasswordSettingsEditComponent } from './password-settings-edit/password-settings-edit.component';

const routes: Routes = [
  {
    path: 'configuration/system-setting/containers/password-setting/password-settings/:type',
    component: PasswordSettingsComponent
  },
  {
    path: 'configuration/system-setting/containers/password-setting/password-settings/:type/edit',
    component: PasswordSettingsEditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PasswordSettingRoutingModule {
}
