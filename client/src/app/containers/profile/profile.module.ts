import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { NglModule } from 'ngx-lightning';
import { CoreModule } from '../../core/core.module';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfileListComponent } from './profile-list/profile-list.component';
import { NewProfileComponent } from './profile-create/profile-create.component';
import {
  ProfileAttachmentComponent,
  ProfileCurrentAccountsComponent,
  ProfileInfoComponent,
  ProfileInfoEditComponent,
  ProfileWrapComponent,
} from './profile-details';
import { OnEditCanDeactivateGuard } from '../../core/guards';
// tslint:disable-next-line:max-line-length
import { CurrentAccountTransactionsComponent } from './profile-details/current-accounts/current-account-transactions/current-account-transactions.component';
import { ProfilePrintOutComponent } from './profile-details/print-out/profile-print-out.component';
import { ProfileLoanApplicationsComponent } from './profile-details/profile-loan-applications/profile-loan-applications.component';
import { ProfileLoansComponent } from './profile-details/profile-loans/profile-loans.component';
import { SavingsComponent } from './profile-details/savings/savings.component';
import { ProfileEventsComponent } from './profile-details/profile-events/profile-events.component';
import { EventManagerModule } from '../event-manager/event-manager.module';
import { ProfileBorrowingsComponent } from './profile-details/profile-borrowings/profile-borrowings.component';
import { TermDepositsComponent } from './profile-details/term-deposits/term-deposits.component';
import { BondsComponent } from './profile-details/bonds/bonds.component';
import { MembersComponent } from './profile-details/members/members.component';
import { MembersService } from './shared/members.service';
import { ProfileMakerCheckerComponent } from './profile-details/profile-maker-checker/profile-maker-checker.component';
import { BankAccountListService } from './shared/bank-account-list.service';
import { ProfileCreditLinesComponent } from './profile-details/credit-line/profile-credit-lines/profile-credit-lines.component';
import { CreditLineInfoComponent } from './profile-details/credit-line/credit-line-info/credit-line-info.component';
import { CreditLineCreateComponent } from './profile-details/credit-line/credit-line-create/credit-line-create.component';
import { CreditLineFormComponent } from './profile-details/credit-line/shared/credit-line-form/credit-line-form.component';
import { CreditLineEditComponent } from './profile-details/credit-line/credit-line-edit/credit-line-edit.component';
import { LoanProductsModule } from '../configuration/containers/loan-products/loan-products.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    TranslateModule,
    CoreModule,
    NglModule,
    ProfileRoutingModule,
    EventManagerModule,
    LoanProductsModule
  ],
  declarations: [
    ProfileListComponent,
    NewProfileComponent,
    ProfileWrapComponent,
    ProfileInfoEditComponent,
    ProfileInfoComponent,
    ProfileAttachmentComponent,
    ProfilePrintOutComponent,
    ProfileMakerCheckerComponent,
    ProfileCurrentAccountsComponent,
    CurrentAccountTransactionsComponent,
    ProfileLoanApplicationsComponent,
    ProfileLoansComponent,
    SavingsComponent,
    ProfileEventsComponent,
    ProfileBorrowingsComponent,
    TermDepositsComponent,
    BondsComponent,
    MembersComponent,
    ProfileCreditLinesComponent,
    CreditLineInfoComponent,
    CreditLineCreateComponent,
    CreditLineEditComponent,
    CreditLineFormComponent
  ],
  providers: [
    OnEditCanDeactivateGuard,
    MembersService,
    BankAccountListService
  ]
})
export class ProfileModule {
}
