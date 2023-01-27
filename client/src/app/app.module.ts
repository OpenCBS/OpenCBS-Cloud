import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NglModule  } from 'ngx-lightning';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { ProfileModule } from './containers/profile/profile.module';
import { AuthModule } from './containers/auth/auth.module';
import { MetaReducer, StoreModule } from '@ngrx/store';
import { storeFreeze } from 'ngrx-store-freeze';
import { EffectsModule } from '@ngrx/effects';
import { TellerManagementModule } from './containers/teller-management/teller-management.module'
import { LoanApplicationModule } from './containers/loan-application/loan-application.module';
import { ReportsModule } from './containers/reports/reports.module';
import { ConfigurationModule } from './containers/configuration/configuration.module';
import { LoanModule } from './containers/loan/loan.module';
import { AccountingModule } from './containers/accounting/accounting.module';
import { EventManagerModule } from './containers/event-manager/event-manager.module';
import { coreEffects } from './core/core.effects';
import { TermDepositModule } from './containers/term-deposit/term-deposit.module';
import { SavingsModule } from './containers/savings/savings.module';
import { BorrowingModule } from './containers/borrowing/borrowing.module';
import { DashboardModule } from './containers/dashboard/dashboard.module';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { SettingsModule } from './containers/settings/settings.module';
import { BondsModule } from './containers/bonds/bonds.module';
import { MakerCheckerModule } from './containers/maker-checker/maker-checker.module';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { LoanPayeeModule } from './containers/loan-payee/loan-payee.module';
import { HttpHeaderInterceptorService } from './core/services/http-header-interceptor.service';
import { TransfersModule } from './containers/transfers/transfers.module'


const environment = {
  development: true,
  production: false,
};

export const metaReducers: MetaReducer<any>[] = !environment.production ? [storeFreeze] : [];

export function createTranslateLoader(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient, './assets/i18n/', '.json');
}


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    CoreModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    NglModule.forRoot(),
    ToastrModule.forRoot(),
    StoreModule.forRoot({}, {metaReducers}),
    EffectsModule.forRoot(coreEffects),
    AppRoutingModule,
    ProfileModule,
    TellerManagementModule,
    AuthModule,
    LoanApplicationModule,
    BorrowingModule,
    ReportsModule,
    DashboardModule,
    ConfigurationModule,
    SettingsModule,
    LoanModule,
    LoanPayeeModule,
    AccountingModule,
    EventManagerModule,
    SavingsModule,
    TermDepositModule,
    BondsModule,
    MakerCheckerModule,
    TransfersModule,
    StoreDevtoolsModule.instrument({
      maxAge: 10
    })
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: HttpHeaderInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
