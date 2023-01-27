import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NglModule } from 'ngx-lightning';
import { StoreModule } from '@ngrx/store';
import { CbsSharedModule } from '../shared/shared.module';
import { CORE_SERVICES } from './CORE_SERVICES';
import { COMPONENTS } from './COMPONENTS';
import { reducers } from './core.reducer';
import { StompRService } from '@stomp/ng2-stompjs';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    RouterModule,
    TranslateModule,
    CbsSharedModule,
    NglModule,
    StoreModule.forFeature('appStates', reducers),
  ],
  declarations: [
    COMPONENTS
  ],
  exports: [
    COMPONENTS,
    CbsSharedModule
  ],
  providers: [StompRService]
})
export class CoreModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: CoreModule,
      providers: CORE_SERVICES
    }
  }
}
