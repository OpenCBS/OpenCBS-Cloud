import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RouteGuard } from '../../core/guards/route-guard.service';
import { TransfersComponent } from './transfers-component/transfers.component';
import { TransferFromBankToVaultComponent } from './transfer-from-bank-to-vault/transfer-from-bank-to-vault.component'
import { TransferFromVaultToBankComponent } from './transfer-from-vault-to-bank/transfer-from-vault-to-bank.component'
import { TransferBetweenMembersComponent } from './transfer-between-members/transfer-between-members.component'

const routes: Routes = [
  {
    path: 'transfers',
    component: TransfersComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'TRANSFERS'}
  },
  {
    path: 'transfers/from-bank-to-vault',
    component: TransferFromBankToVaultComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'TRANSFERS'}
  },
  {
    path: 'transfers/from-vault-to-bank',
    component: TransferFromVaultToBankComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'TRANSFERS'}
  },
  {
    path: 'transfers/between-members',
    component: TransferBetweenMembersComponent,
    canActivate: [RouteGuard],
    data: {groupName: 'TRANSFERS'}
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TransfersRoutingModule {
}
