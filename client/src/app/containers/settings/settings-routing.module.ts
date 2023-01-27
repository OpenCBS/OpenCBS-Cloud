import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteGuard } from '../../core/guards/route-guard.service';
import { SettingsWrapComponent } from './settings-wrap/settings-wrap.component';
import { SettingsComponent } from './settings/settings.component';

const routes: Routes = [
  {
    path: 'settings',
    component: SettingsWrapComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'SETTINGS'},
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: SettingsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {
}
