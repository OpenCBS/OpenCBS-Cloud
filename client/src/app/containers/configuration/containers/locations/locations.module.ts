import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';

import { LocationsRoutingModule } from './locations-routing.module';
import { LocationsComponent } from './locations/locations.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    LocationsRoutingModule
  ],
  declarations: [
    LocationsComponent
  ]
})
export class LocationsModule {
}
