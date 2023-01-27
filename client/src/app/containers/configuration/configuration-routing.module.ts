import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ConfigurationComponent } from './configuration/configuration.component';
import { ConfigurationWrapComponent } from './configuration-wrap/configuration-wrap.component';
import { RouteGuard } from '../../core/guards/route-guard.service';

const routes: Routes = [
  {
    path: 'configuration',
    component: ConfigurationWrapComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'CONFIGURATIONS'},
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: ConfigurationComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ConfigurationRoutingModule {
}
