import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegionalFormatsDateComponent } from './regional-formats-date/regional-formats-date.component';
import { RegionalFormatsNumberComponent } from './regional-formats-number/regional-formats-number.component';
import { RegionalFormatsTimeComponent } from './regional-formats-time/regional-formats-time.component';
import { RegionalFormatsWrapComponent } from './regional-formats-wrap/regional-formats-wrap.component';

const routes: Routes = [
  {
    path: 'configuration/system-setting/containers',
    component: RegionalFormatsWrapComponent,
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'regional-formats-date',
        component: RegionalFormatsDateComponent
      },
      {
        path: 'regional-formats-time',
        component: RegionalFormatsTimeComponent
      },
      {
        path: 'regional-formats-number',
        component: RegionalFormatsNumberComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegionalFormatRoutingModule {
}
