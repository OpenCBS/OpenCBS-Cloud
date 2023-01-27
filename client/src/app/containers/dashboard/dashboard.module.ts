import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NglModule } from 'ngx-lightning';
import { CoreModule } from '../../core/core.module';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard-component/dashboard.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    CoreModule,
    NglModule,
    DashboardRoutingModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: []
})
export class DashboardModule {
}
