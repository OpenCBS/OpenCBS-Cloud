import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TillsRoutingModule } from './tills-routing.module';
import { TillsComponent } from './till-list/tills.component';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../../../../core/core.module';
import { NglModule } from 'ngx-lightning';
import { ReactiveFormsModule } from '@angular/forms';
import { TillCreateComponent } from './till-create/till-create.component';
import { TillInfoComponent } from './till-info/till-info.component';
import { TillEditComponent } from './till-edit/till-edit.component';
import { TillFormComponent } from './till-form/till-form.component';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    CoreModule,
    NglModule,
    TillsRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [
    TillsComponent,
    TillEditComponent,
    TillFormComponent,
    TillInfoComponent,
    TillCreateComponent]
})
export class TillsModule {
}
