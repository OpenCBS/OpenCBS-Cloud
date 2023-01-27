import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SystemSettingsComponent } from './system-settings/system-settings.component';

const routes: Routes = [
  {
    path: 'configuration/system-settings',
    component: SystemSettingsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SystemSettingRoutingModule {
}
