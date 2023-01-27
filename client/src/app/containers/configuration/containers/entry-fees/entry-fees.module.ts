import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NglModule } from 'ngx-lightning';
import { CoreModule } from '../../../../core/core.module';

import { EntryFeesRoutingModule } from './entry-fees-routing.module';
import { EntryFeesComponent } from './entry-fees-list/entry-fees.component';
import { EntryFeesFormModalComponent } from './shared/entry-fees-form-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreModule,
    TranslateModule,
    NglModule,
    EntryFeesRoutingModule
  ],
  declarations: [
    EntryFeesComponent,
    EntryFeesFormModalComponent
  ]
})
export class EntryFeesModule {
}
