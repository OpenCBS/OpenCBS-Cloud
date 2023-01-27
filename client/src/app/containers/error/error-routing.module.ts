import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ServerErrorComponent } from './server-error/server-error.component';
import { NotFoundComponent } from './404/404.component';

const routes: Routes = [
  {
    path: '404',
    component: NotFoundComponent
  },
  {
    path: 'server-error',
    component: ServerErrorComponent
  },
  {
    path: '**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ErrorRoutingModule {
}
