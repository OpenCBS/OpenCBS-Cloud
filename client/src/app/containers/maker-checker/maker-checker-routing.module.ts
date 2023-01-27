import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth-guard.service';
import { RouteGuard } from '../../core/guards/route-guard.service';
import { MakerCheckerListComponent } from './maker-checker-list/maker-checker-list.component';

const routes: Routes = [
  {
    path: 'requests',
    component: MakerCheckerListComponent,
    canActivate: [AuthGuard, RouteGuard],
    data: {groupName: 'MAKER_CHECKER'},
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MakerCheckerRoutingModule {
}
