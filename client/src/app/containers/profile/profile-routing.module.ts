import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileListComponent } from './profile-list/profile-list.component';
import { NewProfileComponent } from './profile-create/profile-create.component';
import { ProfileWrapComponent } from './profile-details/profile-wrap.component';
import { ProfileInfoComponent } from './profile-details/info/profile-info.component';
import { ProfileInfoEditComponent } from './profile-details/info-edit/profile-info-edit.component';
import { ProfileAttachmentComponent } from './profile-details/attachments/profile-attachment.component';
import { AuthGuard } from '../../core/guards/auth-guard.service';
import { ProfileCurrentAccountsComponent } from './profile-details/current-accounts/profile-current-accounts.component';
import { OnEditCanDeactivateGuard } from '../../core/guards/on-edit-deactivate-guard.service';
import { CurrentAccountTransactionsComponent } from './profile-details/current-accounts/current-account-transactions/current-account-transactions.component';
import { ProfilePrintOutComponent } from './profile-details/print-out/profile-print-out.component';
import { ProfileLoanApplicationsComponent } from './profile-details/profile-loan-applications/profile-loan-applications.component';
import { ProfileLoansComponent } from './profile-details/profile-loans/profile-loans.component';
import { SavingsComponent } from './profile-details/savings/savings.component';
import { ProfileEventsComponent } from './profile-details/profile-events/profile-events.component';
import { ProfileBorrowingsComponent } from './profile-details/profile-borrowings/profile-borrowings.component';
import { RouteGuard } from '../../core/guards/route-guard.service';
import { TermDepositsComponent } from './profile-details/term-deposits/term-deposits.component';
import { BondsComponent } from './profile-details/bonds/bonds.component';
import { MembersComponent } from './profile-details/members/members.component';
import { ProfileMakerCheckerComponent } from './profile-details/profile-maker-checker/profile-maker-checker.component';
import { ProfileCreditLinesComponent } from './profile-details/credit-line/profile-credit-lines/profile-credit-lines.component';
import { CreditLineInfoComponent } from './profile-details/credit-line/credit-line-info/credit-line-info.component';
import { CreditLineCreateComponent } from './profile-details/credit-line/credit-line-create/credit-line-create.component';
import { CreditLineEditComponent } from './profile-details/credit-line/credit-line-edit/credit-line-edit.component';

const routes: Routes = [
  {
    path: 'profiles',
    component: ProfileListComponent,
    canActivate: [AuthGuard, RouteGuard],
    data: {groupName: 'PROFILES'}
  },
  {
    path: 'profiles/:type/create',
    component: NewProfileComponent,
    canActivate: [AuthGuard, RouteGuard],
    data: {roles: ['MAKER_FOR_PROFILE', 'CREATE_PROFILE']}
  },
  {
    path: 'profile-maker-checker/:id',
    component: ProfileMakerCheckerComponent,
    canActivate: [AuthGuard, RouteGuard],
    data: {groupName: 'PROFILES'}
  },
  {
    path: 'profiles/:type/:id',
    component: ProfileWrapComponent,
    canActivate: [AuthGuard, RouteGuard],
    data: {groupName: 'PROFILES'},
    children: [
      {
        path: '',
        redirectTo: 'info',
        pathMatch: 'full'
      },
      {
        path: 'info',
        component: ProfileInfoComponent
      },
      {
        path: 'info/edit',
        component: ProfileInfoEditComponent,
        canDeactivate: [OnEditCanDeactivateGuard],
        canActivate: [AuthGuard, RouteGuard],
        data: {roles: ['UPDATE_PROFILE', 'MAKER_FOR_PROFILE']}
      },
      {
        path: 'current-accounts',
        component: ProfileCurrentAccountsComponent,
      },
      {
        path: 'current-accounts/:id/transactions',
        component: CurrentAccountTransactionsComponent
      },
      {
        path: 'attachments',
        component: ProfileAttachmentComponent
      },
      {
        path: 'print-out',
        component: ProfilePrintOutComponent
      },
      {
        path: 'credit-line-list',
        component: ProfileCreditLinesComponent
      },
      {
        path: 'credit-line/:id',
        component: CreditLineInfoComponent
      },
      {
        path: 'credit-line/:id/edit',
        component: CreditLineEditComponent
      },
      {
        path: 'credit-line-create',
        component: CreditLineCreateComponent
      },
      {
        path: 'loan-applications',
        component: ProfileLoanApplicationsComponent
      },
      {
        path: 'loans',
        component: ProfileLoansComponent
      },
      {
        path: 'borrowings',
        component: ProfileBorrowingsComponent
      },
      {
        path: 'savings',
        component: SavingsComponent
      },
      {
        path: 'term-deposits',
        component: TermDepositsComponent
      },
      {
        path: 'bonds',
        component: BondsComponent
      },
      {
        path: 'events',
        component: ProfileEventsComponent
      },
      {
        path: 'members',
        component: MembersComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule {
}
