import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ErrorRoutingModule } from './error-routing.module';
import { ServerErrorComponent } from './server-error/server-error.component';
import { NotFoundComponent } from './404/404.component';

@NgModule({
  imports: [
    CommonModule,
    ErrorRoutingModule
  ],
  declarations: [NotFoundComponent, ServerErrorComponent]
})
export class ErrorModule {
}
