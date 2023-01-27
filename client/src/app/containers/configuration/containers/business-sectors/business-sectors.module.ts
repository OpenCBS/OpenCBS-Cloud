import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from '../../../../core/core.module';
import { TranslateModule } from '@ngx-translate/core';

import { BusinessSectorsRoutingModule } from './business-sectors-routing.module';
import { BusinessSectorsListComponent } from './business-sectors/business-sectors.component';

@NgModule({
  imports: [
    CommonModule,
    CoreModule,
    TranslateModule,
    BusinessSectorsRoutingModule
  ],
  declarations: [
    BusinessSectorsListComponent
  ]
})
export class BusinessSectorsModule {
}
