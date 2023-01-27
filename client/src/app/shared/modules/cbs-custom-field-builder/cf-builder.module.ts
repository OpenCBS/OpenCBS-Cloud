import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CFBuilderComponent } from './cf-builder.component';
import { CFSectionComponent } from './cf-section/cf-section.component';
import { CFFieldComponent } from './cf-field/cf-field.component';
import { CFAddComponent } from './cf-add/cf-add.component';

import { CFBuilderService } from './cf-builder.service';
import { ChipsModule } from '../cbs-chips/chips.module';
import { CapitalizePipe } from './cf-field/capitalize.pipe';
import { TranslateModule } from '@ngx-translate/core';
import { CbsFormModule } from '../cbs-form/cbs-form.module';


const COMPONENTS = [
  CFBuilderComponent,
  CFSectionComponent,
  CFFieldComponent,
  CFAddComponent,
  CapitalizePipe
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ChipsModule,
    TranslateModule,
    CbsFormModule
  ],
  exports: COMPONENTS,
  declarations: COMPONENTS,
  providers: [CFBuilderService],
})
export class CbsCustomFieldBuilderModule {
}
