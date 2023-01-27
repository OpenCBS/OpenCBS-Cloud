import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NglModule } from 'ngx-lightning';
import { TranslateModule } from '@ngx-translate/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { OverlayModule } from '@angular/cdk/overlay';
import { NgxMaskModule } from 'ngx-mask'
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

import {
  DatepickerComponent,
  DynamicFieldDirective,
  FormButtonComponent,
  FormCheckboxComponent,
  FormDateComponent,
  FormDateControlComponent,
  FormInputComponent,
  FormInputControlComponent,
  FormLayoutComponent,
  FormLookupComponent,
  FormLookupControlComponent,
  FormReadonlyControlComponent,
  FormSelectComponent,
  FormSelectControlComponent,
  FormTextareaComponent,
  FormTextareaControlComponent,
  FormTimeComponent,
  FormGridComponent,
  InputMaskComponent,
  PicklistComponent
} from './components';

import { DynamicFormComponent } from './containers/dynamic-form/dynamic-form.component';
import { OnlyNumberDirective } from '../../directives/only-number.directive';
import { MatFormFieldModule } from '@angular/material/form-field';
import { inject, InjectionToken } from '@angular/core/src/metadata/lifecycle_hooks';
import { LocalStorageService } from '../../../core/services';
import { TableModule } from 'primeng/table';

const COMPONENTS = [
  DynamicFieldDirective,
  DynamicFormComponent,
  FormButtonComponent,
  FormInputComponent,
  FormSelectComponent,
  FormTextareaComponent,
  FormDateComponent,
  InputMaskComponent,
  DatepickerComponent,
  PicklistComponent,
  FormLookupComponent,
  FormCheckboxComponent,
  FormTimeComponent,
  FormGridComponent,
  FormDateControlComponent,
  FormLookupControlComponent,
  FormInputControlComponent,
  FormSelectControlComponent,
  FormTextareaControlComponent,
  FormReadonlyControlComponent,
  OnlyNumberDirective,
  FormLayoutComponent,
];

export const MY_FORMATS = {
  parse: {
    dateInput: new InjectionToken('Date format', {
      factory: () => {
        return inject(LocalStorageService).getDateFormat()
      }
    }).toString(),
  },
  display: {
    dateInput: new InjectionToken('Date format', {
      factory: () => {
        return inject(LocalStorageService).getDateFormat()
      }
    }).toString(),
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InfiniteScrollModule,
    OverlayModule,
    NglModule.forRoot({
      svgPath: '/icons'
    }),
    MatMomentDateModule,
    MatDatepickerModule,
    NgxMaskModule.forRoot(),
    MatFormFieldModule,
    TableModule
  ],
  declarations: COMPONENTS,
  exports: [
    ...COMPONENTS,
    OnlyNumberDirective,
    InfiniteScrollModule
  ],
  providers: [
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ],
  entryComponents: [
    FormButtonComponent,
    FormInputComponent,
    FormSelectComponent,
    FormTextareaComponent,
    FormDateComponent,
    InputMaskComponent,
    DatepickerComponent,
    FormLookupComponent,
    FormCheckboxComponent,
    FormTimeComponent,
    FormGridComponent
  ]
})
export class CbsFormModule {
}
