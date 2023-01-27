import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AuthComponent } from './auth/auth.component';
import { TranslateModule } from '@ngx-translate/core';
import { NoAuthGuard } from '../../core/guards/no-auth-guard.service';
import { CoreModule } from '../../core/core.module';
import { NglModule } from 'ngx-lightning';

const routes: Routes = [
  {
    path: 'login',
    component: AuthComponent,
    canActivate: [NoAuthGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    NglModule,
    FormsModule,
    TranslateModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    CoreModule
  ],
  declarations: [AuthComponent]
})
export class AuthModule {
}
